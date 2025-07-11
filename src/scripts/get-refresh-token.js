// get-google-refresh-token.js
const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; // use the exact one used during credentials setup

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // forces refresh token to be returned
  scope: SCOPES,
});

console.log('\n1. Visit this URL in browser:\n', url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n2. Paste the authorization code here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Refresh Token:\n', tokens.refresh_token);
  } catch (error) {
    console.error('❌ Error retrieving tokens:', error.message);
  }
  rl.close();
});
