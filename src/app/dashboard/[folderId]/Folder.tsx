'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordList from '@/components/dashboard/passwords/PasswordList';
import PasswordModal from '@/components/dashboard/passwords/PasswordModal';
import { useAuth } from '@/context/AuthContext';
import { getFolder, getPasswords } from '../../../components/api';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import { Password } from '@/types';

export default function Folder({ folderId }: { folderId: string }) {
    const router = useRouter();
    const { masterKeySession } = useAuth();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { setToast } = useToast();
    const { isLoading: isPasswordsLoading } = useQuery({
        queryKey: ['passwords', folderId],
        queryFn: () => getPasswords(folderId).then(passwords => {
            setPasswords(passwords);
            return passwords;
        })
    });

    useEffect(() => {
        const fetchPasswords = async () => {
            const passwords = await getPasswords(folderId);
            setPasswords(passwords);
        };
        fetchPasswords();
    }, []);

    const { data: folder, isLoading: isFolderLoading } = useQuery({
        queryKey: ['folder', folderId],
        queryFn: () => getFolder(folderId)
    });

    const handleAddPassword = (newPassword: any) => {
        setPasswords([...passwords, newPassword]);
        setShowPasswordModal(false);
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

    useEffect(() => {
        if (!masterKeySession.hasKey(folderId)) {
            router.push('/dashboard');
        }
    }, [masterKeySession, folderId, router]);

    return (
        <div className="px-2 sm:px-4 md:px-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] break-words max-w-full">{folder.name}</h2>
                    <p className="text-[var(--foreground)] text-sm sm:text-base">
                        {passwords.length} {passwords.length === 1 ? 'password' : 'passwords'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        Add Password
                    </button>
                    <button
                        onClick={() => {
                            masterKeySession.removeKey(folderId);
                            router.push('/dashboard');
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--card-bg)] text-[var(--foreground)] rounded-md hover:bg-[var(--card-bg)] transition-colors text-sm sm:text-base"
                    >
                        Lock Folder
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <PasswordList
                    passwords={passwords}
                    masterKey={masterKeySession.getKey(folderId) || ''}
                    folderSalt={folder.salt}
                    onPasswordDeleted={(passwordId: string) => {
                        setPasswords(passwords.filter(p => p._id !== passwordId));
                    }}
                />
            </div>

            {showPasswordModal && (
                <PasswordModal
                    folder={folder}
                    masterKey={masterKeySession.getKey(folderId) || ''}
                    onClose={() => setShowPasswordModal(false)}
                    onPasswordAdded={handleAddPassword}
                />
            )}
        </div>
    );
}
