import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id')!;

        if(!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        // Parse the request body to get the deletion password
        const body = await request.json();
        const { deletionPassword } = body;

        if (!deletionPassword) {
            return NextResponse.json({ error: 'Deletion password is required' }, { status: 400 });
        }

        // Check if deletion password matches the environment variable
        if (deletionPassword !== process.env.DELETION_PASSWORD) {
            return NextResponse.json({ error: 'Invalid deletion password' }, { status: 403 });
        }

        const db = await getDb();
        const result = await db.collection('passwords').deleteOne({
            _id: new ObjectId(id),
            userId,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Password not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete password:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
