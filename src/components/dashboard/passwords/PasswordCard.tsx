import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
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
            setTimeout(() => setCopiedPasswordId(null), 2000);
        } catch (err) {
            console.error('Failed to decrypt password:', err);
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
        <li key={password._id} className="px-2 py-3 sm:px-4 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 w-full">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-[var(--foreground)] truncate max-w-[90vw] sm:max-w-xs">{password.site}</h3>
                        <p className="text-xs sm:text-sm text-[var(--foreground)] truncate max-w-[90vw] sm:max-w-xs">{password.username}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                    <button
                        onClick={() => toggleRevealPassword(password._id)}
                        className="text-[var(--foreground)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        className="text-[var(--foreground)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Copy password"
                    >
                        <ClipboardDocumentIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                    </button>
                    <button
                        onClick={() => handleDeletePassword(password._id)}
                        className="text-[var(--foreground)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete password"
                    >
                        <TrashIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
            {revealedPasswords[password._id] && (
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center">
                    <p className="text-xs sm:text-sm font-mono bg-[var(--card-bg)] p-2 rounded text-[var(--foreground)] break-all max-w-full sm:max-w-lg">
                        {decrypt(password.encryptedPassword, hashKey(masterKey, folderSalt), password.iv)}
                    </p>
                    {copiedPasswordId === password._id && (
                        <span className="text-xs text-green-600 ml-2 mt-1 sm:mt-0">Copied!</span>
                    )}
                </div>
            )}
            <DeletePasswordModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeletePassword}
                siteName={passwordToDelete?.site || ''}
                modalType={ModalType.DeletePassword}
            />
        </li>
    );
}
