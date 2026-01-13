import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function checkSubjectSchema() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('DESCRIBE subjects');
        console.log(rows);
    } catch (error) {
        console.error(error);
    } finally {
        connection.end();
    }
}

checkSubjectSchema();
