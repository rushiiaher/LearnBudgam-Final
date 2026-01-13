import { getStudents } from './_actions/student-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { StudentTable } from './_components/student-table';
import { AddStudentDialog } from './_components/student-dialog';
import { auth } from '@/auth';

export default async function ManageStudentsPage() {
    const session = await auth();
    const roleId = session?.user?.roleId ? Number(session.user.roleId) : 0;
    const schoolId = session?.user?.schoolId ? Number(session.user.schoolId) : undefined;

    const [students, schools] = await Promise.all([
        getStudents(),
        getSchools()
    ]);

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Manage Students</h1>
                <AddStudentDialog
                    schools={schools}
                    userRole={roleId}
                    userSchoolId={schoolId}
                />
            </div>

            <div className="overflow-x-auto">
                <StudentTable students={students} schools={schools} />
            </div>
        </div>
    );
}
