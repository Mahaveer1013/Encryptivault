'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DeletePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deletionPassword: string) => void;
    siteName: string;
}

export default function DeletePasswordModal({ isOpen, onClose, onConfirm, siteName }: DeletePasswordModalProps) {
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete Password</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete the password for <strong>{siteName}</strong>?
                    This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="deletionPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Deletion Password
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={isLoading || !deletionPassword.trim()}
                        >
                            {isLoading ? 'Deleting...' : 'Delete Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
