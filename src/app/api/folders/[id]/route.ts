import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    try {
        const userId = request.headers.get('x-user-id')!;

        if(!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const db = await getDb();
        const folder = await db
            .collection('folders')
            .findOne({ userId: userId, _id: new ObjectId(id || '') })
        if (!folder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }
        return NextResponse.json(folder);
    } catch (error) {
        console.error('Failed to fetch folders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    try {
        const userId = request.headers.get('x-user-id')!;

        if(!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        const body = await request.json();
        const { deletionPassword } = body;

        if (!deletionPassword) {
            return NextResponse.json({ error: 'Deletion password for folder is required' }, { status: 400 });
        }

        // Check if deletion password matches the environment variable
        if (deletionPassword !== process.env.DELETION_PASSWORD_FOR_FOLDER) {
            return NextResponse.json({ error: 'Invalid deletion password' }, { status: 403 });
        }
        const db = await getDb();

        // Delete the folder
        const result = await db.collection('folders').deleteOne({
            userId: userId,
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete folder:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
