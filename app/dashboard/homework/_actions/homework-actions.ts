'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export type Homework = {
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
};

// Permission Check Logic based on User Rules
async function checkHomeworkPermission(
    action: 'modify' | 'delete',
    homework: { assigned_by_role_id: number, created_by: number, school_id: number },
    user: { id: string, roleId: number, schoolId: number | null }
): Promise<boolean> {
    const userId = parseInt(user.id);
    const userRole = user.roleId;

    // Rule 1: Assigned by Super Admin (1)
    if (homework.assigned_by_role_id === 1) {
        // Only SA can modify/delete. SchAdmin, Teacher cannot.
        if (userRole === 1) return true;
        return false;
    }

    // Rule 2: Assigned by School Admin (2)
    if (homework.assigned_by_role_id === 2) {
        // School Admin (of same school) can modify/delete.
        if (userRole === 2 && user.schoolId === homework.school_id) return true;
        // SA cannot interfere.
        if (userRole === 1) return false;
        return false;
    }

    // Rule 3: Assigned by Teacher (4)
    if (homework.assigned_by_role_id === 4) {
        if (action === 'modify') {
            // Teacher (Creator) can modify
            if (userRole === 4 && userId === homework.created_by) return true;
            // SA can modify
            if (userRole === 1) return true;
            // School Admin (same school) can modify
            if (userRole === 2 && user.schoolId === homework.school_id) return true;
        }
        if (action === 'delete') {
            // Teacher CANNOT delete
            if (userRole === 4) return false;
            // SA and School Admin (same school) can delete (Allocating authority to clean up)
            if (userRole === 1) return true;
            if (userRole === 2 && user.schoolId === homework.school_id) return true;
        }
        return false;
    }

    return false; // Default deny
}

import { writeFile } from 'fs/promises';
import { join } from 'path';

export type Homework = {
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
};

// ... checkHomeworkPermission ...

export async function getHomework() {
    const session = await auth();
    if (!session?.user) return [];

    const roleId = session.user.roleId;
    const schoolId = session.user.schoolId;
    const userId = parseInt(session.user.id);

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

        // Filter Logic
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
    const pdfFile = formData.get('pdf_file') as File | null;

    // Auto-scope School
    if (roleId !== 1 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    if (!title || !school_id || !class_id || !subject_id) {
        return { success: false, message: 'Missing required fields.' };
    }

    // Role-Specific Validation (Teacher)
    if (roleId === 4) {
        const [subRows] = await pool.execute<RowDataPacket[]>('SELECT id FROM subjects WHERE id = ? AND teacher_id = ?', [subject_id, userId]);
        if (subRows.length === 0) {
            const [adminRows] = await pool.execute<RowDataPacket[]>('SELECT class_id FROM class_admin_profiles WHERE user_id = ? AND class_id = ?', [userId, class_id]);
            if (subRows.length === 0 && adminRows.length === 0) {
                return { success: false, message: 'You can only assign homework for your assigned subjects or class.' };
            }
        }
    }

    let pdf_path: string | null = null;
    if (pdfFile && pdfFile.size > 0) {
        try {
            const bytes = await pdfFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '_')}`;
            const uploadDir = join(process.cwd(), 'public/uploads/homework');
            // Ensure directory exists (node 10+ handles recursive mkdir, but let's assume it exists or create simple)
            // simplified: assume public/uploads/homework exists or create manually in setup. 
            // Better: create it.
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(join(uploadDir, fileName), buffer);
            pdf_path = `/uploads/homework/${fileName}`;
        } catch (error) {
            console.error('File upload failed:', error);
            return { success: false, message: 'Failed to upload PDF.' };
        }
    }

    try {
        await pool.execute(
            `INSERT INTO homework (
                title, description, school_id, class_id, subject_id, 
                assigned_by_role_id, created_by, pdf_path, google_drive_link, youtube_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, parseInt(school_id), parseInt(class_id), parseInt(subject_id), roleId, userId, pdf_path, google_drive_link || null, youtube_link || null]
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

    // 1. Fetch existing homework to check permissions
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM homework WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, message: 'Homework not found.' };
    const homework = rows[0] as any; // Cast to any or define type

    // 2. Permission Check
    const canModify = await checkHomeworkPermission('modify', homework, session.user);
    if (!canModify) return { success: false, message: 'Permission denied.' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // Usually we don't allow changing School/Class/Subject/Role easily to prevent ownership hijacking, 
    // unless strictly validated. Let's allow Title/Desc updates mainly.
    // If user wants to move it, they should delete and recreate? 
    // Let's just update content for now.

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
