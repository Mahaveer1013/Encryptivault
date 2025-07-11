# PassiVault - Secure Password Manager

A secure password manager built with Next.js, featuring client-side encryption and a deletion password system for enhanced security.

## Features

- 🔐 Client-side encryption for maximum security
- 📁 Folder-based organization
- 🗑️ Deletion password protection
- 👤 User authentication
- 📧 Email verification
- 🎨 Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Email service (for verification)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/Encryptivault

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Deletion Password (required for deleting passwords)
DELETION_PASSWORD=your-deletion-password-change-this-in-production
```

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Security Features

### Deletion Password
When deleting passwords, users must provide a deletion password that matches the `DELETION_PASSWORD` environment variable. This adds an extra layer of protection against accidental or unauthorized deletions.

### Client-Side Encryption
All passwords are encrypted on the client side before being stored in the database, ensuring that even if the database is compromised, the passwords remain secure.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
