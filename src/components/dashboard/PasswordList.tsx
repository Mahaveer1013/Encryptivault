'use client';

import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { decrypt, hashKey } from '@/lib/encryption';
import DeletePasswordModal from './DeletePasswordModal';

interface PasswordListProps {
    passwords: any[];
    masterKey: string;
    folderSalt: string;
    onPasswordDeleted?: (passwordId: string) => void;
}

export default function PasswordList({ passwords, masterKey, folderSalt, onPasswordDeleted }: PasswordListProps) {
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
    const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState<{ id: string; site: string } | null>(null);

    const toggleRevealPassword = (passwordId: string) => {
        setRevealedPasswords(prev => ({
            ...prev,
            [passwordId]: !prev[passwordId]
        }));
    };

    const copyToClipboard = (passwordId: string, encryptedPassword: string, iv: string) => {
        try {
            const hashedKey = hashKey(masterKey, folderSalt);
            const decryptedPassword = decrypt(encryptedPassword, hashedKey);
            navigator.clipboard.writeText(decryptedPassword);
            setCopiedPasswordId(passwordId);
            setTimeout(() => setCopiedPasswordId(null), 2000);
        } catch (err) {
            console.error('Failed to decrypt password:', err);
        }
    };

    const handleDeletePassword = async (passwordId: string) => {
        const password = passwords.find(p => p._id === passwordId);
        if (password) {
            setPasswordToDelete({ id: passwordId, site: password.site });
            setDeleteModalOpen(true);
        }
    };

    const confirmDeletePassword = async (deletionPassword: string) => {
        if (!passwordToDelete) return;

        try {
            const response = await fetch(`/api/passwords/${passwordToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deletionPassword }),
            });

            if (response.ok && onPasswordDeleted) {
                onPasswordDeleted(passwordToDelete.id);
                setDeleteModalOpen(false);
                setPasswordToDelete(null);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete password');
            }
        } catch (err) {
            console.error('Failed to delete password:', err);
            alert('Failed to delete password');
        }
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setPasswordToDelete(null);
    };

    if (passwords.length === 0) {
        return (
            <>
                <div className="text-center py-10">
                    <p className="text-gray-500">No passwords yet. Add your first password to get started.</p>
                </div>
                <DeletePasswordModal
                    isOpen={deleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDeletePassword}
                    siteName={passwordToDelete?.site || ''}
                />
            </>
        );
    }

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {passwords.map((password) => (
                        <li key={password._id} className="px-2 py-3 sm:px-4 sm:py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 w-full">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[90vw] sm:max-w-xs">{password.site}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[90vw] sm:max-w-xs">{password.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                                    <button
                                        onClick={() => toggleRevealPassword(password._id)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        title={revealedPasswords[password._id] ? 'Hide password' : 'Show password'}
                                    >
                                        {revealedPasswords[password._id] ? (
                                            <EyeSlashIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(password._id, password.encryptedPassword, password.iv)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        title="Copy password"
                                    >
                                        <ClipboardDocumentIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePassword(password._id)}
                                        className="text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        title="Delete password"
                                    >
                                        <TrashIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                            </div>
                            {revealedPasswords[password._id] && (
                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center">
                                    <p className="text-xs sm:text-sm font-mono bg-gray-100 p-2 rounded text-black break-all max-w-full sm:max-w-lg">
                                        {decrypt(password.encryptedPassword, hashKey(masterKey, folderSalt))}
                                    </p>
                                    {copiedPasswordId === password._id && (
                                        <span className="text-xs text-green-600 ml-2 mt-1 sm:mt-0">Copied!</span>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <DeletePasswordModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeletePassword}
                siteName={passwordToDelete?.site || ''}
            />
        </>
    );
}
