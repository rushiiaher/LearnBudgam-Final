import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    database: 'learnbudgam',
};

async function updateLiveClassSchemaRetry() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Retrying Schema Update...');

        // Try adding uploaded_by_role separately
        try {
            await connection.execute(`ALTER TABLE live_classes ADD COLUMN uploaded_by_role INT NOT NULL DEFAULT 4`);
            console.log("Added uploaded_by_role");
        } catch (e) { console.log("uploaded_by_role exists or error:", e.message); }

        try {
            await connection.execute(`ALTER TABLE live_classes ADD COLUMN uploaded_by_user_id INT NOT NULL DEFAULT 0`);
            console.log("Added uploaded_by_user_id");
        } catch (e) { console.log("uploaded_by_user_id exists or error:", e.message); }

        try {
            await connection.execute(`ALTER TABLE live_classes ADD INDEX idx_uploader (uploaded_by_role, uploaded_by_user_id)`);
        } catch (e) { /* index might exist */ }

        // Create Pivot
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
        console.log("Pivot table live_class_shares ensured.");

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        connection.end();
    }
}

updateLiveClassSchemaRetry();
