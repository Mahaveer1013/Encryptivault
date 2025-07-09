"use client";
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeChanger from '@/components/ThemeChanger';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { masterKeySession } = useAuth();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <nav className="bg-[var(--card-bg)] shadow-sm border-b border-[var(--card-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-semibold">Secure Vault</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    masterKeySession.removeAllKeys();
                                }}
                                className="flex items-center px-3 py-2 rounded-md bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] hover:bg-[var(--card-bg)] transition"
                                aria-label="Toggle theme"
                            >
                                <LockClosedIcon className="h-5 w-5" />
                            </button>
                            <ThemeChanger theme={theme} toggleTheme={toggleTheme} />
                            <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md" onClick={() => router.push('/api/auth/logout')}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 bg-[var(--background)] sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
