'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createTimetableEntry } from '../_actions/timetable-actions';
// import { getDataBySchool } from '../../live-classes/_actions/live-class-actions'; // Removed
import { getClassesBySchool } from '../../classes/_actions/class-actions';
import { getSubjectsBySchool } from '../../subjects/_actions/subject-actions';
import { getTeachersBySchool } from '../../teachers/_actions/teacher-actions';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AddTimetableDialog({
    schools
}: {
    schools: School[]
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<string>('');

    // Dynamic data
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [subjects, setSubjects] = useState<{ id: number, name: string }[]>([]);
    const [teachers, setTeachers] = useState<{ id: number, name: string }[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        if (selectedSchool) {
            setDataLoading(true);
            const sid = parseInt(selectedSchool);
            Promise.all([
                getClassesBySchool(sid),
                getSubjectsBySchool(sid),
                getTeachersBySchool(sid)
            ]).then(([cls, sub, tch]) => {
                setClasses(cls);
                // getSubjectsBySchool returns {id, name, class_id...} but we just need id/name for dropdown usually, 
                // typically timetable links Subject to Class. 
                // But this dialog seems to filter by School only first?
                // The Select maps sub.id/sub.name.
                setSubjects(sub);
                setTeachers(tch);
                setDataLoading(false);
            });
        } else {
            setClasses([]);
            setSubjects([]);
            setTeachers([]);
        }
    }, [selectedSchool]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        await createTimetableEntry(formData);
        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <CalendarPlus className="mr-2 h-4 w-4" /> Add Class to Schedule
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Timetable Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="school_id" className="text-right">School</Label>
                        <div className="col-span-3">
                            <Select name="school_id" onValueChange={setSelectedSchool} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a school" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schools.map((school) => (
                                        <SelectItem key={school.id} value={school.id.toString()}>
                                            {school.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class_id" className="text-right">Class</Label>
                        <div className="col-span-3">
                            <Select name="class_id" required disabled={!selectedSchool || dataLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Class"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day_of_week" className="text-right">Day</Label>
                        <div className="col-span-3">
                            <Select name="day_of_week" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((day) => (
                                        <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start_time" className="text-right">Start Time</Label>
                        <Input id="start_time" name="start_time" type="time" className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end_time" className="text-right">End Time</Label>
                        <Input id="end_time" name="end_time" type="time" className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject_id" className="text-right">Subject</Label>
                        <div className="col-span-3">
                            <Select name="subject_id" required disabled={!selectedSchool || dataLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Subject"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub) => (
                                        <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="teacher_id" className="text-right">Teacher</Label>
                        <div className="col-span-3">
                            <Select name="teacher_id" disabled={!selectedSchool || dataLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Teacher (Optional)"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id.toString()}>{teacher.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Entry
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
