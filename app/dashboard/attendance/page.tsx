import { getSchools } from '../schools/_actions/school-actions';
import { AttendanceSheet } from './_components/attendance-sheet';
import { auth } from '@/auth';
import { getAssignedClass } from './_actions/attendance-actions';

export default async function AttendancePage() {
    const session = await auth();
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : 0;
    const userSchoolId = session?.user?.schoolId ? Number(session.user.schoolId) : undefined;
    const userId = session?.user?.id ? Number(session.user.id) : 0;

    const [schools, assignedClassId] = await Promise.all([
        getSchools(),
        getAssignedClass(userId)
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
            </div>

            <AttendanceSheet
                schools={schools}
                userRole={roleId}
                userSchoolId={userSchoolId}
                assignedClassId={assignedClassId}
                userId={userId}
            />
        </div>
    );
}
