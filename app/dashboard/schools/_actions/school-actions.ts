'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

export type School = {
    id: number;
    name: string;
    address: string | null;
    created_at: string;
    admin_name: string | null;
    classes_count: number;
    subjects_count: number; // Added
    class_names: string | null;
};

export async function getSchools() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        s.*, 
        u.name as admin_name,
        (SELECT COUNT(*) FROM classes c WHERE c.school_id = s.id AND c.is_active = true) as classes_count,
        (SELECT COUNT(*) FROM subjects sub WHERE sub.school_id = s.id AND sub.is_active = true) as subjects_count,
        (SELECT GROUP_CONCAT(name SEPARATOR ',') FROM classes c WHERE c.school_id = s.id AND c.is_active = true) as class_names
      FROM schools s 
      LEFT JOIN users u ON s.id = u.school_id AND u.role_id = 2
      WHERE s.is_active = true
      ORDER BY s.created_at DESC
    `);
        console.log(`getSchools: Found ${rows.length} schools`);
        return rows as School[];
    } catch (error) {
        console.error('Failed to fetch schools:', error);
        return [];
    }
}

export async function createSchool(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    try {
        await pool.execute(
            'INSERT INTO schools (name, address) VALUES (?, ?)',
            [name, address]
        );
        console.log(`createSchool: Successfully created school ${name}`);
        revalidatePath('/dashboard/schools');
        return { success: true, message: 'School created successfully.' };
    } catch (error) {
        console.error('Failed to create school:', error);
        return { success: false, message: 'Failed to create school.' };
    }
}

export async function updateSchool(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    try {
        await pool.execute(
            'UPDATE schools SET name = ?, address = ? WHERE id = ?',
            [name, address, id]
        );
        revalidatePath('/dashboard/schools');
        return { success: true, message: 'School updated successfully.' };
    } catch (error) {
        console.error('Failed to update school:', error);
        return { success: false, message: 'Failed to update school.' };
    }
}

export async function deleteSchool(id: number) {
    try {
        await pool.execute('UPDATE schools SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/schools');
        return { success: true, message: 'School deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete school:', error);
        return { success: false, message: 'Failed to delete school.' };
    }
}
