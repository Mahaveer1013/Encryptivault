'use client';

import { useState } from 'react';
import { encrypt, generateSalt, hashKey } from '@/lib/encryption';
import { generateRandomPassword } from '@/lib/utils';
import Link from 'next/link';
import { Folder, PasswordRequest } from '@/types';
import { createPassword } from '@/components/api';

interface PasswordModalProps {
    folder: Folder;
    masterKey: string;
    onClose: () => void;
    onPasswordAdded: (password: any) => void;
}

export default function PasswordModal({ folder, masterKey, onClose, onPasswordAdded }: PasswordModalProps) {
    const [site, setSite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!masterKey || masterKey.length === 0) {
        return (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-[var(--card-bg)] rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">No master key found</h2>
                        <Link href="/dashboard" className="text-[var(--foreground)] hover:text-[var(--accent)]">Go back</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!site.trim() || !username.trim() || !password.trim()) {
            setError('All fields are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const iv = generateSalt();
            const hashedKey = hashKey(masterKey, folder.salt);
            const encryptedPassword = encrypt(password, hashedKey, iv);
            const passwordRequest: PasswordRequest = {
                    site,
                    username,
                    encryptedPassword,
                    iv,
                folder: folder._id,
            };

            const response = await createPassword(passwordRequest);
            onPasswordAdded(response);
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--card-bg)] rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Add New Password</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-[var(--card-bg)] text-[var(--foreground)] rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="site" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Website/Service
                            </label>
                            <input
                                type="text"
                                id="site"
                                value={site}
                                onChange={(e) => setSite(e.target.value)}
                                className="w-full px-3 py-2 text-[var(--foreground)] border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. google.com"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Username/Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 text-[var(--foreground)] border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username or email"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Password
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 px-3 py-2 text-[var(--foreground)] border border-[var(--card-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPassword(generateRandomPassword())}
                                    className="px-3 py-2 bg-[var(--card-bg)] text-[var(--foreground)] rounded-md hover:bg-[var(--card-bg)] transition-colors text-sm whitespace-nowrap"
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
                                className="px-4 py-2 border border-[var(--card-border)] rounded-md text-[var(--foreground)] hover:bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
