'use client';

import { useState } from 'react';
import FolderList from '../../components/dashboard/folders/FolderList';
import FolderModal from '../../components/dashboard/folders/FolderModal';
import { useQuery } from '@tanstack/react-query';
import { getFoldersApi } from '../../components/api';
import { getQueryClient } from 'lib/get-query-client';
import { useToast } from 'context/ToastContext';
import { useAuth } from 'context/AuthContext';
import { Folder } from 'types';

export default function Dashboard() {
    const [showFolderModal, setShowFolderModal] = useState(false);
    const queryClient = getQueryClient();
    const { setToast } = useToast();
    const { logout } = useAuth();
    const { data: folders, isLoading, isError, error } = useQuery({
        queryKey: ['folders'],
        queryFn: getFoldersApi,
    });

    const handleFolderDeleted = (folderId: string) => {
        queryClient.setQueryData(['folders'], (oldFolders: Folder[] | undefined) =>
            oldFolders?.filter(folder => folder._id !== folderId) || []
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-[var(--foreground)]">Loading...</div>
            </div>
        );
    }

    if (isError) {
        setToast({
            type: 'error',
            message: error instanceof Error ? error.message : 'Failed to load folders',
            onClose: logout
        })
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-[var(--foreground)]">Error loading folders</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-8 px-1 sm:px-4 md:px-2">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h2 className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">Your Folders</h2>
                    <button
                        onClick={() => setShowFolderModal(true)}
                        className="w-full sm:w-auto px-6 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg shadow hover:bg-[var(--accent-hover)] transition-all font-semibold text-base"
                    >
                        + Create Folder
                    </button>
                </div>

                <FolderList
                    folders={folders || []}
                    onFolderDeleted={handleFolderDeleted}
                />

                {showFolderModal && (
                    <FolderModal
                        onClose={() => setShowFolderModal(false)}
                        onFolderCreated={(newFolder) => {
                            queryClient.setQueryData(['folders'], [...(folders || []), newFolder]);
                            setShowFolderModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
