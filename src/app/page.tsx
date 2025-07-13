import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from 'lib/db';
import Navigation from 'components/Navigation';
import ThemeChanger from 'components/ThemeChanger';

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

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl lg:text-6xl">
                        <span className="block">Your Passwords,</span>
                        <span className="block text-blue-600">Under Your Control</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-sm text-[var(--foreground)] sm:text-base md:mt-5 md:text-lg lg:text-xl lg:max-w-3xl">
                        A zero-knowledge password manager with client-side encryption.
                        Your data is encrypted before it leaves your device.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow w-full sm:w-auto">
                            <Link
                                href="https://github.com/Mahaveer1013/Kavalan/blob/master/README.md"
                                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 sm:text-base md:py-4 md:text-lg md:px-10"
                            >
                                Get Started
                            </Link>
                        </div>
                        <div className="mt-3 rounded-md shadow w-full sm:w-auto sm:mt-0 sm:ml-3">
                            <Link
                                href="/workflow"
                                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 sm:text-base md:py-4 md:text-lg md:px-10"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <section className="mt-12 sm:mt-16 max-w-3xl mx-auto text-center px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">About Kavalan</h2>
                    <p className="text-[var(--foreground)] text-sm sm:text-base md:text-lg">
                        Kavalan is an open-source, privacy-first password manager designed for individuals and teams who value security and control. With zero-knowledge architecture and end-to-end encryption, only you can access your data. Your master password and secrets never leave your device.
                    </p>
                </section>

                {/* How It Works Section */}
                <section className="mt-12 sm:mt-16 max-w-5xl mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 text-center mb-6 sm:mb-8">How It Works</h2>
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white mb-3 sm:mb-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)] text-center">Client-Side Encryption</h3>
                            <p className="mt-2 text-sm sm:text-base text-[var(--foreground)] text-center">All your passwords are encrypted on your device before being stored or synced. Only you hold the decryption key.</p>
                        </div>
                        <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white mb-3 sm:mb-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)] text-center">Zero-Knowledge Proof</h3>
                            <p className="mt-2 text-sm sm:text-base text-[var(--foreground)] text-center">We never store or transmit your master password. Only you can decrypt your vault, ensuring maximum privacy.</p>
                        </div>
                        <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow flex flex-col items-center md:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white mb-3 sm:mb-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)] text-center">Cross-Platform Sync</h3>
                            <p className="mt-2 text-sm sm:text-base text-[var(--foreground)] text-center">Access your passwords securely from any device, with end-to-end encryption always enforced.</p>
                        </div>
                    </div>
                </section>

                {/* Tech Stack & Open Source Section */}
                <section className="mt-12 sm:mt-16 max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">Open Source & Tech Stack</h2>
                    <p className="text-[var(--foreground)] text-sm sm:text-base md:text-lg mb-4">
                        Kavalan is fully open source and welcomes contributions! Built with Next.js, MongoDB, Tailwind CSS, and modern cryptography libraries.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">Next.js</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">MongoDB</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">Tailwind CSS</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">TypeScript</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">Crypto</span>
                    </div>
                    <div className="mt-6">
                        <Link href="https://github.com/Mahaveer1013/Kavalan" className="inline-block px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 transition">View on GitHub</Link>
                    </div>
                </section>

                {/* Features Grid (moved below for more clarity) */}
                <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
                    <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-[var(--foreground)]">Military-Grade Encryption</h3>
                        <p className="mt-2 text-sm sm:text-base text-[var(--foreground)]">
                            AES-256 encryption performed client-side. Your master password never leaves your device.
                        </p>
                    </div>

                    <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow">
                        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-[var(--foreground)]">Zero-Knowledge Architecture</h3>
                        <p className="mt-2 text-sm sm:text-base text-[var(--foreground)]">
                            We never have access to your passwords. Only you can decrypt your data.
                        </p>
                    </div>

                    <div className="bg-[var(--card-bg)] p-4 sm:p-6 rounded-lg shadow md:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                        </div>
                        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-[var(--foreground)]">Cross-Platform Sync</h3>
                        <p className="mt-2 text-sm sm:text-base text-[var(--foreground)]">
                            Access your passwords from any device while maintaining end-to-end encryption.
                        </p>
                    </div>
                </div>

                {/* Get Started for Developers Section */}
                <section className="mt-12 sm:mt-16 max-w-3xl mx-auto text-center px-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">Get Started as a Developer</h2>
                    <p className="text-[var(--foreground)] text-sm sm:text-base md:text-lg mb-4">
                        Want to contribute or self-host? Check out our documentation and join the community!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
                        <Link href="https://github.com/Mahaveer1013/Kavalan/blob/master/README.md" className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 transition">Read the Docs</Link>
                        <Link href="https://github.com/Mahaveer1013/Kavalan/issues" className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-200 text-gray-800 rounded-md text-sm sm:text-base font-medium hover:bg-gray-300 transition">Report an Issue</Link>
                        <Link href="https://github.com/Mahaveer1013/Kavalan/pulls" className="px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-md text-sm sm:text-base font-medium hover:bg-green-700 transition">Contribute</Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[var(--background)] border-t border-[var(--card-border)] mt-12 sm:mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:order-2 space-x-6">
                            <a href="https://github.com/Mahaveer1013/Kavalan" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <div className="mt-6 md:mt-0 md:order-1">
                            <p className="text-center text-sm sm:text-base text-[var(--foreground)]">
                                &copy; {new Date().getFullYear()} Kavalan. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
