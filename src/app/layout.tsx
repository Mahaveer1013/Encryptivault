import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import Providers from 'components/Providers';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from 'context/ToastContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'EncryptiVault Password Manager',
    description: 'A zero-knowledge password manager with client-side encryption',
    icons: {
        icon: '/lock.ico',
    },
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
    return (
        <html lang="en">
            <body className={`${inter.className} h-full bg-[var(--background)] text-[var(--foreground)]`}>
                <ThemeProvider>
                    <ToastProvider>
                        <Providers>
                            {children}
                        </Providers>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
