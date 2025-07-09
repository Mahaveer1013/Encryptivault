'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import Providers from '@/components/Providers';
import { useTheme } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Secure Password Manager',
    description: 'A zero-knowledge password manager with client-side encryption',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Use theme context to set dark class
    const { theme } = useTheme();
    return (
        <html lang="en" className={`h-full${theme === 'dark' ? ' dark' : ''}`}>
            <body className={`${inter.className} h-full bg-[var(--background)] text-[var(--foreground)]`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
