import { getDb } from 'lib/db';
import bcrypt from 'bcryptjs';

async function addUser() {
    try {
        const email = process.env.USER_EMAIL;
        const password = process.env.PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;
        if (!email || !password || !jwtSecret) {
            console.error('Missing environment variables');
            return;
        }
        const db = await getDb();
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            console.log('User already exists');
            return;
        }

        // Register new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.collection('users').insertOne({ email, password: hashedPassword, isVerified: true });
        userId = newUser.insertedId;
        console.log('User registered with ID:', userId);
    } catch (error) {
        console.error('Login error:', error);
    }
}

addUser()
    .then(() => console.log('User added successfully'))
    .catch((error) => console.error('Error adding user:', error));
