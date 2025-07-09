'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ToastContextType {
    toast: ToastProps | null;
    setToast: (toast: ToastProps) => void;
  }

  export interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
  }

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastProps | null>(null);

    useEffect(() => {
        // Check localStorage or system preference
        const stored = typeof window !== 'undefined' ? localStorage.getItem('toast') : null;
        if (stored) {
            setToast(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('toast', JSON.stringify(toast));
        }
        if (toast) {
            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ toast, setToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
