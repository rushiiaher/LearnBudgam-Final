import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateSubjects() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        // 1. Add school_id column
        try {
            const [columns] = await connection.execute("SHOW COLUMNS FROM subjects LIKE 'school_id'");
            if (columns.length === 0) {
                console.log('Adding school_id to subjects table...');
                await connection.execute(`
                ALTER TABLE subjects
                ADD COLUMN school_id INT,
                ADD CONSTRAINT fk_subject_school FOREIGN KEY (school_id) REFERENCES schools(id)
            `);
                console.log('Success: Added school_id');
            } else {
                console.log('Skipping: school_id already exists');
            }
        } catch (err) {
            console.warn('Error adding school_id:', err.message);
        }

        // 2. Ensure Soft Deletes (is_active)
        try {
            const [columns] = await connection.execute("SHOW COLUMNS FROM subjects LIKE 'is_active'");
            if (columns.length === 0) {
                console.log('Adding is_active to subjects table...');
                await connection.execute(`
                ALTER TABLE subjects
                ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
                ADD COLUMN deleted_at TIMESTAMP NULL
            `);
                console.log('Success: Added is_active');
            } else {
                console.log('Skipping: is_active already exists');
            }
        } catch (err) {
            console.warn('Error adding is_active:', err.message);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSubjects();
