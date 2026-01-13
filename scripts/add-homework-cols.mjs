import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log('Adding columns to homework table...');

        await pool.execute(`
            ALTER TABLE homework 
            ADD COLUMN pdf_path VARCHAR(255) NULL,
            ADD COLUMN google_drive_link VARCHAR(255) NULL,
            ADD COLUMN youtube_link VARCHAR(255) NULL;
        `);

        console.log('Successfully altered homework table.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist.');
        } else {
            console.error('Error altering table:', error);
        }
    } finally {
        await pool.end();
        process.exit();
    }
}

run();
