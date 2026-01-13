import { auth } from '@/auth';
import { getHomework } from './_actions/homework-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { HomeworkTable } from './_components/homework-table';
import { AddHomeworkDialog } from './_components/homework-dialog';

export default async function HomeworkPage() {
    const session = await auth();
    const roleId = session?.user?.roleId || 5;
    const userSchoolId = session?.user?.schoolId;
    const userId = parseInt(session?.user?.id || '0');

    const [homeworkList, schools] = await Promise.all([
        getHomework(),
        getSchools()
    ]);

    const canCreate = roleId === 1 || roleId === 2 || roleId === 4;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Homework Management</h1>
                    <p className="text-muted-foreground">Manage and track student assignments.</p>
                </div>
                {canCreate && (
                    <AddHomeworkDialog
                        schools={schools}
                        userRole={roleId}
                        userSchoolId={userSchoolId ? Number(userSchoolId) : undefined}
                    />
                )}
            </div>

            <HomeworkTable
                homeworkData={homeworkList}
                userRole={roleId}
                userSchoolId={userSchoolId ? Number(userSchoolId) : undefined}
                userId={userId}
                schools={schools}
            />
        </div>
    );
}
