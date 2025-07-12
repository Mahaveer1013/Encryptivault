'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DeletePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deletionPassword: string) => void;
    siteName: string;
    modalType: ModalType;
}

export enum ModalType {
    DeletePassword = 'password',
    DeleteFolder = 'folder',
}

export default function DeletePasswordModal({ isOpen, onClose, onConfirm, siteName, modalType }: DeletePasswordModalProps) {
    const [deletionPassword, setDeletionPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deletionPassword.trim()) return;

        setIsLoading(true);
        try {
            await onConfirm(deletionPassword);
            setDeletionPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[var(--background)] rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[var(--text)]">Delete {modalType === ModalType.DeletePassword ? 'Password' : 'Folder'}</h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--text)] hover:text-[var(--text-hover)]"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <p className="text-sm text-[var(--text)] mb-4">
                    Are you sure you want to delete the {modalType === ModalType.DeletePassword ? 'password' : 'folder'} for <strong>{siteName}</strong>?
                    This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="deletionPassword" className="block text-sm font-medium text-[var(--text)] mb-2">
                            Deletion {modalType === ModalType.DeletePassword ? 'Password' : 'Folder'}
                        </label>
                        <input
                            type="password"
                            id="deletionPassword"
                            value={deletionPassword}
                            onChange={(e) => setDeletionPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter deletion password"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-[var(--text)] bg-[var(--background)] border border-[var(--border)] rounded-md hover:bg-[var(--background-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border)]"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-red-700 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={isLoading || !deletionPassword.trim()}
                        >
                            {isLoading ? 'Deleting...' : `Delete ${modalType === ModalType.DeletePassword ? 'Password' : 'Folder'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
