'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export interface Homework {
    id: number;
    title: string;
    description: string;
    school_id: number;
    school_name: string;
    class_id: number;
    class_name: string;
    subject_id: number;
    subject_name: string;
    assigned_by_role_id: number;
    created_by: number;
    created_by_name: string;
    created_at: string;
    pdf_path: string | null;
    google_drive_link: string | null;
    youtube_link: string | null;
}

async function checkHomeworkPermission(
    action: 'modify' | 'delete',
    homework: { assigned_by_role_id: number, created_by: number, school_id: number },
    user: { id: string, roleId: number, schoolId: number | null }
): Promise<boolean> {
    const userId = parseInt(user.id);
    const userRole = user.roleId;

    if (homework.assigned_by_role_id === 1) {
        if (userRole === 1) return true;
        return false;
    }

    if (homework.assigned_by_role_id === 2) {
        if (userRole === 2 && user.schoolId === homework.school_id) return true;
        if (userRole === 1) return false;
        return false;
    }

    if (homework.assigned_by_role_id === 4) {
        if (action === 'modify') {
            if (userRole === 4 && userId === homework.created_by) return true;
            if (userRole === 1) return true;
            if (userRole === 2 && user.schoolId === homework.school_id) return true;
        }
        if (action === 'delete') {
            if (userRole === 4) return false;
            if (userRole === 1) return true;
            if (userRole === 2 && user.schoolId === homework.school_id) return true;
        }
        return false;
    }

    return false;
}

export async function getHomework() {
    const session = await auth();
    if (!session?.user) return [];

    const roleId = session.user.roleId;
    const schoolId = session.user.schoolId;

    try {
        let query = `
            SELECT h.*, 
                   s.name as school_name, 
                   c.name as class_name, 
                   sub.name as subject_name,
                   u.name as created_by_name
            FROM homework h
            JOIN schools s ON h.school_id = s.id
            JOIN classes c ON h.class_id = c.id
            JOIN subjects sub ON h.subject_id = sub.id
            JOIN users u ON h.created_by = u.id
            WHERE h.is_active = true
        `;
        const params: any[] = [];

        if (roleId === 1) {
            // SA sees all
        } else if (roleId === 2 && schoolId) {
            query += ` AND h.school_id = ?`;
            params.push(schoolId);
        } else if (roleId === 4 && schoolId) {
            query += ` AND h.school_id = ?`;
            params.push(schoolId);
        } else if ((roleId === 5 || roleId === 6) && schoolId) {
            query += ` AND h.school_id = ?`;
            params.push(schoolId);
        }

        query += ` ORDER BY h.created_at DESC`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as Homework[];
    } catch (error) {
        console.error('Failed to fetch homework:', error);
        return [];
    }
}

export async function createHomework(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const roleId = session.user.roleId;
    const userId = parseInt(session.user.id);
    const userSchoolId = session.user.schoolId;

    if (roleId === 5 || roleId === 6) {
        return { success: false, message: 'Students and Parents cannot create homework.' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let school_id = formData.get('school_id') as string;
    const class_id = formData.get('class_id') as string;
    const subject_id = formData.get('subject_id') as string;
    const google_drive_link = formData.get('google_drive_link') as string;
    const youtube_link = formData.get('youtube_link') as string;

    if (roleId !== 1 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    if (!title || !school_id || !class_id || !subject_id) {
        return { success: false, message: 'Missing required fields.' };
    }

    try {
        await pool.execute(
            `INSERT INTO homework (
                title, description, school_id, class_id, subject_id, 
                assigned_by_role_id, created_by, google_drive_link, youtube_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, parseInt(school_id), parseInt(class_id), parseInt(subject_id), roleId, userId, google_drive_link || null, youtube_link || null]
        );

        revalidatePath('/dashboard/homework');
        return { success: true, message: 'Homework created successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to create homework.' };
    }
}

export async function updateHomework(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM homework WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, message: 'Homework not found.' };
    const homework = rows[0] as any;

    const canModify = await checkHomeworkPermission('modify', homework, session.user);
    if (!canModify) return { success: false, message: 'Permission denied.' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    try {
        await pool.execute(
            'UPDATE homework SET title = ?, description = ? WHERE id = ?',
            [title, description, id]
        );

        revalidatePath('/dashboard/homework');
        return { success: true, message: 'Homework updated successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update homework.' };
    }
}

export async function deleteHomework(id: number) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM homework WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, message: 'Homework not found.' };
    const homework = rows[0] as any;

    const canDelete = await checkHomeworkPermission('delete', homework, session.user);
    if (!canDelete) return { success: false, message: 'Permission denied.' };

    try {
        await pool.execute('UPDATE homework SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/homework');
        return { success: true, message: 'Homework deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete homework.' };
    }
}