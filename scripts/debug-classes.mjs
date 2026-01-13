
import mysql from 'mysql2/promise';

async function main() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
    });

    try {
        console.log("Attempting to add Global Class (NULL school_id)...");
        const [res] = await pool.execute(
            'INSERT INTO classes (name, school_id) VALUES (?, NULL)',
            ['Debug Global Class']
        );
        console.log("Insert result:", res);

        const [rows] = await pool.execute('SELECT * FROM classes WHERE name = ?', ['Debug Global Class']);
        console.log("Fetched class:", rows);

    } catch (e) {
        console.error("Insert failed:", e);
    } finally {
        await pool.end();
    }
}

main();
