import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

        const db = await getDb();
        const folder = await db
            .collection('folders')
            .findOne({ userId: decoded.userId, _id: new ObjectId(id || '') })

        return NextResponse.json(folder);
    } catch (error) {
        console.error('Failed to fetch folders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//     if (!id) {
//         return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
//     }

//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get('token')?.value;
//         if (!token) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

//         const db = await getDb();

//         // Delete the folder
//         const result = await db.collection('folders').deleteOne({
//             userId: decoded.userId,
//             _id: new ObjectId(id)
//         });

//         if (result.deletedCount === 0) {
//             return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
//         }

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error('Failed to delete folder:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
