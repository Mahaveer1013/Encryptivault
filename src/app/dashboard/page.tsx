'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import PasswordCard from '@/components/PasswordCard';
import PasswordForm from '@/components/PasswordForm';
import FolderCard from '@/components/FolderCard';
import { decryptData } from '@/lib/crypto';
import Toast from '@/components/Toast';

export default function Dashboard() {
  const { user, isAuthenticated, masterKey, setMasterKey, loading, logout } = useAuth();
  const [folders, setFolders] = useState<any[]>([]);
  const [passwords, setPasswords] = useState<any[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchFolders() {
      try {
        const response = await fetch('/api/folders');
        if (response.ok) {
          const data = await response.json();
          setFolders(data);
        }
      } catch (error) {
        console.error('Failed to fetch folders', error);
      }
    }

    fetchFolders();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !selectedFolder) return;

    async function fetchPasswords() {
      try {
        const response = await fetch(`/api/passwords?folder=${selectedFolder}`);
        if (response.ok) {
          const data = await response.json();
          setPasswords(data);
        }
      } catch (error) {
        console.error('Failed to fetch passwords', error);
      }
    }

    fetchPasswords();
  }, [isAuthenticated, selectedFolder]);

  const handleDecryptPassword = async (passwordId: string, encryptedPassword: string, iv: string) => {
    if (!masterKey) {
      setToast({ message: 'Master key is required', type: 'error' });
      return;
    }

    try {
      const decrypted = await decryptData(encryptedPassword, masterKey, iv);
      setDecryptedPasswords(prev => ({
        ...prev,
        [passwordId]: decrypted,
      }));
    } catch (error) {
      console.error('Failed to decrypt password', error);
      setToast({ message: 'Failed to decrypt password', type: 'error' });
    }
  };

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setToast({ message: 'Password copied to clipboard', type: 'success' });
  };

  const handleAddPassword = async (site: string, username: string, password: string) => {
    if (!masterKey || !selectedFolder) {
      setToast({ message: 'Master key and folder are required', type: 'error' });
      return;
    }

    try {
      const iv = generateIV();
      const encryptedPassword = await encryptData(password, masterKey, iv);

      const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site,
          username,
          encryptedPassword,
          iv,
          folder: selectedFolder,
        }),
      });

      if (response.ok) {
        const newPassword = await response.json();
        setPasswords(prev => [...prev, newPassword]);
        setShowPasswordForm(false);
        setToast({ message: 'Password added successfully', type: 'success' });
      } else {
        throw new Error('Failed to add password');
      }
    } catch (error) {
      console.error('Failed to add password', error);
      setToast({ message: 'Failed to add password', type: 'error' });
    }
  };

  const handleAddFolder = async (name: string, masterPassword: string) => {
    try {
      const salt = generateSalt();
      const folderKey = deriveKey(masterPassword, salt);

      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          salt,
        }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        setFolders(prev => [...prev, newFolder]);
        setShowFolderForm(false);
        setToast({ message: 'Folder added successfully', type: 'success' });
      } else {
        throw new Error('Failed to add folder');
      }
    } catch (error) {
      console.error('Failed to add folder', error);
      setToast({ message: 'Failed to add folder', type: 'error' });
    }
  };

  const handleUnlockFolder = async (folderId: string, masterPassword: string) => {
    const folder = folders.find(f => f._id === folderId);
    if (!folder) return;

    try {
      const folderKey = deriveKey(masterPassword, folder.salt);
      setMasterKey(folderKey);
      setSelectedFolder(folderId);
      setToast({ message: 'Folder unlocked successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to unlock folder', error);
      setToast({ message: 'Invalid master password', type: 'error' });
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        folders={folders}
        onAddFolder={() => setShowFolderForm(true)}
        onSelectFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        onLogout={logout}
      />

      <main className="ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedFolder ? folders.find(f => f._id === selectedFolder)?.name : 'Dashboard'}
          </h1>
          {selectedFolder && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Password
            </button>
          )}
        </div>

        {!selectedFolder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map(folder => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onUnlock={handleUnlockFolder}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passwords.map(password => (
              <PasswordCard
                key={password._id}
                password={password}
                decryptedPassword={decryptedPasswords[password._id]}
                onDecrypt={handleDecryptPassword}
                onCopy={handleCopyPassword}
              />
            ))}
          </div>
        )}
      </main>

      {showPasswordForm && (
        <PasswordForm
          onClose={() => setShowPasswordForm(false)}
          onSubmit={handleAddPassword}
        />
      )}

      {showFolderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = form.elements.namedItem('name') as HTMLInputElement;
                const password = form.elements.namedItem('password') as HTMLInputElement;
                await handleAddFolder(name.value, password.value);
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFolderForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
