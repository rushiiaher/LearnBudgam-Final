import { getClassAdmins } from './_actions/class-admin-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { ClassAdminTable } from './_components/class-admin-table';
import { AddClassAdminDialog } from './_components/class-admin-dialog';
import { auth } from '@/auth';

export default async function ManageClassAdminsPage() {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const userSchoolId = session?.user?.schoolId;

    const [classAdmins, schools] = await Promise.all([
        getClassAdmins(),
        getSchools()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Manage Class Admins</h1>
                <AddClassAdminDialog
                    schools={schools}
                    userRole={Number(roleId)}
                    userSchoolId={Number(userSchoolId)}
                />
            </div>

            <ClassAdminTable
                admins={classAdmins}
                schools={schools}
                userRole={Number(roleId)}
                userSchoolId={Number(userSchoolId)}
            />
        </div>
    );
}
