import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

        const db = await getDb();
        const folders = await db
            .collection('folders')
            .find({ userId: decoded.userId })
            .toArray();

        return NextResponse.json(folders);
    } catch (error) {
        console.error('Failed to fetch folders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { name, salt, hashedKey } = await request.json();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

        const db = await getDb();

        const existingFolder = await db.collection('folders').findOne({ name, userId: decoded.userId });
        if (existingFolder) {
            return NextResponse.json({ error: 'Folder already exists' }, { status: 400 });
        }

        const folder = {
            name,
            salt,
            hashedKey,
            userId: decoded.userId,
            createdAt: new Date(),
        };

        const result = await db.collection('folders').insertOne(folder);

        return NextResponse.json({
            _id: result.insertedId,
            ...folder,
        });
    } catch (error) {
        console.error('Failed to create folder:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
