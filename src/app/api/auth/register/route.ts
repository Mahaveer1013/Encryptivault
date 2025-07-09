import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const confirmtionLinkHtml = (token: string) => {
    return `
    <p>Click the link to verify your email:</p>
    <a href="http://localhost:3000/verify-email?token=${token}">Verify email</a>
  `;
};

export async function POST(request: Request) {
    try {
        const { email, password }: { email: string, password: string } = await request.json();
        const db = await getDb();
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 401 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let userId;
        if (existingUser && !existingUser.isVerified) {
            // Resend verification email with new token
            userId = existingUser._id;
        } else {
            // Register new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await db.collection('users').insertOne({ email, password: hashedPassword, isVerified: false });
            userId = newUser.insertedId;
        }

        const token = jwt.sign(
            { userId: userId.toString(), email: email },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        const mailOptions = {
            from: 'noreply@example.com',
            to: email,
            subject: 'Verify your email',
            html: confirmtionLinkHtml(token),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        const userWithoutPassword = {
            _id: userId,
            email: email,
        };

        if (existingUser && !existingUser.isVerified) {
            return NextResponse.json({
                message: 'Verification email resent',
                user: userWithoutPassword,
            });
        }

        return NextResponse.json({
            token,
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
