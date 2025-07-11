# PassiVault Backup System

This directory contains the backup system for PassiVault, allowing you to automatically backup your project files and database to Google Drive.

## Features

- ✅ **Complete project backup** - Source code, configuration files, and assets
- ✅ **Database backup** - Customizable database backup support
- ✅ **Google Drive integration** - Automatic upload to Google Drive
- ✅ **Compression** - ZIP compression with maximum compression level
- ✅ **Automated cleanup** - Keeps only the last 5 local backups
- ✅ **Backup reports** - Detailed reports of each backup operation
- ✅ **Cron integration** - Easy setup for automated backups
- ✅ **Security** - Excludes sensitive files (credentials, tokens)

## Quick Start

### 1. Setup the backup system

```bash
# Make the setup script executable and run it
chmod +x setup-backup.sh
./setup-backup.sh
```

### 2. Install dependencies

```bash
npm install archiver googleapis
```

### 3. Configure Google Drive (optional)

```bash
node backup-script.js --setup
```

Follow the instructions to set up Google Drive API credentials.

### 4. Test the backup

```bash
# Local backup only
node backup-script.js --local-only

# Full backup with Google Drive upload
node backup-script.js
```

## Usage

### Basic Commands

```bash
# Full backup (local + Google Drive)
node backup-script.js

# Local backup only
node backup-script.js --local-only

# Clean up old backups
node backup-script.js --cleanup-only

# Show help
node backup-script.js --help

# Setup Google Drive credentials
node backup-script.js --setup
```

### Automated Backups

See `CRON_SETUP.md` for detailed instructions on setting up automated backups using cron.

## What Gets Backed Up

### Included Files
- `src/` - All source code
- `public/` - Public assets
- Configuration files:
  - `package.json`
  - `package-lock.json`
  - `tsconfig.json`
  - `next.config.js`
  - `next.config.ts`
  - `postcss.config.mjs`
  - `README.md`
  - `LICENSE`
  - `CONTRIBUTING.md`
  - `.env*` files
  - `.gitignore`

### Excluded Files
- `node_modules/`
- `.next/`
- `.git/`
- `backups/`
- `*.log`
- `*.tmp`
- `*.zip`
- `credentials.json`
- `token.json`

## Google Drive Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials
5. Download the credentials as `credentials.json`

### 2. Configure the Backup

```bash
# Place credentials.json in your project root
# Then run the setup
node backup-script.js --setup
```

### 3. Authorize the Application

The first time you run the backup, you'll need to:
1. Visit the authorization URL
2. Grant permissions to your Google Drive
3. Enter the authorization code

## Database Backup

The backup script includes a placeholder for database backup. You can customize the `createDatabaseBackup()` method in `backup-script.js` based on your database setup:

### MongoDB Example
```javascript
// In backup-script.js, modify createDatabaseBackup()
async createDatabaseBackup() {
  try {
    // Use mongodump for MongoDB
    execSync('mongodump --uri="your-mongodb-uri" --out=database-dump');

    // Archive the dump
    const archive = archiver('zip');
    const output = fs.createWriteStream('database-backup.zip');
    archive.pipe(output);
    archive.directory('database-dump/', false);
    archive.finalize();

    console.log('✅ MongoDB backup created');
  } catch (error) {
    console.warn('⚠️ Could not create MongoDB backup:', error.message);
  }
}
```

### SQLite Example
```javascript
// For SQLite databases
async createDatabaseBackup() {
  try {
    if (fs.existsSync('database.sqlite')) {
      fs.copyFileSync('database.sqlite', 'database-backup.sqlite');
      console.log('✅ SQLite database backed up');
    }
  } catch (error) {
    console.warn('⚠️ Could not backup SQLite database:', error.message);
  }
}
```

## Configuration

The backup system uses `backup-config.json` for configuration:

```json
{
  "backup": {
    "enabled": true,
    "schedule": "daily",
    "retention": {
      "local": 5,
      "cloud": 10
    },
    "compression": {
      "level": 9,
      "format": "zip"
    }
  },
  "google_drive": {
    "enabled": true,
    "folder_id": "root"
  },
  "database": {
    "backup_enabled": true,
    "type": "mongodb"
  }
}
```

## Backup Reports

Each backup creates a detailed report in the `backups/` directory:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "backupPath": "./backups/Encryptivault-backup-2024-01-15T10-30-00-000Z.zip",
  "backupSize": "15.23",
  "googleDriveId": "1ABC123DEF456",
  "status": "success"
}
```

## Security Considerations

### Sensitive Files
The backup system automatically excludes sensitive files:
- `credentials.json` - Google API credentials
- `token.json` - OAuth tokens
- `.env*` files - Environment variables (unless explicitly included)

### Google Drive Permissions
- Uses minimal scope: `https://www.googleapis.com/auth/drive.file`
- Only uploads files, doesn't read existing files
- Tokens are stored locally and not backed up

### Encryption
Consider encrypting sensitive backups:
```bash
# Encrypt backup before upload
gpg --encrypt --recipient your-email@example.com backup-file.zip
```

## Troubleshooting

### Common Issues

1. **Google Drive Authentication Failed**
   - Ensure `credentials.json` is in the project root
   - Check that Google Drive API is enabled
   - Verify OAuth 2.0 credentials are correct

2. **Backup Too Large**
   - Check what's being included in the backup
   - Exclude unnecessary files in `backup-config.json`
   - Consider using `--local-only` for large projects

3. **Cron Job Not Working**
   - Check cron service: `sudo systemctl status cron`
   - Verify file paths in cron command
   - Check backup logs: `tail -f backups/backup.log`

4. **Permission Denied**
   - Make script executable: `chmod +x backup-script.js`
   - Check file permissions in backup directory

### Logs

Backup logs are stored in:
- `backups/backup.log` - General backup logs
- `backups/backup-report-*.json` - Detailed backup reports

### Monitoring

Monitor backup health:
```bash
# Check recent backups
ls -la backups/

# View backup reports
cat backups/backup-report-*.json

# Monitor backup logs
tail -f backups/backup.log
```

## Advanced Usage

### Custom Backup Scripts

Create custom backup scripts by extending the `PassiVaultBackup` class:

```javascript
const PassiVaultBackup = require('./backup-script.js');

class CustomBackup extends PassiVaultBackup {
  async createDatabaseBackup() {
    // Custom database backup logic
  }

  async uploadToGoogleDrive(filePath) {
    // Custom upload logic
  }
}

const backup = new CustomBackup();
backup.runBackup();
```

### Multiple Backup Locations

Modify the script to backup to multiple locations:

```javascript
// Add to backup-script.js
async uploadToMultipleLocations(filePath) {
  await this.uploadToGoogleDrive(filePath);
  await this.uploadToS3(filePath);
  await this.uploadToFTP(filePath);
}
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review backup logs in `backups/backup.log`
3. Verify Google Drive API setup
4. Test with `--local-only` first

## License

This backup system is part of PassiVault and follows the same license as the main project.
