'use client';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import FolderPageContent from './FolderPageContent';

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/auth/login');
  }

  const db = await getDb();
  const folder = await db.collection('folders').findOne({
    _id: params.folderId,
    userId: token.value
  });

  if (!folder) {
    notFound();
  }

  const passwords = await db.collection('passwords').find({
    folderId: params.folderId,
    userId: token.value
  }).toArray();

  return (
    <FolderPageContent
      folder={folder}
      passwords={passwords}
    />
  );
}
