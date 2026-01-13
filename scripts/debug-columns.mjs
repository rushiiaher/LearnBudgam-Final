
import mysql from 'mysql2/promise';

async function main() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
    });

    try {
        const [rows] = await pool.execute("SHOW COLUMNS FROM subjects");
        console.log("Columns in subjects table:", rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

main();
