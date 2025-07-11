import { NextResponse } from 'next/server';
import { getDb } from 'lib/db';
import { NextRequest } from 'next/server';
import { createBackupFolder } from 'lib/gdrive';


export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const db = await getDb();
        const folders = await db
            .collection('folders')
            .find({ userId: userId })
            .toArray();

        if (!folders || folders.length === 0) {
            return NextResponse.json([]);
        }

        return NextResponse.json(folders);
    } catch (error) {
        console.error('Failed to fetch folders:', error);
        return NextResponse.json([], { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const { name, salt, hashedKey } = await request.json();

        const db = await getDb();

        const existingFolder = await db.collection('folders').findOne({ name, userId });
        if (existingFolder) {
            return NextResponse.json({ error: 'Folder already exists' }, { status: 400 });
        }

        const folder = {
            name,
            salt,
            hashedKey,
            userId: userId,
            createdAt: new Date(),
        };

        const result = await db.collection('folders').insertOne(folder);

        createBackupFolder({ ...folder, _id: result.insertedId.toString() });

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
