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
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 text-center">No passwords yet</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center max-w-md px-4">
                    Add your first password to get started. Your passwords will be securely encrypted and stored here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Passwords ({passwords.length})
                </h2>
            </div>

            <div className="grid gap-3 sm:gap-4">
                {passwords.map((password) => (
                    <PasswordCard
                        key={password._id}
                        password={password}
                        masterKey={masterKey}
                        folderSalt={folderSalt}
                        onPasswordDeleted={onPasswordDeleted}
                    />
                ))}
            </div>
        </div>
    );
}
