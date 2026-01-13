import { auth } from '@/auth';
import { getLiveClasses } from './_actions/live-class-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { LiveClassTable } from './_components/live-class-table';
import { AddLiveClassDialog } from './_components/live-class-dialog';

export default async function ManageLiveClassesPage() {
    const session = await auth();
    const roleId = session?.user?.roleId || 5;
    const userSchoolId = session?.user?.schoolId;
    const userId = parseInt(session?.user?.id || '0');

    const [liveClasses, schools] = await Promise.all([
        getLiveClasses(),
        getSchools()
    ]);

    const canCreate = roleId === 1 || roleId === 2 || roleId === 4;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Live Classes</h1>
                    <p className="text-muted-foreground">Schedule and manage online sessions.</p>
                </div>
                {canCreate && (
                    <AddLiveClassDialog
                        schools={schools}
                        userRole={roleId}
                        userSchoolId={userSchoolId ? Number(userSchoolId) : undefined}
                    />
                )}
            </div>

            <LiveClassTable
                liveClasses={liveClasses}
                schools={schools}
                userRole={roleId}
                userSchoolId={userSchoolId ? Number(userSchoolId) : undefined}
                userId={userId}
            />
        </div>
    );
}
