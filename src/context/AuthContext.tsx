'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    masterKey: string | null;
    setMasterKey: (key: string | null) => void;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            setLoading(true);
            try {
                const response = await fetch('/api/auth/verify-user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData.user);
                } else {
                    logout(false);
                }
            } catch (error) {
                console.error('Failed to verify token', error);
                logout();
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    const register = async (email: string, password: string) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Register failed');
        }
        router.push('/auth/verify-email');
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const { user } = await response.json();

        setUser(user);
    };

    const logout = async (redirect: boolean = true) => {
        await fetch('/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
        });
        setUser(null);
        setMasterKey(null);
        if (redirect) {
            router.push('/auth/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                masterKey,
                setMasterKey,
                loading,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
