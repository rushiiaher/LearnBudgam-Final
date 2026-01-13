import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateStudentProfiles() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Adding missing columns to student_profiles...');

        // Attempt to add columns individually (ignoring errors if they exist)
        try {
            await connection.execute("ALTER TABLE student_profiles ADD COLUMN dob DATE");
            console.log("Added dob");
        } catch (e) { console.log("dob might already exist"); }

        try {
            await connection.execute("ALTER TABLE student_profiles ADD COLUMN gender ENUM('Male', 'Female', 'Other')");
            console.log("Added gender");
        } catch (e) { console.log("gender might already exist"); }

        try {
            await connection.execute("ALTER TABLE student_profiles ADD COLUMN address TEXT");
            console.log("Added address");
        } catch (e) { console.log("address might already exist"); }

    } catch (error) {
        console.error(error);
    } finally {
        connection.end();
    }
}

updateStudentProfiles();
