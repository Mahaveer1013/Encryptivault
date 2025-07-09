'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PasswordList from '@/components/dashboard/PasswordList';
import PasswordModal from '@/components/dashboard/PasswordModal';
import MasterKeyPrompt from '@/components/dashboard/MasterKeyPrompt';
import { hashKey } from '@/lib/encryption';

export default function FolderPage() {
    const params = useParams();
    const router = useRouter();
    const folderId = params.folderId as string;

    const [folder, setFolder] = useState<any>(null);
    const [passwords, setPasswords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showMasterKeyPrompt, setShowMasterKeyPrompt] = useState(false);
    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch folder details
                const folderRes = await fetch(`/api/folders`);
                if (!folderRes.ok) throw new Error('Failed to fetch folder');

                const folders = await folderRes.json();
                const currentFolder = folders.find((f: any) => f._id === folderId);
                if (!currentFolder) {
                    router.push('/dashboard');
                    return;
                }

                setFolder(currentFolder);

                // Fetch passwords if master key is available
                if (masterKey) {
                    const passwordsRes = await fetch(`/api/passwords?folder=${folderId}`);
                    if (!passwordsRes.ok) throw new Error('Failed to fetch passwords');

                    const passwordsData = await passwordsRes.json();
                    setPasswords(passwordsData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [folderId, masterKey, router]);

    const handleAddPassword = (newPassword: any) => {
        setPasswords([...passwords, newPassword]);
        setShowPasswordModal(false);
    };

    const verifyMasterKey = async (key: string) => {
        try {
            const hashedKey = hashKey(key, folder.salt);
            if (hashedKey !== folder.hashedKey) throw new Error('Invalid master key');
            setError('');
            setMasterKey(key);
            setShowMasterKeyPrompt(false);
        } catch (err) {
            setError('Invalid master key');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!folder) {
        return <div className="text-center py-10">Folder not found</div>;
    }

    if (!masterKey) {
        return (
            <MasterKeyPrompt
                folderName={folder.name}
                onVerify={verifyMasterKey}
                error={error}
            />
        );
    }

    return (
        <div className="px-2 sm:px-4 md:px-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words max-w-full">{folder.name}</h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {passwords.length} {passwords.length === 1 ? 'password' : 'passwords'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        Add Password
                    </button>
                    <button
                        onClick={() => {
                            setMasterKey(null);
                            setShowMasterKeyPrompt(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
                    >
                        Lock Folder
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm max-w-full overflow-x-auto">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <PasswordList
                    passwords={passwords}
                    masterKey={masterKey}
                    folderSalt={folder.salt}
                    onPasswordDeleted={(passwordId: string) => {
                        setPasswords(passwords.filter(p => p._id !== passwordId));
                    }}
                />
            </div>

            {showPasswordModal && (
                <PasswordModal
                    folderId={folderId}
                    masterKey={masterKey}
                    folderSalt={folder.salt}
                    onClose={() => setShowPasswordModal(false)}
                    onPasswordAdded={handleAddPassword}
                />
            )}

            {showMasterKeyPrompt && (
                <MasterKeyPrompt
                    folderName={folder.name}
                    onVerify={verifyMasterKey}
                    onClose={() => setShowMasterKeyPrompt(false)}
                    error={error}
                />
            )}
        </div>
    );
}
