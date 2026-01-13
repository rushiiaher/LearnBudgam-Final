'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';

export type TimetableEntry = {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    school_name: string;
    class_name: string;
    subject_name: string;
    teacher_name: string;
    school_id: number;
    class_id: number;
    subject_id: number;
    teacher_id: number;
};

export async function getTimetable() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT t.*, s.name as school_name, c.name as class_name, sub.name as subject_name, u.name as teacher_name
      FROM timetable t
      JOIN schools s ON t.school_id = s.id
      JOIN classes c ON t.class_id = c.id
      JOIN subjects sub ON t.subject_id = sub.id
      LEFT JOIN users u ON t.teacher_id = u.id
      WHERE t.is_active = true
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
    `);
        return rows as TimetableEntry[];
    } catch (error) {
        console.error('Failed to fetch timetable:', error);
        return [];
    }
}

export async function createTimetableEntry(formData: FormData) {
    const school_id = formData.get('school_id') as string;
    const class_id = formData.get('class_id') as string;
    const subject_id = formData.get('subject_id') as string;
    const teacher_id = formData.get('teacher_id') as string;
    const day_of_week = formData.get('day_of_week') as string;
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;

    if (!school_id || !class_id || !subject_id || !day_of_week || !start_time || !end_time) {
        return { success: false, message: 'Missing required fields.' };
    }

    try {
        await pool.execute(
            'INSERT INTO timetable (school_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [parseInt(school_id), parseInt(class_id), parseInt(subject_id), teacher_id ? parseInt(teacher_id) : null, day_of_week, start_time, end_time]
        );
        revalidatePath('/dashboard/timetable');
        return { success: true, message: 'Timetable entry created successfully.' };
    } catch (error) {
        console.error('Failed to create timetable entry:', error);
        return { success: false, message: 'Failed to create timetable entry.' };
    }
}

export async function deleteTimetableEntry(id: number) {
    try {
        await pool.execute('UPDATE timetable SET is_active = false, deleted_at = NOW() WHERE id = ?', [id]);
        revalidatePath('/dashboard/timetable');
        return { success: true, message: 'Timetable entry deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete timetable entry:', error);
        return { success: false, message: 'Failed to delete timetable entry.' };
    }
}
