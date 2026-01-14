'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export type ClassItem = {
    id: number;
    name: string;
    section: string | null;
    school_id: number;
    school_name: string;

    created_at: string;
    assigned_schools: string | null; // Added field
    subjects_list: string | null;
};

// Helper for UI to fetch classes by school
export async function getClassesBySchool(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name FROM classes WHERE school_id = ? AND is_active = true',
            [schoolId]
        );
        return rows as { id: number, name: string }[];
    } catch (error) {
        console.error("Error fetching classes by school:", error);
        return [];
    }
}

// Helper to fetch Global Classes (Templates)
export async function getGlobalClasses() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name FROM classes WHERE school_id IS NULL AND is_active = true'
        );
        return rows as { id: number, name: string }[];
    } catch (error) {
        console.error("Error fetching global classes:", error);
        return [];
    }
}

// Fetch Global Classes NOT yet assigned to a specific school (by name match)
export async function getUnassignedGlobalClasses(schoolId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT gc.id, gc.name 
            FROM classes gc
            WHERE gc.school_id IS NULL 
            AND gc.is_active = true 
            AND gc.name NOT IN (
                SELECT name FROM classes WHERE school_id = ? AND is_active = true
            )
        `, [schoolId]);
        return rows as { id: number, name: string }[];
    } catch (error) {
        console.error("Error fetching unassigned global classes:", error);
        return [];
    }
}

export async function getClasses() {
    const session = await auth();
    console.log('getClasses - Session User:', session?.user); // Debug log
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : (session?.user?.role?.id ? Number(session.user.role.id) : 0);
    console.log('getClasses - Role ID:', roleId); // Debug log
    const schoolId = session?.user?.schoolId;

    try {
        let query = `
            SELECT c.*, s.name as school_name,
                   (
                       SELECT GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ')
                       FROM subjects sub
                       WHERE sub.class_id = c.id AND sub.is_active = true
                   ) as subjects_list
            FROM classes c 
            LEFT JOIN schools s ON c.school_id = s.id
            WHERE c.is_active = true
        `;
        const params: any[] = [];

        if (roleId === 2 && schoolId) {
            // School Admin: Only show their own classes
            query += ` AND c.school_id = ?`;
            params.push(schoolId);
        } else if (roleId === 1) {
            // Super Admin: Only show Global Classes (Master Templates)
            // And aggregate which schools have a class with the same name
            query = `
                SELECT 
                    gc.*, 
                    NULL as school_name,
                    (
                        SELECT GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ')
                        FROM classes sc
                        JOIN schools s ON sc.school_id = s.id
                        WHERE sc.name = gc.name 
                        AND sc.school_id IS NOT NULL 
                        AND sc.is_active = true
                        AND s.is_active = true
                    ) as assigned_schools,
                    (
                       SELECT GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ')
                       FROM subjects sub
                       WHERE sub.class_id = gc.id AND sub.is_active = true
                    ) as subjects_list
                FROM classes gc
                WHERE gc.school_id IS NULL 
                AND gc.is_active = true
            `;
        }

        if (roleId !== 1) {
            query += ` ORDER BY c.created_at DESC`;
        } else {
            query += ` ORDER BY gc.created_at DESC`;
        }

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        console.log(`getClasses: Found ${rows.length} classes`);
        return rows as ClassItem[];
    } catch (error) {
        console.error('Failed to fetch classes:', error);
        return [];
    }
}

export async function createClass(formData: FormData) {
    const session = await auth();
    // Robust role extraction: handle roleId (top-level) or role.id (nested object)
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : (session?.user?.role?.id ? Number(session.user.role.id) : 0);
    const userSchoolId = session?.user?.schoolId;

    console.log(`createClass: User Role ID: ${roleId}, School ID: ${userSchoolId}`); // Debug log

    const name = formData.get('name') as string;
    // Use form school_id if Super Admin, else use session school_id
    let school_id = formData.get('school_id') as string;

    if (roleId === 2 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    // Allow creation of Global Classes (school_id is null) for Super Admin
    const isGlobal = !school_id || school_id === '';

    if (isGlobal && roleId !== 1) {
        return { success: false, message: 'School is required.' };
    }

    try {
        if (isGlobal) {
            await pool.execute(
                'INSERT INTO classes (name, school_id) VALUES (?, NULL)',
                [name]
            );
        } else {
            await pool.execute(
                'INSERT INTO classes (name, school_id) VALUES (?, ?)',
                [name, parseInt(school_id)]
            );
        }
        console.log(`createClass: Successfully created class ${name} (Global: ${isGlobal})`);
        revalidatePath('/dashboard/classes');
        return { success: true, message: 'Class created successfully.' };
    } catch (error) {
        console.error('Failed to create class:', error);
        return { success: false, message: 'Failed to create class.' };
    }
}

export async function updateClass(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const school_id = formData.get('school_id') as string;
    const isGlobal = !school_id || school_id === '' || school_id === 'global';

    try {
        if (isGlobal) {
            await pool.execute(
                'UPDATE classes SET name = ?, school_id = NULL WHERE id = ?',
                [name, id]
            );
        } else {
            await pool.execute(
                'UPDATE classes SET name = ?, school_id = ? WHERE id = ?',
                [name, parseInt(school_id), id]
            );
        }
        revalidatePath('/dashboard/classes');
        return { success: true, message: 'Class updated successfully.' };
    } catch (error) {
        console.error('Failed to update class:', error);
        return { success: false, message: 'Failed to update class.' };
    }
}

export async function deleteClass(id: number) {
    try {
        await pool.execute('UPDATE classes SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/classes');
        return { success: true, message: 'Class deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete class:', error);
        return { success: false, message: 'Failed to delete class.' };
    }
}

// Assign a Global Class to a School (Deep Copy)
export async function assignClassToSchool(schoolId: number, globalClassId: number) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get Global Class Details
        const [classRows] = await connection.execute<RowDataPacket[]>(
            'SELECT name FROM classes WHERE id = ? AND school_id IS NULL',
            [globalClassId]
        );
        if (classRows.length === 0) throw new Error("Global Class not found");
        const className = classRows[0].name;

        // 2. Check if class already exists for this school name
        // (Optional: we might allow duplicates, but let's avoid exact name dupes for sanity)
        const [existing] = await connection.execute<RowDataPacket[]>(
            'SELECT id FROM classes WHERE name = ? AND school_id = ? AND is_active = true',
            [className, schoolId]
        );

        let newClassId;
        if (existing.length > 0) {
            // Already exists, reuse it? Or error? Let's reuse it to be idempotent-ish
            newClassId = existing[0].id;
        } else {
            // Create new class for school
            const [res] = await connection.execute<any>( // Use any for ResultSetHeader typing
                'INSERT INTO classes (name, school_id) VALUES (?, ?)',
                [className, schoolId]
            );
            newClassId = res.insertId;
        }

        // 3. Get Global Subjects linked to Global Class
        const [globalSubjects] = await connection.execute<RowDataPacket[]>(
            'SELECT name FROM subjects WHERE class_id = ? AND school_id IS NULL AND is_active = true',
            [globalClassId]
        );

        // 4. Create Subjects for the new School Class
        for (const subj of globalSubjects) {
            // Check if subject already exists for this school class
            const [existSubj] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM subjects WHERE name = ? AND class_id = ? AND school_id = ? AND is_active = true',
                [subj.name, newClassId, schoolId]
            );

            if (existSubj.length === 0) {
                await connection.execute(
                    'INSERT INTO subjects (name, school_id, class_id) VALUES (?, ?, ?)',
                    [subj.name, schoolId, newClassId]
                );
            }
        }

        await connection.commit();
        return { success: true, message: 'Class and subjects assigned successfully.' };
    } catch (error: any) {
        await connection.rollback();
        console.error('Failed to assign class:', error);
        return { success: false, message: error.message || 'Failed to assign class.' };
    } finally {
        connection.release();
    }
}
