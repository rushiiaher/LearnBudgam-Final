
import mysql from 'mysql2/promise';

async function main() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
    });

    try {
        console.log("Attempting to add Test School...");
        const [res] = await pool.execute(
            'INSERT INTO schools (name, address) VALUES (?, ?)',
            ['Test School Script', 'Test Address']
        );
        console.log("Insert result:", res);

        const [rows] = await pool.execute('SELECT * FROM schools WHERE name = ?', ['Test School Script']);
        console.log("Fetched school:", rows);

    } catch (e) {
        console.error("Insert failed:", e);
    } finally {
        await pool.end();
    }
}

main();
