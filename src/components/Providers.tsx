'use client'
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { useTheme } from '@/context/ThemeContext';
import Toast from './Toast';
import { useToast } from '@/context/ToastContext';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = getQueryClient();
    // Use theme context to set dark class
    const { theme } = useTheme();
    const { toast } = useToast();
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <div className={`h-full ${theme === 'dark' ? ' dark' : ''}`}>
                    {children}
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={toast.onClose}
                        />
                    )}
                </div>
            </QueryClientProvider>
        </AuthProvider>
    );
}
