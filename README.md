# PassiVault - Secure Password Manager

A secure, zero-knowledge password manager built with Next.js, featuring client-side encryption, Google Drive backup, and robust deletion protection.

---

## Features

- 🔐 **Client-side encryption**: Passwords are encrypted before leaving your device.
- 📁 **Folder-based organization**: Organize passwords in folders.
- 🗑️ **Deletion password protection**: Prevent accidental or unauthorized deletions.
- ☁️ **Google Drive backup**: Automatic, redundant backups for disaster recovery.
- 👤 **User authentication**: JWT-based login, email verification.
- 🎨 **Simple UI**: Responsive, themeable interface.

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or remote)
- **Google Cloud account** (for Drive backup)
- **NPM**

---

### 1. Clone the Repository

```bash
git clone https://github.com/mahaveer1013/encryptivault.git
cd encryptivault
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI = ""            // Atlas URI

# JWT Secret
JWT_SECRET = "<secure random string>"

# Deletion Password
DELETION_PASSWORD = "<required while deleting a password>"
DELETION_PASSWORD_FOR_FOLDER = "<required while deleting a folder>"

# Google Drive Backup
GOOGLE_DRIVE_BACKUP = "true"  // true or false
GOOGLE_DRIVE_CLIENT_ID = "<refer drive documentation>"
GOOGLE_DRIVE_CLIENT_SECRET = "<refer drive documentation>"
GOOGLE_DRIVE_REFRESH_TOKEN = "<refer drive documentation>"
```

**Note:**
- `DELETION_PASSWORD` is required to delete individual passwords.
- `DELETION_PASSWORD_FOR_FOLDER` is required to delete entire folders.
- If you do not want Google Drive backup, set `GOOGLE_DRIVE_BACKUP=false` or omit the related variables.

---

### 4. Google Drive Backup Setup (Optional but Recommended)

#### a. Install Google APIs dependency (already included, but for reference):

```bash
npm install googleapis
```

#### b. Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one.
3. Enable the **Google Drive API**.
4. Create OAuth 2.0 credentials (Web application).
5. Add authorized redirect URI:
   - `http://localhost:3000/oauth2callback`

#### c. Get a Refresh Token

1. Fill in `GOOGLE_DRIVE_CLIENT_ID` and `GOOGLE_DRIVE_CLIENT_SECRET` in your `.env`.
2. Run the script to get your refresh token:

```bash
node src/scripts/get-refresh-token.js
```

3. Follow the prompts, authorize, and paste the code.
4. Copy the refresh token output and add it to your `.env` as `GOOGLE_DRIVE_REFRESH_TOKEN`.

---

### 5. Add Your First User

There is **no public registration endpoint**. To add an initial user:

1. Add these variables to your `.env` (temporarily):

```env
USER_EMAIL=your@email.com
PASSWORD=yourpassword
```

2. Run:

```bash
node src/scripts/add-user.js
```

3. Remove `USER_EMAIL` and `PASSWORD` from your `.env` after the user is created.

---

### 6. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security Features

- **Client-side encryption**: All sensitive data is encrypted before being sent to the server.
- **Deletion password**: Required for deleting passwords and folders (set via environment variables).
- **Google Drive backup**: All changes are redundantly backed up (if enabled).
- **JWT authentication**: Secure, stateless sessions.
- **Email verification**: Prevents unauthorized access.

---

## Google Drive Backup Details

- **Automatic**: Every create/delete triggers a backup.
- **Redundant**: MongoDB is primary, Google Drive is backup.
- **Versioned**: Each backup is timestamped.
- **Recovery**: Restore from Google Drive if MongoDB fails.

---

## API Endpoints

- `/api/auth/login` – Login
- `/api/auth/logout` – Logout
- `/api/auth/verify-user` – Verify session
- `/api/folders` – CRUD for folders
- `/api/passwords` – CRUD for passwords

---

## Troubleshooting

- **MongoDB connection errors**: Check `MONGODB_URI`.
- **Google Drive errors**: Check all Google Drive env vars and refresh token.
- **User not found**: Ensure you added a user via the script.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT
