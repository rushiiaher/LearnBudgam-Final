'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export type SchoolAdmin = {
    id: number;
    name: string;
    email: string;
    role_id: number;
    school_id: number;
    school_name: string;
    created_at: string;
};

export async function getSchoolAdmins() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT u.id, u.name, u.email, u.role_id, u.school_id, u.created_at, s.name as school_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.role_id = 2 AND u.is_active = true
      ORDER BY u.created_at DESC
    `);
        return rows as SchoolAdmin[];
    } catch (error) {
        console.error('Failed to fetch school admins:', error);
        return [];
    }
}

export async function createSchoolAdmin(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const school_id = formData.get('school_id') as string;

    if (!email || !password || !school_id) {
        return { success: false, message: 'Missing required fields.' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO users (name, email, password, role_id, school_id) VALUES (?, ?, ?, 2, ?)',
            [name, email, hashedPassword, parseInt(school_id)]
        );

        revalidatePath('/dashboard/school-admin');
        return { success: true, message: 'School Admin created successfully.' };
    } catch (error) {
        console.error('Failed to create school admin:', error);
        return { success: false, message: 'Failed to create school admin.' };
    }
}

export async function updateSchoolAdmin(id: number, formData: FormData) {
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

        revalidatePath('/dashboard/school-admin');
        return { success: true, message: 'School Admin updated successfully.' };
    } catch (error) {
        console.error('Failed to update school admin:', error);
        return { success: false, message: 'Failed to update school admin.' };
    }
}

export async function deleteSchoolAdmin(id: number) {
    try {
        await pool.execute('UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/school-admin');
        return { success: true, message: 'School Admin deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete school admin:', error);
        return { success: false, message: 'Failed to delete school admin.' };
    }
}

export async function getSchoolTeachers(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT id, name, email, created_at
            FROM users
            WHERE role_id = 4 AND school_id = ? AND is_active = true
            ORDER BY name ASC
        `, [schoolId]);
        return rows as { id: number, name: string, email: string, created_at: string }[];
    } catch (error) {
        console.error('Failed to get school teachers:', error);
        return [];
    }
}

export async function getSchoolDetails(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT * FROM schools WHERE id = ?
        `, [schoolId]);
        return rows[0] as { id: number, name: string, address: string } | undefined;
    } catch (error) {
        console.error('Failed to get school details:', error);
        return undefined;
    }
}
