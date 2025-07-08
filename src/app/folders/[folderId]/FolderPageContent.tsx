'use client';
import { useState } from 'react';
import PasswordCard from '@/components/PasswordCard';
import PasswordForm from '@/components/PasswordForm';
import { decryptData } from '@/lib/crypto';

export default function FolderPageContent({ folder, passwords }: { folder: any, passwords: any[] }) {
  const [masterKey, setMasterKey] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});

  const handleDecryptPassword = async (passwordId: string, encryptedPassword: string, iv: string) => {
    if (!masterKey) return;

    try {
      const decrypted = await decryptData(encryptedPassword, masterKey, iv);
      setDecryptedPasswords(prev => ({
        ...prev,
        [passwordId]: decrypted,
      }));
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  const handleAddPassword = async (site: string, username: string, password: string) => {
    // Implementation for adding password
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">{folder.name}</h2>
        <div className="mt-4">
          <input
            type="password"
            placeholder="Enter folder master password"
            onChange={(e) => setMasterKey(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map(password => (
          <PasswordCard
            key={password._id}
            password={password}
            decryptedPassword={decryptedPasswords[password._id]}
            onDecrypt={handleDecryptPassword}
          />
        ))}
      </div>

      {showPasswordForm && (
        <PasswordForm
          onClose={() => setShowPasswordForm(false)}
          onSubmit={handleAddPassword}
        />
      )}
    </div>
  );
}
