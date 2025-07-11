'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GetRefreshToken() {
    const [code, setCode] = useState('');

    useEffect(() => {
        const urlCode = new URLSearchParams(window.location.search).get('code') || '';
        setCode(urlCode);
    }, []);

    const copyCode = () => {
        if (!code) return;

        navigator.clipboard.writeText(code)
            .then(() => {
                alert('✅ Code copied to clipboard! Paste it into your terminal or console.');
            })
            .catch((err) => {
                console.error('❌ Failed to copy code: ', err);
                alert('Failed to copy code');
            });
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-md bg-[var(--card-bg)] p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">OAuth2 Code Received</h2>

                {code ? (
                    <>
                        <p className="break-all text-sm mb-4 text-[var(--foreground)]">
                            <strong>Code:</strong> {code}
                        </p>
                        <button
                            onClick={copyCode}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        >
                            Copy to Clipboard
                        </button>
                    </>
                ) : (
                    <p className="text-red-500">❌ No code found in URL</p>
                )}
            </div>

            <div className="mt-6">
                <Link href="/auth/login" className="text-blue-500 hover:underline text-sm">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
