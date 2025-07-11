import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import ThemeChanger from '@/components/ThemeChanger';

export default async function HomePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let decoded: { userId: string; email: string } | null = null;
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);
            if (
                typeof payload === 'object' &&
                payload !== null &&
                'userId' in payload &&
                'email' in payload &&
                typeof (payload as any).userId === 'string' &&
                typeof (payload as any).email === 'string'
            ) {
                decoded = {
                    userId: (payload as any).userId,
                    email: (payload as any).email,
                };
            }
        } catch (err) {
            decoded = null;
        }
    }

    let user = null;
    if (decoded) {
        const db = await getDb();
        user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    }

    // If user is already logged in, redirect to dashboard
    if (token && user && user.isVerified) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Navigation */}
            <nav className="bg-[var(--background)] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>

                            <span className="ml-2 text-xl font-semibold text-[var(--foreground)]">
                                SecureVault
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeChanger />
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="https://github.com/Mahaveer1013/Encryptivault"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Make your own
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
                        <span className="block">Your Passwords,</span>
                        <span className="block text-blue-600">Under Your Control</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-[var(--foreground)] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        A zero-knowledge password manager with client-side encryption.
                        Your data is encrypted before it leaves your device.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <Link
                                href="/auth/register"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                            >
                                Get Started
                            </Link>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link
                                href="/features"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">Military-Grade Encryption</h3>
                        <p className="mt-2 text-base text-[var(--foreground)]">
                            AES-256 encryption performed client-side. Your master password never leaves your device.
                        </p>
                    </div>

                    <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">Zero-Knowledge Architecture</h3>
                        <p className="mt-2 text-base text-[var(--foreground)]">
                            We never have access to your passwords. Only you can decrypt your data.
                        </p>
                    </div>

                    <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">Cross-Platform Sync</h3>
                        <p className="mt-2 text-base text-[var(--foreground)]">
                            Access your passwords from any device while maintaining end-to-end encryption.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[var(--background)] border-t border-[var(--card-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:order-2 space-x-6">
                            <a href="https://github.com/Mahaveer1013/Encryptivault" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <div className="mt-8 md:mt-0 md:order-1">
                            <p className="text-center text-base text-[var(--foreground)]">
                                &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
