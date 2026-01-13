import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateSubjectsTable() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Updating subjects table...');

        // Add class_id
        try {
            await connection.execute("ALTER TABLE subjects ADD COLUMN class_id INT");
            await connection.execute("ALTER TABLE subjects ADD CONSTRAINT fk_subjects_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE");
            console.log("Added class_id");
        } catch (e) { console.log("class_id might already exist or error: " + e.message); }

        // Add teacher_id
        try {
            await connection.execute("ALTER TABLE subjects ADD COLUMN teacher_id INT");
            await connection.execute("ALTER TABLE subjects ADD CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL");
            console.log("Added teacher_id");
        } catch (e) { console.log("teacher_id might already exist or error: " + e.message); }

    } catch (error) {
        console.error(error);
    } finally {
        connection.end();
    }
}

updateSubjectsTable();
