'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type Parent = {
    id: number;
    name: string;
    email: string;
    role_id: number;
    school_id: number;
    school_name: string;
    created_at: string;
    student_names: string[]; // List of linked student names
    student_ids: number[];
};

export async function getParents() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT u.id, u.name, u.email, u.role_id, u.school_id, u.created_at, 
             s.name as school_name,
             GROUP_CONCAT(stu.name) as student_names,
             GROUP_CONCAT(stu.id) as student_ids
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN parent_student ps ON u.id = ps.parent_id
      LEFT JOIN users stu ON ps.student_id = stu.id
      WHERE u.role_id = 6 AND u.is_active = true
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

        return rows.map((row: any) => ({
            ...row,
            student_names: row.student_names ? row.student_names.split(',') : [],
            student_ids: row.student_ids ? row.student_ids.split(',').map(Number) : []
        })) as Parent[];
    } catch (error) {
        console.error('Failed to fetch parents:', error);
        return [];
    }
}

export async function createParent(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const school_id = formData.get('school_id') as string;
    const student_ids = formData.getAll('student_id') as string[]; // Multi-select

    if (!email || !password || !school_id) {
        return { success: false, message: 'Missing required fields.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create User
        const [userResult] = await connection.execute<ResultSetHeader>(
            'INSERT INTO users (name, email, password, role_id, school_id) VALUES (?, ?, ?, 6, ?)',
            [name, email, hashedPassword, parseInt(school_id)]
        );
        const parentId = userResult.insertId;

        // 2. Link Students
        if (student_ids.length > 0) {
            const values = student_ids.map(id => [parentId, parseInt(id)]);
            // Bulk insert
            // Note: mysql2 execute doesn't support bulk insert with ? placeholders easily for variable length.
            // using loop for now as count is low.
            for (const sid of student_ids) {
                await connection.execute(
                    'INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)',
                    [parentId, parseInt(sid)]
                );
            }
        }

        await connection.commit();
        revalidatePath('/dashboard/parents');
        return { success: true, message: 'Parent created successfully.' };
    } catch (error: any) {
        await connection.rollback();
        console.error('Failed to create parent:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Email already exists.' };
        }
        return { success: false, message: 'Failed to create parent.' };
    } finally {
        connection.release();
    }
}

export async function updateParent(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const school_id = formData.get('school_id') as string;
    const password = formData.get('password') as string;
    const student_ids = formData.getAll('student_id') as string[];

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

        // 2. Update Links (Delete all and re-insert)
        await connection.execute('DELETE FROM parent_student WHERE parent_id = ?', [id]);

        if (student_ids.length > 0) {
            for (const sid of student_ids) {
                await connection.execute(
                    'INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)',
                    [id, parseInt(sid)]
                );
            }
        }

        await connection.commit();
        revalidatePath('/dashboard/parents');
        return { success: true, message: 'Parent updated successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error('Failed to update parent:', error);
        return { success: false, message: 'Failed to update parent.' };
    } finally {
        connection.release();
    }
}

export async function deleteParent(id: number) {
    try {
        await pool.execute('UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/parents');
        return { success: true, message: 'Parent deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete parent:', error);
        return { success: false, message: 'Failed to delete parent.' };
    }
}

export async function getStudentsBySchool(schoolId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, email FROM users WHERE role_id = 5 AND school_id = ? AND is_active = true",
        [schoolId]
    );
    return rows as { id: number, name: string }[];
}
