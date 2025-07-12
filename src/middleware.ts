import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;
const ipMap = new Map<string, { count: number; lastRequest: number }>();

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export async function middleware(request: NextRequest) {
    const ip = getClientIp(request);
    const now = Date.now();
    const record = ipMap.get(ip);

    // Rate limiting logic
    if (record) {
        if (now - record.lastRequest < RATE_LIMIT_WINDOW) {
            if (record.count >= MAX_REQUESTS) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too many requests. Try again later.' }),
                    {
                        status: 429,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            } else {
                record.count += 1;
            }
        } else {
            // reset after window
            ipMap.set(ip, { count: 1, lastRequest: now });
        }
    } else {
        ipMap.set(ip, { count: 1, lastRequest: now });
    }

    // JWT Authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);

        if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
            throw new Error('Invalid token payload');
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', String((payload as any).userId));

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (err) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: [
        '/api/folders/:path*',
        '/api/passwords/:path*',
        '/dashboard/:path*',
    ],
};
