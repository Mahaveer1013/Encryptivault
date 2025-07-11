'use client';

import { useEffect, useState } from 'react';
import { FolderIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FolderCard({ folder }: { folder: any }) {
    const [masterKeyInput, setMasterKeyInput] = useState('');
    const { masterKeySession } = useAuth();
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(masterKeySession.hasKey(folder._id));
    const router = useRouter();

    useEffect(() => {
        setIsUnlocked(masterKeySession.hasKey(folder._id));
    }, [masterKeySession, folder._id]);

    const viewPasswords = () => {
        if (isUnlocked) {
            router.push(`/dashboard/${folder._id}`);
        } else {
            setIsUnlocking(true);
        }
    };

    const handleUnlock = () => {
        // Add your own validation logic for the master key if needed
        if (masterKeyInput.trim() !== '') {
            masterKeySession.addKey(folder._id, masterKeyInput);
            setIsUnlocked(true);
            setIsUnlocking(false);
            setMasterKeyInput('');
        }
    };

    const handleLock = () => {
        masterKeySession.removeKey(folder._id);
        setIsUnlocked(false);
    };

    return (
        <div
            key={folder._id}
            className="bg-[var(--card-bg)] rounded-2xl shadow-lg p-5 flex flex-col transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl group"
        >
            <div className="flex items-center justify-between mb-2">
                <FolderIcon className="h-7 w-7 text-blue-500 group-hover:text-blue-700 transition" />
                <span className="text-xs text-[var(--foreground)]">{new Date(folder.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-semibold text-lg text-[var(--foreground)] truncate mb-2">{folder.name}</h3>
            {isUnlocking && !isUnlocked ? (
                <div className="mt-2 space-y-2">
                    <input
                        type="password"
                        value={masterKeyInput}
                        autoFocus={true}
                        onChange={(e) => setMasterKeyInput(e.target.value)}
                        placeholder="Enter master key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleUnlock}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition font-semibold"
                        >
                            Unlock
                        </button>
                        <button
                            onClick={() => {
                                setIsUnlocking(false);
                                setMasterKeyInput('');
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={viewPasswords}
                        className="text-sm cursor-pointer hover:underline text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View Passwords
                    </button>
                    {isUnlocked ? (
                        <button
                            onClick={handleLock}
                            className="text-sm text-[var(--background)] cursor-pointer p-2 rounded-full bg-green-500 hover:bg-green-600 transition"
                            title="Lock folder"
                        >
                            <LockOpenIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsUnlocking(true)}
                            className="text-sm text-[var(--foreground)] cursor-pointer p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
                            title="Unlock folder"
                        >
                            <LockClosedIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
