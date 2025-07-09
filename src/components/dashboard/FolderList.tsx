'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface FolderListProps {
    folders: any[];
}

export default function FolderList({ folders }: FolderListProps) {
    const [unlockingFolder, setUnlockingFolder] = useState<string | null>(null);
    const [masterKeyInput, setMasterKeyInput] = useState('');

    const handleUnlockFolder = (folderId: string) => {
        setUnlockingFolder(null);
        setMasterKeyInput('');
    };

    return (
        <>
            {folders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FolderIcon className="h-12 w-12 text-blue-200 mb-4" />
                    <div className="text-gray-400 text-lg">No folders found. Create your first folder!</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {folders.map((folder) => (
                        <div
                            key={folder._id}
                            className="bg-white bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <FolderIcon className="h-7 w-7 text-blue-500 group-hover:text-blue-700 transition" />
                                <span className="text-xs text-gray-400">{new Date(folder.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 truncate mb-2">{folder.name}</h3>
                            {unlockingFolder === folder._id ? (
                                <div className="mt-2 space-y-2">
                                    <input
                                        type="password"
                                        value={masterKeyInput}
                                        onChange={(e) => setMasterKeyInput(e.target.value)}
                                        placeholder="Enter master key"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
                                    />
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => handleUnlockFolder(folder._id)}
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition font-semibold"
                                        >
                                            Unlock
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUnlockingFolder(null);
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
                                    <Link
                                        href={`/dashboard/${folder._id}`}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                    >
                                        View Passwords
                                    </Link>
                                    <button
                                        onClick={() => setUnlockingFolder(folder._id)}
                                        className="text-sm text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-blue-50 transition"
                                        title="Unlock folder"
                                    >
                                        <LockClosedIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
