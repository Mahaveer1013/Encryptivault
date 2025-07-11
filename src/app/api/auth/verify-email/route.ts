// import { NextResponse } from 'next/server';
// import { getDb } from '@/lib/db';
// import jwt from 'jsonwebtoken';
// import { ObjectId } from 'mongodb';

// export async function GET(request: Request) {
//     try {
//         const token = request.url.split('?token=')[1];
//         const db = await getDb();
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//         const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

//         if (!user) {
//             return NextResponse.json(
//                 { error: 'User not found' },
//                 { status: 401 }
//             );
//         }

//         if (user.isVerified) {
//             return NextResponse.redirect(new URL('/dashboard', request.url));
//         }

//         await db.collection('users').updateOne({ _id: user._id }, { $set: { isVerified: true } });
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     } catch (error) {
//         console.error('Login error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
