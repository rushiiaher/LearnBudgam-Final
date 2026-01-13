import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function addClassAdminProfilesTable() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB');

        console.log('Creating class_admin_profiles table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS class_admin_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        class_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user (user_id),
        UNIQUE KEY unique_class (class_id)
      )
    `);
        console.log('Success: class_admin_profiles table initialized');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addClassAdminProfilesTable();
