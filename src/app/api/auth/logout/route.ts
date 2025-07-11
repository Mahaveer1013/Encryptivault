import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('token');

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';
        const url = new URL('/', origin);

        return NextResponse.redirect(url.toString());
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
