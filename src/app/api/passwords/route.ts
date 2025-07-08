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

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return NextResponse.json({ error: 'Folder is required' }, { status: 400 });
    }

    const db = await getDb();
    const passwords = await db
      .collection('passwords')
      .find({ userId: decoded.userId, folder })
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
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

    const { site, username, encryptedPassword, iv, folder } = await request.json();

    const db = await getDb();
    const password = {
      site,
      username,
      encryptedPassword,
      iv,
      folder,
      userId: decoded.userId,
      createdAt: new Date(),
    };

    const result = await db.collection('passwords').insertOne(password);

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
