import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
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
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

    const { name, salt } = await request.json();
    const db = await getDb();

    const folder = {
      name,
      salt,
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
