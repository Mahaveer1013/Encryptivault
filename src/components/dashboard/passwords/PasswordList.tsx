'use client';
import PasswordCard from './PasswordCard';

interface PasswordListProps {
    passwords: any[];
    masterKey: string;
    folderSalt: string;
    onPasswordDeleted?: (passwordId: string) => void;
}

export default function PasswordList({ passwords, masterKey, folderSalt, onPasswordDeleted }: PasswordListProps) {

    if (passwords.length === 0) {
        return (
            <>
                <div className="text-center py-10">
                    <p className="text-gray-500">No passwords yet. Add your first password to get started.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="bg-[var(--card-bg)] shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {passwords.map((password) => (
                        <PasswordCard
                            key={password._id}
                            password={password}
                            masterKey={masterKey}
                            folderSalt={folderSalt}
                            onPasswordDeleted={onPasswordDeleted}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
}
