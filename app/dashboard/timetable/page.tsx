import { getTimetable } from './_actions/timetable-actions';
import { getSchools } from '../schools/_actions/school-actions';
import { TimetableList } from './_components/timetable-list';
import { AddTimetableDialog } from './_components/timetable-dialog';

export default async function ManageTimetablePage() {
    const [timetable, schools] = await Promise.all([
        getTimetable(),
        getSchools()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Timetable Management</h1>
                <AddTimetableDialog schools={schools} />
            </div>

            <TimetableList timetable={timetable} />
        </div>
    );
}
