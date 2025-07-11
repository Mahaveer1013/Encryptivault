import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from 'lib/db';

export async function POST(request: Request) {
    try {
        const { email, password, rememberMe } = await request.json();
        const db = await getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: 'User is not verified' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: rememberMe ? '30d' : '1d' }
        );

        const cookieStore = await cookies();
        if (rememberMe) {
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        } else {
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: 'strict',
                // No maxAge or expires for session cookie
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
