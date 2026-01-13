
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
    multipleStatements: true
};

async function migrate() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    try {
        console.log('Modifying classes table...');
        // Modify school_id to allow NULL, serving as "Global Class" indicator
        await connection.query('ALTER TABLE classes MODIFY school_id int NULL');

        console.log('Migration successful: classes.school_id is now nullable.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
