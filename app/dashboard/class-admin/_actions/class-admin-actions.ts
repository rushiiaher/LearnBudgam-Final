'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export type ClassAdmin = {
    id: number;
    user_id: number;
    school_id: number;
    school_name?: string | null; // Added
    name: string;
    email: string;
    class_id: number;
    class_name: string;
    created_at: string;
};

export async function getClassAdmins() {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const schoolId = session?.user?.schoolId;

    try {
        let query = `
      SELECT cap.id, u.id as user_id, u.school_id, s.name as school_name, u.name, u.email, cap.class_id, c.name as class_name, cap.created_at
      FROM class_admin_profiles cap
      JOIN users u ON cap.user_id = u.id
      JOIN classes c ON cap.class_id = c.id
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.role_id = 4 AND u.is_active = true
    `;
        const params: any[] = [];

        if (roleId === 2 && schoolId) {
            query += ` AND u.school_id = ?`;
            params.push(schoolId);
        }

        query += ` ORDER BY cap.created_at DESC`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as ClassAdmin[];
    } catch (error) {
        console.error('Failed to fetch class admins:', error);
        return [];
    }
}

export async function assignClassAdmin(formData: FormData) {
    const teacher_id = formData.get('teacher_id') as string;
    const class_id = formData.get('class_id') as string;

    if (!teacher_id || !class_id) {
        return { success: false, message: 'Teacher and Class are required.' };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check if teacher already has a class
        const [existing] = await connection.execute<RowDataPacket[]>('SELECT id FROM class_admin_profiles WHERE user_id = ?', [teacher_id]);
        if (existing.length > 0) {
            return { success: false, message: 'This teacher is already assigned to a class.' };
        }

        // Check if class already has an admin
        const [existingClass] = await connection.execute<RowDataPacket[]>('SELECT id FROM class_admin_profiles WHERE class_id = ?', [class_id]);
        if (existingClass.length > 0) {
            return { success: false, message: 'This class already has an admin.' };
        }

        await connection.execute(
            'INSERT INTO class_admin_profiles (user_id, class_id) VALUES (?, ?)',
            [teacher_id, class_id]
        );

        await connection.commit();
        revalidatePath('/dashboard/class-admin');
        return { success: true, message: 'Class Admin assigned successfully.' };
    } catch (error: any) {
        await connection.rollback();
        console.error('Failed to assign class admin:', error);
        return { success: false, message: 'Failed to assign class admin.' };
    } finally {
        connection.release();
    }
}

export async function removeClassAdmin(id: number) {
    try {
        await pool.execute('DELETE FROM class_admin_profiles WHERE id = ?', [id]);
        revalidatePath('/dashboard/class-admin');
        return { success: true, message: 'Class Admin removed successfully.' };
    } catch (error) {
        console.error('Failed to remove class admin:', error);
        return { success: false, message: 'Failed to remove class admin.' };
    }
}

// Fetch available teachers (Role 4) in the school who are NOT already class admins
export async function getAvailableTeachers(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT u.id, u.name 
            FROM users u
            LEFT JOIN class_admin_profiles cap ON u.id = cap.user_id
            WHERE u.role_id = 4 
            AND u.school_id = ? 
            AND u.is_active = true
            AND cap.id IS NULL
            ORDER BY u.name
        `, [schoolId]);
        return rows as { id: number, name: string }[];
    } catch (error) {
        console.error("Failed to fetch available teachers", error);
        return [];
    }
}

// Function to fetch classes that DO NOT yet have an admin (scoped by school)
export async function getAvailableClassesForAdmin(schoolId: number) {
    try {
        let query = `
            SELECT c.id, c.name
            FROM classes c
            LEFT JOIN class_admin_profiles cap ON c.id = cap.class_id
            WHERE c.school_id = ? AND c.is_active = true
            AND cap.class_id IS NULL`;

        const params: any[] = [schoolId];

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as { id: number, name: string }[];
    } catch (error) {
        console.error("Failed to fetch available classes", error);
        return [];
    }
}
