import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, TrashIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/24/outline';
import { Password } from "types";
import { decrypt, hashKey } from "lib/encryption";
import { useState } from 'react';
import { deletePasswordApi } from 'components/api';
import { useToast } from 'context/ToastContext';
import DeletePasswordModal, { ModalType } from '../DeletePasswordModal';

interface PasswordCardProps {
    password: Password;
    masterKey: string;
    folderSalt: string;
    onPasswordDeleted?: (passwordId: string) => void;
}

export default function PasswordCard({ password, masterKey, folderSalt, onPasswordDeleted }: PasswordCardProps) {
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
    const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [passwordToDelete, setPasswordToDelete] = useState<{ id: string; site: string } | null>(null);
    const { setToast } = useToast();

    const confirmDeletePassword = async (deletionPassword: string) => {
        if (!passwordToDelete) return;

        try {
            await deletePasswordApi(passwordToDelete.id, deletionPassword);

            if (onPasswordDeleted) {
                onPasswordDeleted(passwordToDelete.id);
                setDeleteModalOpen(false);
                setPasswordToDelete(null);
            }
        } catch (err) {
            console.error('Failed to delete password:', err);
            setToast({
                message: 'Failed to delete password', type: 'error', onClose: () => {
                    setDeleteModalOpen(false);
                    setPasswordToDelete(null);
                }
            });
        }
    };

    const toggleRevealPassword = (passwordId: string) => {
        setRevealedPasswords(prev => ({
            ...prev,
            [passwordId]: !prev[passwordId]
        }));
    };

    const copyToClipboard = (passwordId: string, encryptedPassword: string, iv: string) => {
        try {
            const hashedKey = hashKey(masterKey, folderSalt);
            const decryptedPassword = decrypt(encryptedPassword, hashedKey, iv);
            navigator.clipboard.writeText(decryptedPassword);
            setCopiedPasswordId(passwordId);
            setToast({
                message: 'Password copied to clipboard',
                type: 'success',
                onClose: () => setCopiedPasswordId(null)
            });
            setTimeout(() => setCopiedPasswordId(null), 2000);
        } catch (err) {
            console.error('Failed to decrypt password:', err);
            setToast({
                message: 'Failed to copy password',
                type: 'error',
                onClose: () => setCopiedPasswordId(null)
            });
        }
    };

    const handleDeletePassword = async (passwordId: string) => {
        setPasswordToDelete({ id: passwordId, site: password.site });
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setPasswordToDelete(null);
    };

    return (
        <div className="bg-[var(--card-bg)] dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 sm:p-6">
                {/* Header with site and username */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {password.site}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {password.username}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2 sm:ml-4">
                        <button
                            onClick={() => toggleRevealPassword(password._id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                            title={revealedPasswords[password._id] ? 'Hide password' : 'Show password'}
                        >
                            {revealedPasswords[password._id] ? (
                                <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </button>

                        <button
                            onClick={() => copyToClipboard(password._id, password.encryptedPassword, password.iv)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                            title="Copy password"
                        >
                            <ClipboardDocumentIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>

                        <button
                            onClick={() => handleDeletePassword(password._id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                            title="Delete password"
                        >
                            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>

                {/* Password display */}
                {revealedPasswords[password._id] && (
                    <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <p className="text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                                    {decrypt(password.encryptedPassword, hashKey(masterKey, folderSalt), password.iv)}
                                </p>
                            </div>
                            {copiedPasswordId === password._id && (
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded flex-shrink-0">
                                    Copied!
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <DeletePasswordModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeletePassword}
                siteName={passwordToDelete?.site || ''}
                modalType={ModalType.DeletePassword}
            />
        </div>
    );
}
