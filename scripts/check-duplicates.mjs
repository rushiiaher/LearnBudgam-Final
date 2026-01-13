
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
});

async function checkGlobalClasses() {
    try {
        console.log('Checking for Global Classes (school_id is NULL)...');
        const [rows] = await pool.execute('SELECT * FROM classes WHERE school_id IS NULL AND is_active = true');
        console.table(rows);

        console.log('Checking for Potential Duplicates...');
        const [duplicates] = await pool.execute(`
            SELECT name, COUNT(*) as count 
            FROM classes 
            WHERE school_id IS NULL AND is_active = true 
            GROUP BY name 
            HAVING count > 1
        `);
        console.table(duplicates);

        console.log('Checking ALL Classes (active)...');
        const [allClasses] = await pool.execute('SELECT id, name, school_id, created_at FROM classes WHERE is_active = true ORDER BY name');
        console.table(allClasses);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkGlobalClasses();
