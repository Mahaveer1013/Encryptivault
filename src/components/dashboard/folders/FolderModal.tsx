'use client';

import { useState } from 'react';
import { generateSalt, hashKey } from '@/lib/encryption';
import { Folder } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { createFolderApi } from '@/components/api';

interface FolderModalProps {
    onClose: () => void;
    onFolderCreated: (folder: Folder) => void;
}


export default function FolderModal({ onClose, onFolderCreated }: FolderModalProps) {
    const [name, setName] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [confirmMasterKey, setConfirmMasterKey] = useState('');
    const [error, setError] = useState('');
    const queryClient = getQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ name, masterKey }: { name: string; masterKey: string }) => {
            const salt = generateSalt();
            const hashedKey = hashKey(masterKey, salt);
            return createFolderApi(name, salt, hashedKey);
        },
        onSuccess: (newFolder) => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            onFolderCreated(newFolder);
        },
        onError: (err: any) => {
            setError(err.message || 'An unexpected error occurred');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Folder name is required');
            return;
        }
        if (!masterKey) {
            setError('Master key is required');
            return;
        }
        if (masterKey !== confirmMasterKey) {
            setError('Master keys do not match');
            return;
        }

        mutate({ name, masterKey });
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--background)] rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Create New Folder</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-[var(--error-background)] text-[var(--error-text)] rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--text)] mb-1">
                                Folder Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Personal, Work"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="masterKey" className="block text-sm font-medium text-[var(--text)] mb-1">
                                Master Key
                            </label>
                            <input
                                type="password"
                                id="masterKey"
                                value={masterKey}
                                onChange={(e) => setMasterKey(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter a strong master key"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmMasterKey" className="block text-sm font-medium text-[var(--text)] mb-1">
                                Confirm Master Key
                            </label>
                            <input
                                type="password"
                                id="confirmMasterKey"
                                value={confirmMasterKey}
                                onChange={(e) => setConfirmMasterKey(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your master key"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isPending}
                                className="px-4 py-2 border border-[var(--border)] rounded-md text-[var(--text)] hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'Creating...' : 'Create Folder'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
