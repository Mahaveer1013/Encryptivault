import { google } from 'googleapis';

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
