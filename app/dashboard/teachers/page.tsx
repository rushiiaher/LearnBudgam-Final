import { auth } from '@/auth';
import { getSchoolTeachers, getSchoolAdmins } from '../school-admin/_actions/school-admin-actions';
import { getTeachers } from './_actions/teacher-actions';
import { redirect } from 'next/navigation';
import { AddTeacherDialog } from './_components/teacher-dialog';
import { getSchools } from '../schools/_actions/school-actions';
import { TeacherActionsCell } from './_components/teacher-actions-cell';

export default async function TeachersPage() {
    const session = await auth();

    const rawRoleId = session?.user?.roleId || session?.user?.role?.id;
    const userRoleId = Number(rawRoleId);

    if (!session?.user || (userRoleId !== 2 && userRoleId !== 1)) {
        redirect('/dashboard');
    }

    const roleId = userRoleId;
    const isSuperAdmin = roleId === 1;
    const schoolId = session.user.schoolId ? Number(session.user.schoolId) : null;

    if (!isSuperAdmin && !schoolId) {
        return <div className="p-4 md:p-6">Error: You are not assigned to a school.</div>;
    }

    let teachers: any[] = [];
    let schools: any[] = [];

    if (isSuperAdmin) {
        teachers = await getTeachers();
        schools = await getSchools();
    } else if (schoolId) {
        teachers = await getSchoolTeachers(schoolId);
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
                <h1 className="text-xl md:text-2xl font-bold">Teachers</h1>
                {isSuperAdmin && (
                    <AddTeacherDialog
                        schools={schools}
                        userRole={roleId}
                    />
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                {isSuperAdmin && (
                                    <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        School
                                    </th>
                                )}
                                <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={isSuperAdmin ? 5 : 4} className="px-3 md:px-6 py-4 text-center text-sm text-gray-500">
                                        No teachers found.
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher: any) => (
                                    <tr key={teacher.id}>
                                        <td className="px-3 md:px-6 py-4 text-sm font-medium text-gray-900">
                                            <div className="truncate max-w-[120px] sm:max-w-none">
                                                {teacher.name}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-6 py-4 text-sm text-gray-500">
                                            <div className="truncate max-w-[150px] sm:max-w-none">
                                                {teacher.email}
                                            </div>
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {teacher.school_name || '-'}
                                            </td>
                                        )}
                                        <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(teacher.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {isSuperAdmin && (
                                                <TeacherActionsCell
                                                    teacher={teacher}
                                                    schools={schools}
                                                    userRole={roleId}
                                                    userSchoolId={schoolId || undefined}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
