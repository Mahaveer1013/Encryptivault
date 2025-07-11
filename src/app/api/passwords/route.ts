import { NextResponse } from 'next/server';
import { getDb } from 'lib/db';
import { NextRequest } from 'next/server';
import { addPasswordToGoogleDrive } from 'lib/gdrive';


export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');

        if (!folder) {
            return NextResponse.json({ error: 'Folder is required' }, { status: 400 });
        }

        const db = await getDb();
        const passwords = await db
            .collection('passwords')
            .find({ userId: userId, folder })
            .toArray();

        return NextResponse.json(passwords);
    } catch (error) {
        console.error('Failed to fetch passwords:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')!;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const { site, username, encryptedPassword, iv, folder } = await request.json();

        const db = await getDb();
        const password = {
            site,
            username,
            encryptedPassword,
            iv,
            folder,
            userId: userId,
            createdAt: new Date(),
        };

        const result = await db.collection('passwords').insertOne(password);

        addPasswordToGoogleDrive({ ...password, _id: result.insertedId.toString() }, folder, userId);

        return NextResponse.json({
            _id: result.insertedId,
            ...password,
        });
    } catch (error) {
        console.error('Failed to create password:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
