import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
