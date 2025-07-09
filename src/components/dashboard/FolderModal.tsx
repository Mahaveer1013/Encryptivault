'use client';

import { useState } from 'react';
import { encrypt, generateSalt, hashKey } from '@/lib/encryption';

interface FolderModalProps {
    onClose: () => void;
    onFolderCreated: (folder: any) => void;
}

export default function FolderModal({ onClose, onFolderCreated }: FolderModalProps) {
    const [name, setName] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [confirmMasterKey, setConfirmMasterKey] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
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

        setIsSubmitting(true);

        try {
            const salt = generateSalt();
            const hashedKey = hashKey(masterKey, salt);

            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    salt,
                    hashedKey,
                }),
            });

            if (response.ok) {
                const newFolder = await response.json();
                onFolderCreated(newFolder);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create folder');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Folder</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label htmlFor="masterKey" className="block text-sm font-medium text-gray-700 mb-1">
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
                            <label htmlFor="confirmMasterKey" className="block text-sm font-medium text-gray-700 mb-1">
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
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Folder'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
