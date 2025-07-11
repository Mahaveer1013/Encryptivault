'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutApi, loginApi, verifyApi } from '@/components/api'; // Adjust the import path as necessary

interface AuthContextType {
    user: any;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    masterKey: string | null;
    setMasterKey: (key: string | null) => void;
    loading: boolean;
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
                const user = await verifyApi();
                if (!user) {
                    logout(false);
                    return;
                }

                setUser(user);
            } catch (error) {
                console.error('Failed to verify token', error);
                logout();
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [router]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const user = await loginApi(email, password, rememberMe);
            if (!user) {
                throw new Error('Login failed');
            }
            localStorage.setItem('user', user.user); // Store email in localStorage
            setUser(user);
        } catch (error) {
            console.error('Login failed', error);
            throw error; // Re-throw the error to handle it in the component
        }
    };

    const logout = async (redirect: boolean = true) => {
        setUser(null);
        setMasterKey(null);
        await logoutApi();
        localStorage.removeItem('user'); // Clear the stored email from localStorage
        if (redirect) {
            router.push('/');
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
                masterKeySession: keyFunctions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
