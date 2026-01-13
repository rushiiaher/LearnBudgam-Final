'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export type Subject = {
    id: number;
    name: string;
    class_id: number | null; // Added
    class_name: string | null; // Added
    teacher_id: number | null;
    teacher_name: string | null;
    created_at: string;
    assigned_schools: string | null;
    school_name: string | null; // Added for type safety
    school_id: number | null;
};

export async function getSubjects() {
    const session = await auth();
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : (session?.user?.role?.id ? Number(session.user.role.id) : 0);
    const schoolId = session?.user?.schoolId;

    try {
        let query = `
            SELECT s.*,
                   sch.name as school_name,
                   c.name as class_name,
                   u.name as teacher_name
            FROM subjects s
            LEFT JOIN schools sch ON s.school_id = sch.id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN users u ON s.teacher_id = u.id
            WHERE s.is_active = true
        `;
        const params: any[] = [];

        if (roleId === 2 && schoolId) {
            query += ` AND s.school_id = ?`;
            params.push(schoolId);
            query += ` ORDER BY s.created_at DESC`;
        } else if (roleId === 1) {
            // Super Admin: Only show Global Subjects (Master Templates)
            query = `
                SELECT 
                    gs.*,
                    NULL as school_name,
                    c.name as class_name,
                    u.name as teacher_name,
                    (
                        SELECT GROUP_CONCAT(DISTINCT sch.name SEPARATOR ', ')
                        FROM subjects ss
                        JOIN schools sch ON ss.school_id = sch.id
                        WHERE ss.name = gs.name 
                        AND ss.school_id IS NOT NULL 
                        AND ss.is_active = true
                        AND sch.is_active = true
                        AND ss.class_id IN (
                            SELECT id FROM classes WHERE name = c.name
                        )
                    ) as assigned_schools
                FROM subjects gs
                LEFT JOIN classes c ON gs.class_id = c.id
                LEFT JOIN users u ON gs.teacher_id = u.id
                WHERE gs.school_id IS NULL
                AND gs.is_active = true
                ORDER BY gs.created_at DESC
             `;
        } else {
            // Default fallback
            query += ` ORDER BY s.created_at DESC`;
        }

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);

        // Transform the rows to ensure teacher_id, etc. are numbers
        const subjects: Subject[] = rows.map((row: any) => ({
            ...row,
            class_id: row.class_id,
            teacher_id: row.teacher_id,
            school_id: row.school_id
        }));

        return subjects;
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
        return [];
    }
}

export async function getSubjectsBySchool(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT s.id, s.name, c.name as class_name, s.class_id
            FROM subjects s
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.school_id = ? AND s.is_active = true
            ORDER BY c.name, s.name
        `, [schoolId]);
        return rows as { id: number, name: string, class_id: number, class_name: string }[];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function createSubject(formData: FormData) {
    const session = await auth(); // Added
    const roleId = session?.user?.roleId; // Added
    const userSchoolId = session?.user?.schoolId; // Added

    const name = formData.get('name') as string;
    // Use form school_id if Super Admin, else use session school_id
    let school_id = formData.get('school_id') as string;
    const class_id = formData.get('class_id') as string;
    const teacher_id = formData.get('teacher_id') as string; // Added

    if (roleId === 2 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    if (!name || (!school_id && !class_id)) {
        // Must have Name. Must have School OR Class (if Class is Global, School can be null)
        // But wait, if we are creating a Global Subject, we need a Global Class.
        // If we are creating a School Subject directly, we need School.
        return { success: false, message: 'Name and School/Class are required.' };
    }

    try {
        await pool.execute(
            'INSERT INTO subjects (name, school_id, class_id, teacher_id) VALUES (?, ?, ?, ?)',
            [name, school_id ? parseInt(school_id) : null, class_id ? parseInt(class_id) : null, teacher_id ? parseInt(teacher_id) : null]
        );
        revalidatePath('/dashboard/subjects');
        return { success: true, message: 'Subject created successfully.' };
    } catch (error) {
        console.error('Failed to create subject:', error);
        return { success: false, message: 'Failed to create subject.' };
    }
}

export async function updateSubject(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const school_id = formData.get('school_id') as string;
    const class_id = formData.get('class_id') as string;
    const teacher_id = formData.get('teacher_id') as string; // Added

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check if this is a Global Subject and if name changed
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT name, school_id, class_id FROM subjects WHERE id = ?', [id]);
        if (rows.length === 0) throw new Error("Subject not found");

        const oldSubject = rows[0];
        const oldName = oldSubject.name;
        const isGlobal = oldSubject.school_id === null;

        // 2. Perform the update
        await connection.execute(
            'UPDATE subjects SET name = ?, school_id = ?, class_id = ?, teacher_id = ? WHERE id = ?',
            [name, school_id ? parseInt(school_id) : null, class_id ? parseInt(class_id) : null, teacher_id ? parseInt(teacher_id) : null, id]
        );

        // 3. If Global and Name Changed, propagate to school copies
        if (isGlobal && name !== oldName) {
            console.log(`Propagating rename from '${oldName}' to '${name}' for Global Subject ID ${id}`);

            // Get Global Class Name to match school classes
            const [classRows] = await connection.execute<RowDataPacket[]>('SELECT name FROM classes WHERE id = ?', [oldSubject.class_id]);
            if (classRows.length > 0) {
                const globalClassName = classRows[0].name;

                // Update all school subjects that have the OLD name and belong to a class with the SAME NAME as the global class
                await connection.execute(`
                    UPDATE subjects s
                    JOIN classes c ON s.class_id = c.id
                    SET s.name = ?
                    WHERE s.name = ? 
                    AND s.school_id IS NOT NULL 
                    AND c.name = ?
                `, [name, oldName, globalClassName]);
            }
        }

        await connection.commit();
        revalidatePath('/dashboard/subjects');
        return { success: true, message: 'Subject updated successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error('Failed to update subject:', error);
        return { success: false, message: 'Failed to update subject.' };
    } finally {
        connection.release();
    }
}

export async function deleteSubject(id: number) {
    try {
        await pool.execute('UPDATE subjects SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/subjects');
        return { success: true, message: 'Subject deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete subject:', error);
        return { success: false, message: 'Failed to delete subject.' };
    }
}
