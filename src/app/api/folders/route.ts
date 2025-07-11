import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getGoogleDriveClient } from '@/lib/gdrive';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
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

/**
 * Create a backup folder in Google Drive if it doesn't exist
 */
async function createBackupFolder(folderName: string) {
    try {
        const drive = getGoogleDriveClient();
      // Check if folder already exists
      const response = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Create new folder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      return folder.data.id;
    } catch (error) {
      console.error('Error creating backup folder:', error);
      throw error;
    }
  }

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { name, salt, hashedKey } = await request.json();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };

        const db = await getDb();

        const existingFolder = await db.collection('folders').findOne({ name, userId: decoded.userId });
        if (existingFolder) {
            return NextResponse.json({ error: 'Folder already exists' }, { status: 400 });
        }

        const folder = {
            name,
            salt,
            hashedKey,
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
