import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateLiveClasses() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        // 1. Add teacher_id column
        try {
            const [columns] = await connection.execute("SHOW COLUMNS FROM live_classes LIKE 'teacher_id'");
            if (columns.length === 0) {
                console.log('Adding teacher_id to live_classes table...');
                await connection.execute(`
                ALTER TABLE live_classes
                ADD COLUMN teacher_id INT,
                ADD CONSTRAINT fk_live_class_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)
            `);
                console.log('Success: Added teacher_id');
            } else {
                console.log('Skipping: teacher_id already exists');
            }
        } catch (err) {
            console.warn('Error adding teacher_id:', err.message);
        }

        // 2. Ensure Soft Deletes (is_active)
        try {
            const [columns] = await connection.execute("SHOW COLUMNS FROM live_classes LIKE 'is_active'");
            if (columns.length === 0) {
                console.log('Adding is_active to live_classes table...');
                await connection.execute(`
                ALTER TABLE live_classes
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

updateLiveClasses();
