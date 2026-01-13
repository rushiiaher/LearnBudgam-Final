import { getSubjects } from './_actions/subject-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { getClasses } from '../classes/_actions/class-actions';
import { SubjectTable } from './_components/subject-table';
import { AddSubjectDialog } from './_components/subject-dialog';
import { auth } from '@/auth';

export default async function ManageSubjectsPage() {
    const session = await auth();
    const roleId = session?.user?.roleId;
    const userSchoolId = session?.user?.schoolId;

    const [subjects, schools, classes] = await Promise.all([
        getSubjects(),
        getSchools(),
        getClasses() // We need all classes to filter client side or pass to dialog. 
        // Ideally we should have an API to fetch classes by school, but for now fetching all (or scoped by role) is okay as it's scoped in getClasses action.
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Manage Subjects</h1>
                <AddSubjectDialog
                    schools={schools}
                    userRole={Number(roleId)}
                    userSchoolId={Number(userSchoolId)}
                />
            </div>

            <SubjectTable subjects={subjects} schools={schools} />
        </div>
    );
}
