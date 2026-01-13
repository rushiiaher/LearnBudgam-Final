import { getSchoolAdmins } from './_actions/school-admin-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { SchoolAdminTable } from './_components/school-admin-table';
import { AddSchoolAdminDialog } from './_components/school-admin-dialog';

export default async function ManageSchoolAdminsPage() {
    const [admins, schools] = await Promise.all([
        getSchoolAdmins(),
        getSchools()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Manage School Admins</h1>
                <AddSchoolAdminDialog schools={schools} />
            </div>

            <SchoolAdminTable admins={admins} schools={schools} />
        </div>
    );
}
