import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

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
            userId: decoded.userId,
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
