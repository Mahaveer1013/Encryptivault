import { google } from 'googleapis';
import { Password, Folder } from 'types';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';
import { getDb } from './db';

interface GoogleDriveConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

/**
 * Get Google Drive configuration from environment variables
 */
function getGoogleDriveConfig(): GoogleDriveConfig {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Google Drive configuration is missing. Please set GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, and GOOGLE_DRIVE_REFRESH_TOKEN environment variables.');
    }

    return {
        clientId,
        clientSecret,
        refreshToken,
    };
}

/**
 * Initialize Google Drive API client
 */
export function getGoogleDriveClient() {
    const config = getGoogleDriveConfig();
    const oauth2Client = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret
    );

    oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Store the password data inside "Kavalan/${folder.name}/$[password.site}.json"
 */
export async function addPasswordToGoogleDrive(password: Password, folderId: string, userId: string) {
    if (process.env.GOOGLE_DRIVE_BACKUP !== 'true') {
        console.log('Google Drive backup is disabled');
        return;
    }
    const drive = getGoogleDriveClient();
    const db = await getDb();

    const folder = await db.collection('folders').findOne({ _id: new ObjectId(folderId), userId });
    if (!folder) {
        throw new Error(`Folder with ID ${folderId} not found`);
    }
    const backupFolderName = folder.name;
    const parentFolderName = 'Kavalan';
    const passwordFileName = `${password.site}.json`;

    try {
        // Step 1: Find or create Kavalan
        let parentId: string | null = null;
        const parentSearch = await drive.files.list({
            q: `name='${parentFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (parentSearch.data.files?.length) {
            parentId = parentSearch.data.files[0].id!;
        } else {
            const createdParent = await drive.files.create({
                requestBody: {
                    name: parentFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            });
            parentId = createdParent.data.id!;
        }

        // Step 2: Find or create folder.name inside Kavalan
        let folderId: string | null = null;
        const childSearch = await drive.files.list({
            q: `name='${backupFolderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        console.log(`Searching for folder: ${backupFolderName} in parent: ${parentId}`);
        console.log(`Search result:`, childSearch.data.files);
        console.log(`Length of files found: ${childSearch.data.files?.length}`);





        if (childSearch.data.files?.length) {
            folderId = childSearch.data.files[0].id!;
        } else {
            const createdChild = await drive.files.create({
                requestBody: {
                    name: backupFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentId],
                },
                fields: 'id',
            });
            folderId = createdChild.data.id!;
        }

        // Step 3: Upload ${password.site}.json into child folder
        const fileMetadata = {
            name: passwordFileName,
            mimeType: 'application/json',
            parents: [folderId],
        };

        const fileContent = Buffer.from(JSON.stringify(password, null, 2));

        await drive.files.create({
            requestBody: fileMetadata,
            media: {
                mimeType: 'application/json',
                body: Readable.from(fileContent),
            },
        });

        return folderId;
    } catch (error) {
        console.error('Error in addPasswordToGoogleDrive:', error);
        throw error;
    }
}

/**
 * Create a backup folder inside "Kavalan" and upload data.json
 */
export async function createBackupFolder(folder: Folder) {
    if (process.env.GOOGLE_DRIVE_BACKUP !== 'true') {
        console.log('Google Drive backup is disabled');
        return;
    }
    const drive = getGoogleDriveClient();
    const parentFolderName = 'Kavalan';
    const backupFolderName = folder.name;

    try {
        // Step 1: Find or create "Kavalan"
        let parentId: string | null | undefined;
        const parentSearch = await drive.files.list({
            q: `name='${parentFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (parentSearch.data.files?.length) {
            parentId = parentSearch.data.files[0].id;
        } else {
            const parentFolder = await drive.files.create({
                requestBody: {
                    name: parentFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            });
            parentId = parentFolder.data.id!;
        }

        // Step 2: Create child folder inside "Kavalan"
        let backupFolderId: string | null | undefined;
        const childSearch = await drive.files.list({
            q: `name='${backupFolderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (childSearch.data.files?.length) {
            backupFolderId = childSearch.data.files[0].id;
        } else {
            const backupFolderMetadata: any = {
                name: backupFolderName,
                mimeType: 'application/vnd.google-apps.folder',
            };

            if (parentId) {
                backupFolderMetadata.parents = [parentId];
            }
            const backupFolder = await drive.files.create({
                requestBody: backupFolderMetadata,
                fields: 'id',
            });
            backupFolderId = backupFolder.data.id!;
        }

        // Step 3: Upload data.json to the child folder
        const buffer = Buffer.from(JSON.stringify(folder, null, 2));
        const jsonFileMetadata: any = {
            name: 'data.json',
            mimeType: 'application/json',
        };

        if (backupFolderId) {
            jsonFileMetadata.parents = [backupFolderId];
        }

        await drive.files.create({
            requestBody: jsonFileMetadata,
            media: {
                mimeType: 'application/json',
                body: Readable.from(buffer),
            },
        });

        return backupFolderId;
    } catch (error) {
        console.error('Error in createBackupFolder:', error);
        throw error;
    }
}
