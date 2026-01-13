import mysql from 'mysql2/promise';

async function run() {
    console.log('Using hardcoded credentials from lib/db.ts...');

    const pool = mysql.createPool({
        host: 'localhost',
        user: 'devuser',
        password: 'Dev@Mysql123!',
        database: 'learnbudgam',
        waitForConnections: true,
        connectionLimit: 1
    });

    try {
        console.log('Connecting to DB...');

        // 1. Create Blog Categories Table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS blog_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Verified/Created blog_categories table.');

        // 2. Create Blogs Table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                excerpt TEXT,
                content LONGTEXT,
                image_path VARCHAR(255),
                category_id INT,
                author VARCHAR(255),
                published_at DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
            )
        `);
        console.log('Verified/Created blogs table.');

        // Seed some categories if empty
        const [cats] = await pool.query('SELECT count(*) as count FROM blog_categories');
        if (cats[0].count === 0) {
            console.log('Seeding initial categories...');
            const initialCats = ["Academics", "Announcements", "Technology", "Student Life", "Teacher Training"];
            for (const cat of initialCats) {
                await pool.execute('INSERT INTO blog_categories (name) VALUES (?)', [cat]);
            }
            console.log('Seeded categories.');
        }

    } catch (error) {
        console.error('DB Error:', error.message);
    } finally {
        await pool.end();
    }
}

run();
