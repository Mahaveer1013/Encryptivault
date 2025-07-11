# 🛡️ PassiVault Google Drive Backup with Complete Redundancy

## 🎯 Overview
Your PassiVault now features **enterprise-level redundancy** with automatic Google Drive backup. Every operation creates a backup with multiple safety layers.

## 🔄 Automatic Backup Triggers
Your data is automatically backed up whenever you:
- ✅ **Create a new folder**
- ✅ **Add a new password**
- ✅ **Delete a folder**
- ✅ **Delete a password**

## 🛡️ Redundancy Features

### 1. **Dual Storage System**
- **Primary**: MongoDB (your main database)
- **Backup**: Google Drive (automatic backup)

### 2. **Multiple Backup Triggers**
- Every CRUD operation triggers backup
- No user interaction required
- Background processing

### 3. **Timestamped Backups**
- Each backup creates a new file: `passivault_backup_user123_2024-01-15T10-30-45-123Z.json`
- Version history maintained
- Easy rollback capability

### 4. **Complete Data Backup**
Each backup file contains:
- All your folders
- All your passwords
- Backup timestamp
- User ID
- Version information
- Total item count

### 5. **Enhanced Error Handling**
- If Google Drive backup fails → MongoDB operations still succeed
- Automatic retry with exponential backoff
- Multiple retry attempts (30s, 60s intervals)
- Backup errors logged but don't break main operations

### 6. **Organized Storage**
- All backups in "PassiVault_Backups" folder
- Automatic cleanup (keeps last 10 backups)
- Easy to find and restore

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
npm install googleapis
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     * `http://localhost:3000/api/auth/callback/google`
     * `https://your-domain.com/api/auth/callback/google` (if deployed)

### 3. Get Refresh Token

Create `get-refresh-token.js`:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000/api/auth/callback/google'
);

const scopes = ['https://www.googleapis.com/auth/drive.file'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting this url:', url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('Refresh token:', tokens.refresh_token);
    rl.close();
  });
});
```

Run it:
```bash
node get-refresh-token.js
```

### 4. Environment Variables

Add to your `.env` file:

```env
GOOGLE_DRIVE_CLIENT_ID=your_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret_here
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token_here
```

## 🔍 How It Works

### **Automatic Backup Process**
1. User performs action (create/delete folder/password)
2. MongoDB operation completes successfully
3. Background backup process starts
4. All user data fetched from MongoDB
5. Comprehensive backup file created with metadata
6. Upload to Google Drive with retry mechanism
7. Integrity verification performed
8. Old backups cleaned up (keeps last 10)

### **Retry Mechanism**
- **3 attempts** with exponential backoff
- **30-second retry** for failed backups
- **60-second final retry** for critical failures
- **Background processing** - doesn't affect user experience

### **Backup File Structure**
```json
{
  "folders": [...],
  "passwords": [...],
  "backupDate": "2024-01-15T10:30:45.123Z",
  "userId": "user123",
  "version": "1.0",
  "totalItems": 25
}
```

## 🛡️ Recovery Scenarios

### **If MongoDB fails:**
- Restore from latest Google Drive backup
- Multiple timestamped backups available
- Complete data recovery possible

### **If Google Drive fails:**
- Your data is still safe in MongoDB
- Next operation will retry backup
- No data loss occurs

### **If both fail:**
- Multiple timestamped backup files available
- Can restore from any previous backup
- Enterprise-level redundancy protection

## 📊 Backup Dashboard

Use the `BackupStatus` component to monitor:
- ✅ Backup integrity status
- 📊 Backup statistics
- 🔄 Retry counts
- ⏱️ Backup duration
- 🛡️ Recovery scenarios

## 🔧 API Endpoints

### **POST /api/backup**
- Creates manual backup
- Returns backup statistics
- Performs integrity verification

### **GET /api/backup**
- Checks backup status
- Verifies backup integrity
- Returns current backup health

## 🚨 Troubleshooting

1. **"Google Drive configuration is missing"**
   - Check environment variables
   - Verify all three variables are set

2. **"Unauthorized"**
   - Refresh token may have expired
   - Generate new refresh token

3. **"Quota exceeded"**
   - Google Drive has daily limits
   - Check your usage in Google Cloud Console

4. **Backup failures**
   - Check network connectivity
   - Verify Google Drive API is enabled
   - Check console logs for detailed errors

## 🔒 Security Features

- ✅ Credentials stored in environment variables
- ✅ Only you can access your backup files
- ✅ Existing encryption preserved in backups
- ✅ No user interaction required
- ✅ Automatic background processing
- ✅ Integrity verification after each backup

## 📈 Performance

- **Background processing** - doesn't affect app performance
- **Exponential backoff** - prevents API rate limiting
- **Automatic cleanup** - prevents storage bloat
- **Error isolation** - backup failures don't break main operations

Your PassiVault now has **enterprise-level redundancy** with zero user interaction required! 🎉
