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
import { assignClassAdmin, ClassAdmin, getAvailableClassesForAdmin, getAvailableTeachers } from '../_actions/class-admin-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

export function AddClassAdminDialog({
    adminToEdit,
    schools,
    onOpenChange,
    userRole,
    userSchoolId
}: {
    adminToEdit?: ClassAdmin | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void,
    userRole?: number,
    userSchoolId?: number
}) {
    const [teachers, setTeachers] = useState<{ id: number, name: string }[]>([]);
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isSchoolAdmin = userRole === 2;
    const defaultSchoolId = isSchoolAdmin ? userSchoolId?.toString() : (adminToEdit?.school_id.toString());
    const [selectedSchool, setSelectedSchool] = useState<string>(defaultSchoolId || '');

    useEffect(() => {
        if (selectedSchool) {
            setLoadingClasses(true);
            setLoadingTeachers(true);

            // Get Classes
            getAvailableClassesForAdmin(parseInt(selectedSchool))
                .then(data => {
                    setClasses(data);
                    setLoadingClasses(false);
                });

            // Get Teachers
            getAvailableTeachers(parseInt(selectedSchool))
                .then(data => {
                    setTeachers(data);
                    setLoadingTeachers(false);
                });

        } else {
            setClasses([]);
            setTeachers([]);
        }
    }, [selectedSchool, adminToEdit]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Only assign is supported now (edit/update implies remove and re-assign)
        const res = adminToEdit
            ? { success: false, message: "Use delete and re-assign to change admins." }
            : await assignClassAdmin(formData);

        if (res.success) {
            setLoading(false);
            handleOpenChange(false);
        } else {
            setLoading(false);
            alert(res.message);
        }
    };

    return (
        <Dialog open={adminToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!adminToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Assign Class Admin
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{adminToEdit ? 'Edit Class Admin' : 'Assign Class Admin'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {!isSchoolAdmin && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="school_id" className="text-right">School</Label>
                            <div className="col-span-3">
                                <Select name="school_id" value={selectedSchool} onValueChange={setSelectedSchool} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schools.map((school) => (
                                            <SelectItem key={school.id} value={school.id.toString()}>{school.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Hidden input for school_id if School Admin, so it submits with form */}
                    {isSchoolAdmin && <input type="hidden" name="school_id" value={selectedSchool} />}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="teacher_id" className="text-right">Teacher</Label>
                        <div className="col-span-3">
                            <Select name="teacher_id" required disabled={!selectedSchool || loadingTeachers || !!adminToEdit}>
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        !selectedSchool ? "Select School first" :
                                            loadingTeachers ? "Loading..." :
                                                "Select Teacher"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class_id" className="text-right">Class</Label>
                        <div className="col-span-3">
                            <Select name="class_id" defaultValue={adminToEdit?.class_id.toString()} disabled={!selectedSchool || loadingClasses || !!adminToEdit} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        !selectedSchool ? "Select School first" :
                                            loadingClasses ? "Loading..." :
                                                "Select Class"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading || !!adminToEdit}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {adminToEdit ? 'Deletion Required' : 'Assign'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
