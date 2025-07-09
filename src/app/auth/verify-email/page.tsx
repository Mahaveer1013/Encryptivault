// src/app/verify-email/page.tsx
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <CheckCircleIcon className="h-16 w-16 text-blue-500 mb-4" aria-hidden="true" />
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Verify Your Email
                </h2>
                <p className="mt-2 text-center text-md text-gray-700">
                    We've sent a verification link to your email address.<br />
                    Please check your inbox and follow the instructions to verify your account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10">
                    <div className="flex flex-col items-center">
                        <div className="w-full flex flex-col gap-4 mt-4">
                            <Link
                                href="/auth/register"
                                className="w-full flex justify-center py-2 px-4 border border-blue-500 rounded-md shadow-sm text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                            >
                                Change Email
                            </Link>
                        </div>
                        <p className="mt-6 text-center text-xs text-gray-400">
                            Didn't receive the email? Check your spam folder or try resending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
