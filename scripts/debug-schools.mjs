
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
    });

    try {
        const [rows] = await pool.execute(`
          SELECT s.*, u.name as admin_name 
          FROM schools s 
          LEFT JOIN users u ON s.id = u.school_id AND u.role_id = 2
          WHERE s.is_active = true
          ORDER BY s.created_at DESC
        `);
        console.log("Schools found:", rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

main();
