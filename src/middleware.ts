// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // jose expects the secret as a Uint8Array
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);

        const requestHeaders = new Headers(request.headers);
        if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
            throw new Error('Invalid user data');
        }
        requestHeaders.set('x-user-id', (payload as any).userId);

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
        // Note: You cannot modify cookies in middleware, just redirect
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

// Apply middleware only to specific routes
export const config = {
    matcher: [
        '/api/folders/:path*',
        '/api/passwords/:path*',
        '/dashboard/:path*',
    ],
};
