import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateLiveClassSchema() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Updating live_classes table schema...');

        // 1. Add Ownership Columns if not exist
        // We try to add columns. If they exist, it might error, but ignore unique errors.
        // Easier to just check or try/catch.

        // Check if uploaded_by_role exists
        const [cols] = await connection.execute("SHOW COLUMNS FROM live_classes LIKE 'uploaded_by_role'");
        if (cols.length === 0) {
            await connection.execute(`
            ALTER TABLE live_classes 
            ADD COLUMN uploaded_by_role INT NOT NULL DEFAULT 4,
            ADD COLUMN uploaded_by_user_id INT NOT NULL DEFAULT 0,
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD INDEX idx_uploader (uploaded_by_role, uploaded_by_user_id)
        `);
            console.log("Added ownership columns.");
        }

        // 2. Create Pivot Table
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS live_class_shares (
            id INT AUTO_INCREMENT PRIMARY KEY,
            live_class_id INT NOT NULL,
            class_id INT NOT NULL,
            FOREIGN KEY (live_class_id) REFERENCES live_classes(id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            UNIQUE KEY unique_share (live_class_id, class_id),
            INDEX idx_class_lookup (class_id)
        )
    `);
        console.log("Pivot table live_class_shares created.");

        // 3. Migrate existing class_id to pivot (if any data exists and we want to keep it)
        // Optional: Copy existing relationships
        const [rows] = await connection.execute("SELECT id, class_id FROM live_classes WHERE class_id IS NOT NULL");
        for (const row of rows) {
            try {
                await connection.execute("INSERT IGNORE INTO live_class_shares (live_class_id, class_id) VALUES (?, ?)", [row.id, row.class_id]);
            } catch (e) { /* ignore duplicates */ }
        }

        // We keep class_id in main table as NULLABLE for now to avoid breaking existing queries immediately, 
        // but new logic will rely on Pivot.
        // actually, let's just make it nullable if strict mode is on.
        // await connection.execute("ALTER TABLE live_classes MODIFY COLUMN class_id INT NULL");

    } catch (error) {
        console.error('Schema update failed:', error);
    } finally {
        connection.end();
    }
}

updateLiveClassSchema();
