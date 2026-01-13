import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: 'localhost',
    user: 'devuser',
    password: 'Dev@Mysql123!',
    multipleStatements: true, // Allow multiple SQL statements
};

const schema = `
CREATE DATABASE IF NOT EXISTS learnbudgam;
USE learnbudgam;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

-- Schools
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  school_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  school_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subject Classes Link
CREATE TABLE IF NOT EXISTS subject_classes (
  class_id INT,
  subject_id INT,
  PRIMARY KEY (class_id, subject_id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Live Classes
CREATE TABLE IF NOT EXISTS live_classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
  class_id INT NOT NULL,
  subject_id INT NOT NULL,
  school_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  enrollment_no VARCHAR(50) UNIQUE NOT NULL,
  class_id INT NOT NULL,
  school_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS student_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- Present, Absent, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  UNIQUE KEY unique_attendance (student_id, date)
);
`;

const seedData = async (connection) => {
    console.log('Seeding data...');

    // Seed Roles
    const roles = [
        { id: 1, name: 'super_admin' },
        { id: 2, name: 'school_admin' },
        { id: 3, name: 'class_admin' },
        { id: 4, name: 'teacher' },
        { id: 5, name: 'student' },
        { id: 6, name: 'parent' }
    ];

    for (const role of roles) {
        await connection.execute('INSERT IGNORE INTO roles (id, name) VALUES (?, ?)', [role.id, role.name]);
    }

    // Seed School
    await connection.execute("INSERT IGNORE INTO schools (id, name, address) VALUES (1, 'Learn Budgam High School', 'Budgam, Kashmir')");

    // Seed Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
        'INSERT IGNORE INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
        ['Super Admin', 'admin@learnbudgam.com', hashedPassword, 1]
    );

    console.log('Seeding completed.');
};

async function init() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        await connection.query(schema);
        console.log('Schema applied successfully.');

        // Switch to database for seeding
        await connection.changeUser({ database: 'learnbudgam' });

        await seedData(connection);

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) await connection.end();
    }
}

init();
