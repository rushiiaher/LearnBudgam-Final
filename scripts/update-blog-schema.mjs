import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
    waitForConnections: true,
    connectionLimit: 1
};

async function updateSchema() {
    console.log('Starting schema update...');
    const pool = mysql.createPool(dbConfig);

    try {
        console.log('Test connection...');
        await pool.query('SELECT 1');
        console.log('Connection successful.');

        // Add image_path if not exists
        try {
            console.log('Attempting to add image_path column...');
            await pool.query("ALTER TABLE blogs ADD COLUMN image_path VARCHAR(255)");
            console.log('image_path column added.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('image_path column already exists (ER_DUP_FIELDNAME).');
            } else {
                console.error('Error adding image_path:', err.message);
            }
        }

        // Add slug if not exists
        try {
            console.log('Attempting to add slug column...');
            // We allow NULL initially to avoid errors with existing rows, then we can update them if needed, 
            // but for now let's just add it.
            await pool.query("ALTER TABLE blogs ADD COLUMN slug VARCHAR(255)");
            console.log('slug column added.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('slug column already exists (ER_DUP_FIELDNAME).');
            } else {
                console.error('Error adding slug:', err.message);
            }
        }

    } catch (err) {
        console.error('Fatal database error:', err);
    } finally {
        await pool.end();
        console.log('Done.');
    }
}

updateSchema();
