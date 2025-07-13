'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordList from 'components/dashboard/passwords/PasswordList';
import PasswordModal from 'components/dashboard/passwords/PasswordModal';
import { useAuth } from 'context/AuthContext';
import { getFolderApi, getPasswordsApi } from '../../../components/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'context/ToastContext';
import { Folder, Password } from 'types';

export default function FolderComponent({ folderId }: { folderId: string }) {
    const router = useRouter();
    const { masterKeySession } = useAuth();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { setToast } = useToast();
    const queryClient = useQueryClient();
    const { isLoading: isPasswordsLoading, isError, error } = useQuery({
        queryKey: ['passwords', folderId],
        queryFn: () => getPasswordsApi(folderId).then(passwords => {
            setPasswords(passwords);
            return passwords;
        })
    });

    useEffect(() => {
        const getPasswords = async () => {
            const passwords = await getPasswordsApi(folderId);
            setPasswords(passwords);
        };
        getPasswords();
    }, []);

    useEffect(() => {
        if (!masterKeySession.hasKey(folderId)) {
            router.push('/dashboard');
        }
    }, [masterKeySession, folderId, router]);

    const { data: folder, isLoading: isFolderLoading } = useQuery({
        queryKey: ['folder', folderId],
        queryFn: () => getFolderApi(folderId)
    });

    const handleAddPassword = (newPassword: any) => {
        setPasswords([...passwords, newPassword]);
        setShowPasswordModal(false);
    };

    const handlePasswordDeleted = (passwordId: string) => {
        queryClient.setQueryData(['passwords', folderId], (oldPasswords: Password[] | undefined) =>
            oldPasswords?.filter(password => password._id !== passwordId) || []
        );
        setPasswords(passwords.filter(p => p._id !== passwordId));
    };

    if (isPasswordsLoading || isFolderLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!folder) {
        setToast({
            message: 'Folder not found', type: 'error', onClose: () => {
                router.push('/dashboard');
            }
        });
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--foreground)] break-words">
                        {folder?.name}
                    </h2>
                    <p className="text-[var(--foreground)] text-sm sm:text-base mt-1">
                        {passwords.length} {passwords.length === 1 ? 'password' : 'passwords'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        Add Password
                    </button>
                    <button
                        onClick={() => {
                            masterKeySession.removeKey(folderId);
                            router.push('/dashboard');
                        }}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[var(--card-bg)] text-[var(--foreground)] rounded-md hover:bg-[var(--card-bg)] transition-colors text-sm sm:text-base"
                    >
                        Lock Folder
                    </button>
                </div>
            </div>

            <div className="w-full">
                <PasswordList
                    passwords={passwords}
                    masterKey={masterKeySession.getKey(folderId) || ''}
                    folderSalt={folder?.salt || ''}
                    onPasswordDeleted={handlePasswordDeleted}
                />
            </div>

            {showPasswordModal && (
                <PasswordModal
                    folder={folder as Folder}
                    masterKey={masterKeySession.getKey(folderId) || ''}
                    onClose={() => setShowPasswordModal(false)}
                    onPasswordAdded={handleAddPassword}
                />
            )}
        </div>
    );
}
