'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, // Added
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
import { createSubject, updateSubject, Subject } from '../_actions/subject-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';
import { getClassesBySchool, getGlobalClasses } from '../../classes/_actions/class-actions';
import { TeacherSelect } from './teacher-select';

export function AddSubjectDialog({
    subjectToEdit,
    schools,
    onOpenChange,
    userRole,
    userSchoolId
}: {
    subjectToEdit?: Subject | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void,
    userRole?: number,
    userSchoolId?: number
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    const isSchoolAdmin = userRole === 2;
    // Default to 'global' if not School Admin and not editing a specific school's subject
    const defaultSchoolId = isSchoolAdmin 
        ? userSchoolId?.toString() 
        : (subjectToEdit && subjectToEdit.school_id !== null ? subjectToEdit.school_id.toString() : 'global');
    const [selectedSchool, setSelectedSchool] = useState<string>(defaultSchoolId || 'global');

    useEffect(() => {
        if (selectedSchool) {
            setLoadingClasses(true);
            const fetcher = selectedSchool === 'global'
                ? getGlobalClasses()
                : getClassesBySchool(parseInt(selectedSchool));

            fetcher
                .then(data => {
                    setClasses(data);
                    setLoadingClasses(false);
                })
                .catch(() => setLoadingClasses(false));
        } else {
            setClasses([]);
        }
    }, [selectedSchool]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Handle global school
        if (formData.get('school_id') === 'global') {
            formData.set('school_id', '');
        }

        const res = subjectToEdit
            ? await updateSubject(subjectToEdit.id, formData)
            : await createSubject(formData);

        if (res.success) {
            setLoading(false);
            handleOpenChange(false);
        } else {
            setLoading(false);
            alert(res.message);
        }
    };

    return (
        <Dialog open={subjectToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!subjectToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{subjectToEdit ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Form to {subjectToEdit ? 'edit' : 'add'} a subject.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" defaultValue={subjectToEdit?.name} className="col-span-3" required />
                    </div>

                    {/* Hidden for Super Admin: Default to Global */
                        !isSchoolAdmin && false && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="school_id" className="text-right">School</Label>
                                <div className="col-span-3">
                                    <Select name="school_id" value={selectedSchool} onValueChange={setSelectedSchool} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a school" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="global">Global (Master Template)</SelectItem>
                                            {schools.map((school) => (
                                                <SelectItem key={school.id} value={school.id.toString()}>{school.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                    {(!isSchoolAdmin || isSchoolAdmin) && <input type="hidden" name="school_id" value={selectedSchool === 'global' ? '' : selectedSchool} />}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class_id" className="text-right">Class</Label>
                        <div className="col-span-3">
                            <Select name="class_id" defaultValue={subjectToEdit?.class_id?.toString()} disabled={!selectedSchool || loadingClasses} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={!selectedSchool ? "Select School first" : loadingClasses ? "Loading..." : "Select Class"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Only show Teacher Select if we are in a specific school context */
                        selectedSchool !== 'global' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Teacher</Label>
                                <div className="col-span-3">
                                    <TeacherSelect
                                        schoolId={parseInt(selectedSchool)}
                                        value={subjectToEdit?.teacher_id ? subjectToEdit.teacher_id.toString() : undefined}
                                        onChange={(val) => { }}
                                    />
                                </div>
                            </div>
                        )}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {subjectToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
