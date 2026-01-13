import { getClasses } from './_actions/class-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { ClassTable } from './_components/class-table';
import { AddClassDialog } from './_components/class-dialog';
import { auth } from '@/auth';

export default async function ManageClassesPage() {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const userSchoolId = session?.user?.schoolId;

    const [classes, schools] = await Promise.all([
        getClasses(),
        getSchools()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Manage Classes</h1>
                <AddClassDialog
                    schools={schools}
                    userRole={roleId}
                    userSchoolId={userSchoolId}
                />
            </div>

            <ClassTable classes={classes} schools={schools} />
        </div>
    );
}
