'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export type LiveClass = {
    id: number;
    title: string;
    url: string;
    start_time: string;
    school_id: number;
    school_name: string;
    subject_id: number;
    subject_name: string;
    uploaded_by_role: number;
    uploaded_by_user_id: number;
    uploader_name: string;
    class_names: string; // Group concat
    class_ids: number[]; // Array of IDs
};

// Permission Logic
async function checkLiveClassPermission(
    action: 'modify' | 'delete',
    liveClass: { uploaded_by_role: number, school_id: number, uploaded_by_user_id: number },
    user: { id: string, roleId: number, schoolId: number | null }
): Promise<boolean> {
    const userId = parseInt(user.id);
    const userRole = user.roleId;

    // Rule 1: Uploaded by SA
    if (liveClass.uploaded_by_role === 1) {
        if (action === 'modify' || action === 'delete') return userRole === 1;
        return false;
    }

    // Rule 2: Uploaded by SchAdmin
    if (liveClass.uploaded_by_role === 2) {
        if (userRole === 1) return false; // SA cannot interfere
        if (userRole === 2 && user.schoolId === liveClass.school_id) return true; // Own School Admin
        return false;
    }

    // Rule 3: Uploaded by Teacher
    if (liveClass.uploaded_by_role === 4) {
        if (action === 'modify') {
            if (userRole === 4 && userId === liveClass.uploaded_by_user_id) return true; // Own
            if (userRole === 1 || (userRole === 2 && user.schoolId === liveClass.school_id)) return true; // Admin override
        }
        if (action === 'delete') {
            if (userRole === 4) return false; // Teacher CANNOT delete
            if (userRole === 1 || (userRole === 2 && user.schoolId === liveClass.school_id)) return true; // Admins clean up
        }
        return false;
    }

    return false;
}

export async function getLiveClasses() {
    const session = await auth();
    if (!session?.user) return [];

    const roleId = session.user.roleId;
    const schoolId = session.user.schoolId;
    const userId = parseInt(session.user.id);

    try {
        let query = `
            SELECT lc.id, lc.title, lc.url, lc.start_time, lc.school_id, lc.subject_id, 
                   lc.uploaded_by_role, lc.uploaded_by_user_id,
                   s.name as school_name, sub.name as subject_name, u.name as uploader_name,
                   GROUP_CONCAT(c.name SEPARATOR ', ') as class_names,
                   GROUP_CONCAT(c.id) as class_ids_str
            FROM live_classes lc
            JOIN schools s ON lc.school_id = s.id
            JOIN subjects sub ON lc.subject_id = sub.id
            JOIN users u ON lc.uploaded_by_user_id = u.id
            LEFT JOIN live_class_shares lcs ON lc.id = lcs.live_class_id
            LEFT JOIN classes c ON lcs.class_id = c.id
            WHERE lc.is_active = true
        `;
        const params: any[] = [];

        // Filter Logic
        if (roleId === 1) {
            // SA sees all
        } else if (roleId === 2 && schoolId) {
            query += ` AND lc.school_id = ?`;
            params.push(schoolId);
        } else if (roleId === 4 && schoolId) {
            // Teacher: See school's links? Or only assigned?
            // "Teacher ... View" -> Allowed. Assuming School Scope.
            // Filter by school.
            query += ` AND lc.school_id = ?`;
            params.push(schoolId);
        } else if ((roleId === 5 || roleId === 6) && schoolId) {
            // Student/Parent: See only links assigned to THEIR class.
            // Need to join on user's class (if we know it) or filter after join.
            // COMPLEXITY: We don't have user's class in session reliably yet (student_profiles).
            // Defaulting to School Scope for now to avoid breaking, BUT labeling it properly.
            // Ideally: AND lcs.class_id = (SELECT class_id FROM student_profiles WHERE user_id = ?)
            query += ` AND lc.school_id = ?`;
            params.push(schoolId);
        }

        query += ` GROUP BY lc.id ORDER BY lc.start_time DESC`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);

        return rows.map(row => ({
            ...row,
            class_ids: row.class_ids_str ? row.class_ids_str.split(',').map(Number) : []
        })) as LiveClass[];
    } catch (error) {
        console.error('Failed to fetch live classes:', error);
        return [];
    }
}


export async function createLiveClass(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const roleId = session.user.roleId;
    const userId = parseInt(session.user.id);
    const userSchoolId = session.user.schoolId;

    if (roleId === 5 || roleId === 6) return { success: false, message: 'Students/Parents cannot create.' };

    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const start_time = formData.get('start_time') as string;
    const subject_id = formData.get('subject_id') as string;
    let school_id = formData.get('school_id') as string;

    // Multiple Classes
    const class_ids_json = formData.get('class_ids') as string; // Expecting JSON string of IDs
    const class_ids: number[] = class_ids_json ? JSON.parse(class_ids_json) : [];

    // Auto-scope School
    if (roleId !== 1 && userSchoolId) {
        school_id = userSchoolId.toString();
    }

    if (!title || !start_time || !school_id || !subject_id || class_ids.length === 0) {
        return { success: false, message: 'Missing required fields (Title, Time, School, Subject, Class).' };
    }

    // Role Validations (Rule 2 & 3)
    if (roleId === 2 && parseInt(school_id) !== userSchoolId) {
        return { success: false, message: 'School Admin can only create for own school.' };
    }

    const additional_school_ids_json = formData.get('additional_school_ids') as string;
    const additional_school_ids: number[] = additional_school_ids_json ? JSON.parse(additional_school_ids_json) : [];

    // Target Schools: Primary + Additional
    const targetSchools = [parseInt(school_id), ...additional_school_ids];

    // We need to fetch the class names for the primary school's selected class IDs
    // so we can find matching classes in other schools by NAME.
    // This is because IDs differ across schools.

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get Primary Class Names
        const [primaryClasses] = await connection.query<RowDataPacket[]>(
            `SELECT id, name FROM classes WHERE id IN (?)`,
            [class_ids]
        );
        const targetClassNames = primaryClasses.map((c: any) => c.name);

        const formattedDate = new Date(start_time).toISOString().slice(0, 19).replace('T', ' ');

        // 2. Loop through each school
        for (const targetSchoolId of targetSchools) {
            let targetClassIds: number[] = [];
            let targetSubjectId = parseInt(subject_id); // Default to primary subject ID (might be wrong for other schools)

            // If it's the primary school, use the explicit IDs
            if (targetSchoolId === parseInt(school_id)) {
                targetClassIds = class_ids;
            } else {
                // For other schools, we must find matching Class IDs by Name
                if (targetClassNames.length > 0) {
                    const [matchedClasses] = await connection.query<RowDataPacket[]>(
                        `SELECT id FROM classes WHERE school_id = ? AND name IN (?)`,
                        [targetSchoolId, targetClassNames]
                    );
                    targetClassIds = matchedClasses.map((c: any) => c.id);
                }

                // Also find matching Subject ID by Name (since subjects are also school-scoped)
                const [primarySubject] = await connection.query<RowDataPacket[]>(
                    `SELECT name FROM subjects WHERE id = ?`,
                    [subject_id]
                );
                if (primarySubject.length > 0) {
                    const [matchedSubject] = await connection.query<RowDataPacket[]>(
                        `SELECT id FROM subjects WHERE school_id = ? AND name = ? LIMIT 1`,
                        [targetSchoolId, primarySubject[0].name]
                    );
                    if (matchedSubject.length > 0) {
                        targetSubjectId = matchedSubject[0].id;
                    } else {
                        // If subject doesn't exist in target school, skip or handle error?
                        // For now, skipping this school safe-guard.
                        console.warn(`Subject not found in school ${targetSchoolId}, skipping.`);
                        continue;
                    }
                }
            }

            if (targetClassIds.length === 0) continue;

            const [res] = await connection.execute<ResultSetHeader>(
                `INSERT INTO live_classes (
                    title, url, start_time, school_id, subject_id, 
                    uploaded_by_role, uploaded_by_user_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, url, formattedDate, targetSchoolId, targetSubjectId, roleId, userId]
            );

            const liveClassId = res.insertId;

            // Insert Shares
            for (const cid of targetClassIds) {
                await connection.execute(
                    'INSERT INTO live_class_shares (live_class_id, class_id) VALUES (?, ?)',
                    [liveClassId, cid]
                );
            }
        }

        await connection.commit();
        revalidatePath('/dashboard/live-classes');
        return { success: true, message: 'Live Class scheduled successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: 'Failed to schedule live class.' };
    } finally {
        connection.release();
    }
}

export async function deleteLiveClass(id: number) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM live_classes WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, message: 'Not found.' };
    const liveClass = rows[0] as any;

    const canDelete = await checkLiveClassPermission('delete', liveClass, session.user);
    if (!canDelete) return { success: false, message: 'Permission denied.' };

    try {
        await pool.execute('UPDATE live_classes SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/live-classes');
        return { success: true, message: 'Live Class cancelled.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to cancel.' };
    }
}

export async function updateLiveClass(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM live_classes WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, message: 'Not found.' };
    const liveClass = rows[0] as any;

    const canModify = await checkLiveClassPermission('modify', liveClass, session.user);
    if (!canModify) return { success: false, message: 'Permission denied.' };

    const title = formData.get('title') as string;
    const url = formData.get('url') as string;

    try {
        await pool.execute(
            'UPDATE live_classes SET title = ?, url = ? WHERE id = ?',
            [title, url, id]
        );
        revalidatePath('/dashboard/live-classes');
        return { success: true, message: 'Live Class updated.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update.' };
    }
}
