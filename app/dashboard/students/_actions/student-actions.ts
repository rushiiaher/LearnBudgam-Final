'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type Student = {
    id: number;
    name: string;
    email: string;
    role_id: number;
    school_id: number;
    school_name: string;
    enrollment_no: string;
    class_id: number;
    class_name: string;
    dob: string;
    gender: string;
    address: string;
    created_at: string;
};

import { auth } from '@/auth';

export async function getStudents() {
    const session = await auth();
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : 0;
    const schoolId = session?.user?.schoolId;

    try {
        let query = `
      SELECT u.id, u.name, u.email, u.role_id, u.school_id, u.created_at, 
             s.name as school_name,
             p.enrollment_no, p.dob, p.gender, p.address,
             c.name as class_name, p.class_id
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN student_profiles p ON u.id = p.user_id
      LEFT JOIN classes c ON p.class_id = c.id
      WHERE u.role_id = 5 AND u.is_active = true
    `;
        const params: any[] = [];

        // Filter for School Admin
        if (roleId === 2 && schoolId) {
            query += ` AND u.school_id = ?`;
            params.push(schoolId);
        }

        query += ` ORDER BY u.created_at DESC`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as Student[];
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return [];
    }
}

export async function createStudent(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const school_id = formData.get('school_id') as string;
    const class_id = formData.get('class_id') as string;
    const enrollment_no = formData.get('enrollment_no') as string;
    const gender = formData.get('gender') as string;
    const dob = formData.get('dob') as string;
    const address = formData.get('address') as string;

    console.log('createStudent payload:', { name, email, school_id, class_id, enrollment_no });

    if (!email || !password || !school_id || !class_id || !enrollment_no) {
        console.log('createStudent failed: Missing fields');
        return { success: false, message: 'Missing required fields.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create User
        const [userResult] = await connection.execute<ResultSetHeader>(
            'INSERT INTO users (name, email, password, role_id, school_id) VALUES (?, ?, ?, 5, ?)',
            [name, email, hashedPassword, parseInt(school_id)]
        );
        const userId = userResult.insertId;

        // 2. Create Profile
        await connection.execute(
            'INSERT INTO student_profiles (user_id, enrollment_no, class_id, school_id, gender, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, enrollment_no, parseInt(class_id), parseInt(school_id), gender || null, dob || null, address || null]
        );

        await connection.commit();
        revalidatePath('/dashboard/students');
        return { success: true, message: 'Student created successfully.' };
    } catch (error: any) {
        await connection.rollback();
        console.error('Failed to create student:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Email or Enrollment Number already exists.' };
        }
        return { success: false, message: 'Failed to create student.' };
    } finally {
        connection.release();
    }
}

export async function updateStudent(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const school_id = formData.get('school_id') as string;
    const password = formData.get('password') as string;
    const class_id = formData.get('class_id') as string;
    const enrollment_no = formData.get('enrollment_no') as string;
    const gender = formData.get('gender') as string;
    const dob = formData.get('dob') as string;
    const address = formData.get('address') as string;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Update User
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await connection.execute(
                'UPDATE users SET name = ?, email = ?, school_id = ?, password = ? WHERE id = ?',
                [name, email, parseInt(school_id), hashedPassword, id]
            );
        } else {
            await connection.execute(
                'UPDATE users SET name = ?, email = ?, school_id = ? WHERE id = ?',
                [name, email, parseInt(school_id), id]
            );
        }

        // 2. Update Profile
        // Check if profile exists, if not insert (handle edge case where profile missing)
        const [existingProfile] = await connection.execute<RowDataPacket[]>('SELECT id FROM student_profiles WHERE user_id = ?', [id]);

        if (existingProfile.length > 0) {
            await connection.execute(
                'UPDATE student_profiles SET enrollment_no = ?, class_id = ?, school_id = ?, gender = ?, dob = ?, address = ? WHERE user_id = ?',
                [enrollment_no, parseInt(class_id), parseInt(school_id), gender || null, dob || null, address || null, id]
            );
        } else {
            await connection.execute(
                'INSERT INTO student_profiles (user_id, enrollment_no, class_id, school_id, gender, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, enrollment_no, parseInt(class_id), parseInt(school_id), gender || null, dob || null, address || null]
            );
        }

        await connection.commit();
        revalidatePath('/dashboard/students');
        return { success: true, message: 'Student updated successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error('Failed to update student:', error);
        return { success: false, message: 'Failed to update student.' };
    } finally {
        connection.release();
    }
}

export async function deleteStudent(id: number) {
    try {
        await pool.execute('UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/students');
        return { success: true, message: 'Student deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete student:', error);
        return { success: false, message: 'Failed to delete student.' };
    }
}
