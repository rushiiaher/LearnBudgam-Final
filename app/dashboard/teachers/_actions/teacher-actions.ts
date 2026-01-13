'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type Teacher = {
    id: number;
    name: string;
    email: string;
    role_id: number;
    school_id: number;
    school_name: string;
    created_at: string;
};

export async function getTeachers() {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const schoolId = session?.user?.schoolId;

    try {
        let query = `
            SELECT u.id, u.name, u.email, u.role_id, u.school_id, u.created_at, s.name as school_name 
            FROM users u 
            LEFT JOIN schools s ON u.school_id = s.id 
            WHERE u.role_id = 4 AND u.is_active = true
        `;
        const params: any[] = [];

        if (roleId === 2 && schoolId) {
            query += ` AND u.school_id = ?`;
            params.push(schoolId);
        }

        query += ` ORDER BY u.created_at DESC`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as Teacher[]; // Ensure Teacher type has school_name (it does in our definition)
    } catch (error) {
        return [];
    }
}

export async function getTeachersBySchool(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT id, name, email 
            FROM users 
            WHERE role_id = 4 AND school_id = ? AND is_active = true
            ORDER BY name
        `, [schoolId]);
        return rows as { id: number, name: string }[];
    } catch (e) {
        console.error(e);
        return [];
    }
}

// Helper: Get classes available for assignment (not already taken, OR taken by THIS teacher)
export async function getAvailableClassesForAssignment(schoolId: number, teacherId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT c.id, c.name 
            FROM classes c
            LEFT JOIN class_admin_profiles cap ON c.id = cap.class_id
            WHERE c.school_id = ? AND c.is_active = true
            AND (cap.class_id IS NULL OR cap.user_id = ?)
        `, [schoolId, teacherId]);
        return rows as { id: number, name: string }[];
    } catch (e) { console.error(e); return []; }
}

// Helper: Get subjects available
export async function getAvailableSubjectsForAssignment(schoolId: number, teacherId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT s.id, s.name, c.name as class_name
            FROM subjects s
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.school_id = ? AND s.is_active = true
            ORDER BY c.name, s.name
        `, [schoolId]);
        return rows as { id: number, name: string, class_name: string }[];
    } catch (e) { console.error(e); return []; }
}

// Helper: Get current assignments
export async function getTeacherAssignments(teacherId: number) {
    try {
        // Get Class Admin Profile
        const [adminRows] = await pool.execute<RowDataPacket[]>('SELECT class_id FROM class_admin_profiles WHERE user_id = ?', [teacherId]);
        const classAdminId = adminRows.length > 0 ? adminRows[0].class_id : null;

        // Get Subjects
        const [subRows] = await pool.execute<RowDataPacket[]>('SELECT id FROM subjects WHERE teacher_id = ?', [teacherId]);
        const subjectIds = subRows.map(r => r.id);

        return { classAdminId, subjectIds };
    } catch (e) { console.error(e); return { classAdminId: null, subjectIds: [] }; }
}

export async function assignClassAdmin(teacherId: number, classId: number | null) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Remove existing class admin profile for this teacher (if any)
        await connection.execute('DELETE FROM class_admin_profiles WHERE user_id = ?', [teacherId]);

        if (classId) {
            // 2. Check if class taken by another
            const [taken] = await connection.execute<RowDataPacket[]>('SELECT user_id FROM class_admin_profiles WHERE class_id = ? AND user_id != ?', [classId, teacherId]);
            if (taken.length > 0) throw new Error("Class already has an admin");

            // 3. Assign
            await connection.execute('INSERT INTO class_admin_profiles (user_id, class_id) VALUES (?, ?)', [teacherId, classId]);
        }

        await connection.commit();
        revalidatePath('/dashboard/teachers');
        return { success: true, message: 'Class Admin assignment updated.' };
    } catch (error: any) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: error.message || 'Failed to update assignment.' };
    } finally {
        connection.release();
    }
}

export async function assignSubjects(teacherId: number, subjectIds: number[]) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // A. Set teacher_id = NULL for all subjects where teacher_id = teacherId
        await connection.execute('UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?', [teacherId]);

        // B. Set teacher_id = teacherId for new list
        if (subjectIds.length > 0) {
            for (const subId of subjectIds) {
                await connection.execute('UPDATE subjects SET teacher_id = ? WHERE id = ?', [teacherId, subId]);
            }
        }

        await connection.commit();
        revalidatePath('/dashboard/teachers');
        return { success: true, message: 'Subjects assigned successfully.' };
    } catch (error: any) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: 'Failed to assign subjects.' };
    } finally {
        connection.release();
    }
}

export async function createTeacher(formData: FormData) {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const userSchoolId = session?.user?.schoolId;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let school_id = formData.get('school_id') as string;

    if (roleId === 2 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    if (!email || !password || !school_id) {
        return { success: false, message: 'Missing required fields.' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO users (name, email, password, role_id, school_id) VALUES (?, ?, ?, 4, ?)',
            [name, email, hashedPassword, parseInt(school_id)]
        );

        revalidatePath('/dashboard/teachers');
        return { success: true, message: 'Teacher created successfully.' };
    } catch (error) {
        console.error('Failed to create teacher:', error);
        return { success: false, message: 'Failed to create teacher.' };
    }
}

export async function updateTeacher(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const school_id = formData.get('school_id') as string;
    const password = formData.get('password') as string;

    try {
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.execute(
                'UPDATE users SET name = ?, email = ?, school_id = ?, password = ? WHERE id = ?',
                [name, email, parseInt(school_id), hashedPassword, id]
            );
        } else {
            await pool.execute(
                'UPDATE users SET name = ?, email = ?, school_id = ? WHERE id = ?',
                [name, email, parseInt(school_id), id]
            );
        }

        revalidatePath('/dashboard/teachers');
        return { success: true, message: 'Teacher updated successfully.' };
    } catch (error) {
        console.error('Failed to update teacher:', error);
        return { success: false, message: 'Failed to update teacher.' };
    }
}

export async function deleteTeacher(id: number) {
    try {
        await pool.execute('UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/teachers');
        return { success: true, message: 'Teacher deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete teacher:', error);
        return { success: false, message: 'Failed to delete teacher.' };
    }
}
