'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import FolderCard from './FolderCard';

interface FolderListProps {
    folders: any[];
}

export default function FolderList({ folders }: FolderListProps) {
    const [unlockingFolder, setUnlockingFolder] = useState<string | null>(null);
    const [masterKeyInput, setMasterKeyInput] = useState('');
    const { masterKeySession } = useAuth();

    const handleUnlockFolder = (folderId: string) => {
        setUnlockingFolder(folderId);
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
                        <FolderCard key={folder._id} folder={folder} />
                    ))}
                </div>
            )}
        </>
    );
}
