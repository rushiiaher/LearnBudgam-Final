import { getSchools } from './_actions/school-actions';
import { SchoolTable } from './_components/school-table';
import { AddSchoolDialog } from './_components/add-school-dialog';

export default async function ManageSchoolsPage() {
    const schools = await getSchools();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Schools</h1>
                        <p className="text-muted-foreground mt-1">
                            Onboard and manage schools, assign master classes, and oversee school admins.
                        </p>
                    </div>
                    <AddSchoolDialog />
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 pt-0 mt-6">
                    <SchoolTable schools={schools} />
                </div>
            </div>
        </div>
    );
}
