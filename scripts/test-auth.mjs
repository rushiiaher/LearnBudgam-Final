import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function testAuth() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        const email = 'admin@learnbudgam.com';
        const password = 'admin123'; // The seed password

        const [rows] = await connection.execute(
            `SELECT u.*, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ?`,
            [email]
        );

        if (rows.length === 0) {
            console.log('User not found');
            return;
        }

        const user = rows[0];
        console.log('User found:', user.email, 'Role:', user.role_name);

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

testAuth();
