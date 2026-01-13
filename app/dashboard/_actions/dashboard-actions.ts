'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function getDashboardStats(userRoleId: number, schoolId?: number) {
    try {
        let stats = {
            totalStudents: 0,
            totalTeachers: 0,
            totalSchools: 0,
            totalClasses: 0,
            attendanceRate: 0,
            activeHomework: 0
        };

        if (userRoleId === 1) { // Super Admin
            const [studentsResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users WHERE role_id = 5 AND is_active = 1'
            );
            const [teachersResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users WHERE role_id = 4 AND is_active = 1'
            );
            const [schoolsResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM schools WHERE is_active = 1'
            );
            const [classesResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM classes WHERE is_active = 1'
            );

            stats.totalStudents = studentsResult[0]?.count || 0;
            stats.totalTeachers = teachersResult[0]?.count || 0;
            stats.totalSchools = schoolsResult[0]?.count || 0;
            stats.totalClasses = classesResult[0]?.count || 0;

        } else if (userRoleId === 2 && schoolId) { // School Admin
            const [studentsResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users WHERE role_id = 5 AND school_id = ? AND is_active = 1',
                [schoolId]
            );
            const [teachersResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users WHERE role_id = 4 AND school_id = ? AND is_active = 1',
                [schoolId]
            );
            const [classesResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM classes WHERE school_id = ? AND is_active = 1',
                [schoolId]
            );

            stats.totalStudents = studentsResult[0]?.count || 0;
            stats.totalTeachers = teachersResult[0]?.count || 0;
            stats.totalClasses = classesResult[0]?.count || 0;
            stats.totalSchools = 1;

        } else if (userRoleId === 4 && schoolId) { // Teacher
            const [studentsResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users WHERE role_id = 5 AND school_id = ? AND is_active = 1',
                [schoolId]
            );
            const [classesResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM classes WHERE school_id = ? AND is_active = 1',
                [schoolId]
            );

            stats.totalStudents = studentsResult[0]?.count || 0;
            stats.totalClasses = classesResult[0]?.count || 0;

        } else if (userRoleId === 5 && schoolId) { // Student
            const [classResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM classes WHERE school_id = ?',
                [schoolId]
            );
            
            stats.totalClasses = classResult[0]?.count || 0;
        }

        if (schoolId) {
            const [homeworkResult] = await pool.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM homework WHERE school_id = ? AND is_active = 1',
                [schoolId]
            );
            stats.activeHomework = homeworkResult[0]?.count || 0;
        }

        return stats;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalStudents: 0,
            totalTeachers: 0,
            totalSchools: 0,
            totalClasses: 0,
            attendanceRate: 0,
            activeHomework: 0
        };
    }
}