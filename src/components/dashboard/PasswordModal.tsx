'use client';

import { useState } from 'react';
import { encrypt, hashKey } from '@/lib/encryption';
import { generateRandomPassword } from '@/lib/utils';

interface PasswordModalProps {
    folderId: string;
    masterKey: string;
    folderSalt: string;
    onClose: () => void;
    onPasswordAdded: (password: any) => void;
}

export default function PasswordModal({ folderId, masterKey, folderSalt, onClose, onPasswordAdded }: PasswordModalProps) {
    const [site, setSite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!site.trim() || !username.trim() || !password.trim()) {
            setError('All fields are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const hashedKey = hashKey(masterKey, folderSalt);
            const encryptedPassword = encrypt(password, hashedKey);

            const response = await fetch('/api/passwords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site,
                    username,
                    encryptedPassword,
                    folder: folderId,
                }),
            });

            if (response.ok) {
                const newPassword = await response.json();
                onPasswordAdded(newPassword);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to add password');
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Password</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                                Website/Service
                            </label>
                            <input
                                type="text"
                                id="site"
                                value={site}
                                onChange={(e) => setSite(e.target.value)}
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. google.com"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username/Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username or email"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPassword(generateRandomPassword())}
                                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
                                >
                                    Generate
                                </button>
                            </div>
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
                                {isSubmitting ? 'Adding...' : 'Add Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
