# Next.js LMS Project Analysis
## Learn Budgam - Educational Management System

---

## 📋 Executive Summary

**Learn Budgam** is a modern Learning Management System built with **Next.js 15** and **React 19**, designed to streamline educational management for institutions. Ideally suited for the Srinagar/Budgam region, it mirrors the robust feature set of the "Learn Srinagar" system but leverages the latest React Server Components architecture.

**Key Technical Decision**: 
The project is transitioning from an ORM-based approach (Prisma) to a **Native MySQL** implementation using `mysql2` for maximum performance, control, and reduced dependency overhead.

**Technology Stack**:
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend**: Next.js Server Actions
- **Database**: MySQL 8.0 (Local instance)
- **Database Driver**: `mysql2` (replacing Prisma)
- **Authentication**: Auth.js (NextAuth v5)
- **UI Components**: Radix UI, Shadcn/ui pattern

---

## 👥 User Roles & Permissions

The system maintains the same rigorous Role-Based Access Control (RBAC) as the reference architecture:

| Role | ID | Description | Key Permissions |
|------|----|-----------|-----------------|
| **Super Admin** | 1 | System Owner | Complete control over schools, users, and global settings. |
| **School Admin** | 2 | School Principal/Manager | Manage school-specific teachers, students, and classes. |
| **Class Admin** | 3 | Class Caretaker | Manage attendance and details for specific classes. |
| **Teacher** | 4 | Educator | Create homework, schedule live classes, mark attendance. |
| **Student** | 5 | Learner | View lessons, submit homework, join live classes. |
| **Parent** | 6 | Guardian | Monitor child's progress and attendance. |

---

## 🏗️ System Architecture

### Application Structure (`/app`)
```
src/app/
├── (auth)/
│   └── login/             # Authentication entry point
├── (dashboard)/
│   └── dashboard/         # Role-protected dashboard layouts
├── schools/               # School management
├── lectures/              # Live class interface
├── textbook/              # Digital resources
├── news/                  # Announcements & Blog
├── api/                   # API Routes (if needed)
└── layout.tsx             # Root layout with providers
```

### Database Architecture (Native MySQL)

The database interactions will use raw SQL queries via a helper wrapper around `mysql2/promise`.

**Connection Config**:
```javascript
// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'devuser',
  password: 'Dev@Mysql123!',
  database: 'learnsrinagar', // or learnbudgam
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

### Core Schema (SQL)
Derived from the existing data model, but tailored for direct SQL usage:

**Users & Roles**
```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- super_admin, etc.
  description TEXT
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  school_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (school_id) REFERENCES schools(id)
);
```

**Academic Structure**
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

**Learning Management**
```sql
CREATE TABLE live_classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  status ENUM('scheduled', 'live', 'completed') DEFAULT 'scheduled',
  class_id INT NOT NULL,
  subject_id INT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE homework (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  class_id INT NOT NULL,
  subject_id INT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
```

---

## 🔧 Feature Implementation Strategy

### 1. Authentication (Auth.js + MySQL)
Instead of the Prisma adapter, we will use the **Credentials Provider** in Auth.js.
- **Login**: Validate email/password against `users` table using `bcryptjs`.
- **Session**: JWT-based session containing `user_id`, `role`, and `school_id`.
- **Middleware**: `middleware.ts` will inspect the token and redirect unauthorized users based on their role.

### 2. Live Classes
- **Input**: Teachers schedule classes via a form (Server Action).
- **Storage**: `INSERT INTO live_classes ...`
- **View**: Embedded YouTube player or meeting link on `/lectures` page.

### 3. Dashboard Analytics
- **Query**: Direct aggregations for performance.
  ```sql
  SELECT COUNT(*) as present_count 
  FROM student_attendance 
  WHERE date = CURRENT_DATE AND status = 'Present';
  ```
- **Visualization**: Recharts components consuming data from Server Components.

---

## 🚀 Migration Plan (Prisma to MySQL)

1.  **Setup Database**: Ensure local MySQL is running and the schema is applied.
2.  **Create DB Connection**: Implement `lib/db.ts` with `mysql2` pool.
3.  **Refactor Auth**: Update `auth.ts` to fetch user from MySQL directly.
4.  **Refactor Actions**: Rewrite Server Actions to Replace `prisma.model.findMany()` with `pool.execute('SELECT ...')`.
5.  **Remove Prisma**: Uninstall Prisma client and CLI to reduce bundle size.

---

## 🛡️ Security Considerations
- **SQL Injection**: ALWAYS use parameterized queries (`?` placeholders) with `mysql2`. Never interpolate strings directly.
- **Environment Variables**: Move credentials to `.env.local` (do not commit hardcoded passwords).
- **Validation**: Use Zod for all input validation before passing to SQL queries.

---

*Analysis generated for immediate implementation.*
