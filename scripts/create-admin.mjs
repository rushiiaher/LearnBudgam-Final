import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

const email = process.argv[2] || 'admin@learnbudgam.com';
const plainPassword = process.argv[3] || 'newpassword123';

async function createAdmin() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Check if user exists
        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            // Update existing
            await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
            console.log(`Updated password for user: ${email}`);
        } else {
            // Create new
            await connection.execute(
                'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
                ['Super Admin', email, hashedPassword, 1] // Role 1 = Super Admin
            );
            console.log(`Created new user: ${email}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

createAdmin();
