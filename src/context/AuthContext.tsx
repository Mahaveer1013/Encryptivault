'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    masterKey: string | null;
    setMasterKey: (key: string | null) => void;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    masterKeySession: {
        addKey: (folderId: string, key: string) => void;
        removeKey: (folderId: string) => void;
        hasKey: (folderId: string) => boolean;
        getKey: (folderId: string) => string | undefined;
        clearKeys: () => void;
    };
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [masterKeySession, setMasterKeySession] = useState<Map<string, string>>(new Map());
    const router = useRouter();

    const addKey = (folderId: string, key: string) => {
        setMasterKeySession((prev) => {
            const newMap = new Map(prev);
            newMap.set(folderId, key);
            return newMap;
        });
    };

    const removeKey = (folderId: string) => {
        setMasterKeySession((prev) => {
            const newMap = new Map(prev);
            newMap.delete(folderId);
            return newMap;
        });
    };

    const hasKey = (folderId: string) => {
        return masterKeySession.has(folderId);
    };

    const getKey = (folderId: string) => {
        return masterKeySession.get(folderId);
    };

    const clearKeys = () => {
        setMasterKeySession(new Map());
    };

    const keyFunctions = {
        addKey,
        removeKey,
        hasKey,
        getKey,
        clearKeys,
    };

    useEffect(() => {
        async function loadUser() {
            try {
                setLoading(true);
                const res = await fetch('/api/auth/verify-user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (res.ok) {
                    const userData = await res.json();
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
        console.log(user);

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
                masterKeySession: keyFunctions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
