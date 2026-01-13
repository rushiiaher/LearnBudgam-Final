import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function createHomeworkTable() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Creating homework table...');

        await connection.execute(`
      CREATE TABLE IF NOT EXISTS homework (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        school_id INT NOT NULL,
        class_id INT NOT NULL,
        subject_id INT NOT NULL,
        assigned_by_role_id INT NOT NULL,
        created_by INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (class_id) REFERENCES classes(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        
        INDEX idx_school (school_id),
        INDEX idx_subject (subject_id),
        INDEX idx_assigned_role (assigned_by_role_id),
        INDEX idx_creator (created_by)
      )
    `);

        console.log('Homework table created successfully.');

    } catch (error) {
        console.error(error);
    } finally {
        connection.end();
    }
}

createHomeworkTable();
