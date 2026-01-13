import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function checkUsersSchema() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('DESCRIBE users');
        console.log(rows);
    } catch (error) {
        console.error(error);
    } finally {
        connection.end();
    }
}

checkUsersSchema();
