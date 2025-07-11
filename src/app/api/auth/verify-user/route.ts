import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 200 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
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
