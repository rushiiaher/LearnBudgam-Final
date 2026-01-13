'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';

export type AttendanceRecord = {
    student_id: number;
    student_name: string;
    enrollment_no: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused' | null;
    attendance_id: number | null;
};

export async function getAssignedClass(userId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT class_id FROM class_admin_profiles WHERE user_id = ?`,
            [userId]
        );
        return rows[0]?.class_id as number | undefined;
    } catch (error) {
        return undefined;
    }
}

export async function getAttendance(schoolId: number, classId: number, date: string) {
    try {
        // Left Join users (students) with attendance table for the specific date
        const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        u.id as student_id, 
        u.name as student_name, 
        p.enrollment_no,
        a.status,
        a.id as attendance_id
      FROM users u
      JOIN student_profiles p ON u.id = p.user_id
      LEFT JOIN attendance a ON u.id = a.student_id AND a.date = ?
      WHERE u.role_id = 5 
        AND u.school_id = ? 
        AND p.class_id = ?
        AND u.is_active = true
      ORDER BY u.name ASC
    `, [date, schoolId, classId]);

        return rows as AttendanceRecord[];
    } catch (error) {
        console.error('Failed to fetch attendance:', error);
        return [];
    }
}

export async function saveAttendance(data: {
    schoolId: number,
    classId: number,
    date: string,
    updates: { studentId: number, status: string }[]
}) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Use REPLACE INTO or INSERT ON DUPLICATE KEY UPDATE to handle both insert and update
        for (const record of data.updates) {
            await connection.execute(`
            INSERT INTO attendance (student_id, class_id, school_id, date, status)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `, [record.studentId, data.classId, data.schoolId, data.date, record.status]);
        }

        await connection.commit();
        revalidatePath('/dashboard/attendance'); // Revalidate if needed
        return { success: true, message: 'Attendance saved successfully.' };
    } catch (error) {
        await connection.rollback();
        console.error('Failed to save attendance:', error);
        return { success: false, message: 'Failed to save attendance.' };
    } finally {
        connection.release();
    }
}

export async function getStudentAttendanceHistory(studentId: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                a.date,
                a.status,
                u.name as student_name
            FROM attendance a
            JOIN users u ON a.student_id = u.id
            WHERE a.student_id = ?
            ORDER BY a.date DESC
            LIMIT 100
        `, [studentId]);

        return rows as { date: string, status: string, student_name: string }[];
    } catch (error) {
        console.error('Failed to fetch student attendance history:', error);
        return [];
    }
}
