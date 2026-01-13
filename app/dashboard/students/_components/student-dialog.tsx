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
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createStudent, updateStudent, Student } from '../_actions/student-actions';
// import { getDataBySchool } from '../../live-classes/_actions/live-class-actions'; // Removed
import { getClassesBySchool } from '../../classes/_actions/class-actions';

export function AddStudentDialog({
    studentToEdit,
    schools,
    onSuccess,
    userRole,
    userSchoolId,
    onOpenChange // Added
}: {
    studentToEdit?: Student | null;
    schools: { id: number, name: string }[];
    onSuccess?: () => void;
    userRole?: number;
    userSchoolId?: number;
    onOpenChange?: (open: boolean) => void;
}) {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const [loading, setLoading] = useState(false);

    const isSchoolAdmin = userRole === 2;
    // Default school: If School Admin, use their ID. If editing, use existing.
    const defaultSchoolId = isSchoolAdmin ? userSchoolId?.toString() : (studentToEdit?.school_id.toString() || '');

    console.log('AddStudentDialog: role', userRole, 'schoolId', userSchoolId, 'default', defaultSchoolId);

    const [selectedSchool, setSelectedSchool] = useState<string>(defaultSchoolId || '');
    // Dynamic Classes
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);

    const [selectedClass, setSelectedClass] = useState<string>(studentToEdit?.class_id?.toString() || '');

    useEffect(() => {
        if (selectedSchool) {
            getClassesBySchool(parseInt(selectedSchool)).then(setClasses);
        } else {
            setClasses([]);
        }
    }, [selectedSchool]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append('school_id', selectedSchool);
        formData.append('class_id', selectedClass);

        console.log('Client submitting:', Object.fromEntries(formData));

        let res;
        if (studentToEdit) {
            res = await updateStudent(studentToEdit.id, formData);
        } else {
            res = await createStudent(formData);
        }

        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setOpen(false);
            if (onSuccess) onSuccess();
        } else {
            toast.error(res.message);
        }
    }

    return (
        <Dialog open={studentToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!studentToEdit && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{studentToEdit ? 'Edit Student' : 'Add Student'}</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input name="name" defaultValue={studentToEdit?.name} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input name="email" type="email" defaultValue={studentToEdit?.email} required />
                    </div>

                    {!studentToEdit && (
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" required />
                        </div>
                    )}
                    {studentToEdit && (
                        <div className="grid gap-2">
                            <Label>New Password (Optional)</Label>
                            <Input name="password" type="password" placeholder="Leave blank to keep current" />
                        </div>
                    )}

                    {!isSchoolAdmin && (
                        <div className="grid gap-2">
                            <Label>School</Label>
                            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select School" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schools.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* Hidden input for School Admin so formData gets the school_id */}
                    {isSchoolAdmin && <input type="hidden" name="school_id" value={selectedSchool} />}

                    <div className="grid gap-2">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedSchool}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Hidden input for formData fallbacks */}
                        <input type="hidden" name="class_id" value={selectedClass} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Gender</Label>
                        <Select name="gender" defaultValue={studentToEdit?.gender || "Male"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Enrollment No</Label>
                        <Input name="enrollment_no" defaultValue={studentToEdit?.enrollment_no} required />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
