import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function addSoftDeletes() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        const tables = ['schools', 'users', 'classes', 'subjects'];

        for (const table of tables) {
            try {
                // Check if column exists
                const [columns] = await connection.execute(`SHOW COLUMNS FROM ${table} LIKE 'is_active'`);

                if (columns.length === 0) {
                    console.log(`Adding soft delete columns to ${table}...`);
                    await connection.execute(`
                    ALTER TABLE ${table}
                    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
                    ADD COLUMN deleted_at TIMESTAMP NULL
                 `);
                    console.log(`Success: ${table}`);
                } else {
                    console.log(`Skipping: ${table} already has is_active`);
                }
            } catch (err) {
                // Table might not exist yet (e.g. subjects), just log warning
                console.warn(`Could not alter table ${table}:`, err.message);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addSoftDeletes();
