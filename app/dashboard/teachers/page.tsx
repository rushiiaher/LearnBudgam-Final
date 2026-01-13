import { auth } from '@/auth';
import { getSchoolTeachers, getSchoolAdmins } from '../school-admin/_actions/school-admin-actions'; // getSchoolAdmins is not what we want, we want getTeachers from teacher-actions
import { getTeachers } from './_actions/teacher-actions';
import { redirect } from 'next/navigation';
import { AddTeacherDialog } from './_components/teacher-dialog';
import { getSchools } from '../schools/_actions/school-actions';
import { TeacherActionsCell } from './_components/teacher-actions-cell';

export default async function TeachersPage() {
    const session = await auth();

    // Fallback to role.id if roleId is missing (which seems to be the case for Super Admin)
    const rawRoleId = session?.user?.roleId || session?.user?.role?.id;
    const userRoleId = Number(rawRoleId);

    if (!session?.user || (userRoleId !== 2 && userRoleId !== 1)) {
        redirect('/dashboard');
    }

    const roleId = userRoleId;
    const isSuperAdmin = roleId === 1;
    const schoolId = session.user.schoolId ? Number(session.user.schoolId) : null;

    if (!isSuperAdmin && !schoolId) {
        return <div className="p-6">Error: You are not assigned to a school.</div>;
    }

    let teachers: any[] = [];
    let schools: any[] = [];

    if (isSuperAdmin) {
        // Fetch ALL teachers
        teachers = await getTeachers();
        // Fetch ALL schools for the Add Dialog
        schools = await getSchools();
    } else if (schoolId) {
        // Fetch ONLY my school's teachers
        teachers = await getSchoolTeachers(schoolId);
        // School list is just my school (or empty if component handles it)
        // But AddTeacherDialog expects array of Schools.
        // We can fetch just my school details or pass empty if we trust the dialog logic for School Admin (it uses hidden input)
        // Let's be safe and pass partial school info if needed, but the Dialog handles !isSchoolAdmin check for the dropdown.
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Teachers</h1>
                {isSuperAdmin && (
                    <AddTeacherDialog
                        schools={schools}
                        userRole={roleId}
                    />
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            {isSuperAdmin && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    School
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No teachers found.
                                </td>
                            </tr>
                        ) : (
                            teachers.map((teacher: any) => (
                                <tr key={teacher.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {teacher.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {teacher.email}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.school_name || '-'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(teacher.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
    );
}
