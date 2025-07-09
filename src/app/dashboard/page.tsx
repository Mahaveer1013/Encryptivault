'use client';

import { useState, useEffect } from 'react';
import FolderList from '../../components/dashboard/FolderList';
import FolderModal from '../../components/dashboard/FolderModal';

export default function DashboardPage() {
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folders, setFolders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('/api/folders');
                if (response.ok) {
                    const data = await response.json();
                    setFolders(data);
                }
            } catch (error) {
                console.error('Failed to fetch folders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-1 sm:px-4 md:px-2">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Your Folders</h2>
                    <button
                        onClick={() => setShowFolderModal(true)}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-semibold text-base"
                    >
                        + Create Folder
                    </button>
                </div>

                <FolderList
                    folders={folders}
                />

                {showFolderModal && (
                    <FolderModal
                        onClose={() => setShowFolderModal(false)}
                        onFolderCreated={(newFolder) => {
                            setFolders([...folders, newFolder]);
                            setShowFolderModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
