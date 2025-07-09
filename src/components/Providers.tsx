'use client'
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { ThemeProvider } from '../context/ThemeContext';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = getQueryClient();
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
