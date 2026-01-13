import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try loading .env from current directory
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
    console.log('--- .env content ---');
    console.log(fs.readFileSync(envPath, 'utf8'));
    console.log('--------------------');
    dotenv.config({ path: envPath });
} else {
    console.log('.env file not found at expected path!');
}

async function run() {
    console.log('Using hardcoded credentials from lib/db.ts...');

    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
        waitForConnections: true,
        connectionLimit: 1
    });

    try {
        console.log('Connecting to DB...');
        const [rows] = await pool.query('SELECT 1');
        console.log('Connected!');

        // Check student_profiles
        try {
            const [cols] = await pool.query('DESCRIBE student_profiles');
            const hasGender = cols.some(c => c.Field === 'gender');
            console.log('student_profiles.gender exists:', hasGender);

            if (!hasGender) {
                console.log('Adding gender column...');
                await pool.query("ALTER TABLE student_profiles ADD COLUMN gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male'");
                console.log('Added gender column.');
            }
        } catch (e) {
            console.error('Error checking student_profiles:', e.message);
        }

        // Check homework
        try {
            const [cols] = await pool.query('DESCRIBE homework');
            const hasPdf = cols.some(c => c.Field === 'pdf_path');
            console.log('homework.pdf_path exists:', hasPdf);

            if (!hasPdf) {
                console.log('Adding homework columns...');
                await pool.query(`
                    ALTER TABLE homework 
                    ADD COLUMN pdf_path VARCHAR(255) NULL,
                    ADD COLUMN google_drive_link VARCHAR(255) NULL,
                    ADD COLUMN youtube_link VARCHAR(255) NULL
                `);
                console.log('Added homework columns.');
            }
        } catch (e) {
            console.error('Error checking homework:', e.message);
        }

    } catch (error) {
        console.error('DB Error:', error.message);
    } finally {
        await pool.end();
    }
}

run();
