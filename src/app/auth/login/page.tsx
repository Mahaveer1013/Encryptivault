'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/AuthContext';
import AuthForm from 'components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password, rememberMe);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };


    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[var(--card-bg)] py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <AuthForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                        error={error}
                        onSubmit={handleSubmit}
                        isLogin={true}
                    />
                </div>
            </div>
        </div>
    );
}
