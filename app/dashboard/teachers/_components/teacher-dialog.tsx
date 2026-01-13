'use client';

import { useState } from 'react';
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
import { createTeacher, updateTeacher, Teacher } from '../_actions/teacher-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

export function AddTeacherDialog({
    teacherToEdit,
    schools,
    onOpenChange,
    userRole,
    userSchoolId
}: {
    teacherToEdit?: Teacher | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void,
    userRole?: number,
    userSchoolId?: number
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isSchoolAdmin = userRole === 2;
    const defaultSchoolId = isSchoolAdmin ? userSchoolId?.toString() : (teacherToEdit?.school_id.toString());


    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        if (teacherToEdit) {
            await updateTeacher(teacherToEdit.id, formData);
        } else {
            await createTeacher(formData);
        }

        setLoading(false);
        handleOpenChange(false);
    };

    return (
        <Dialog open={teacherToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!teacherToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Teacher
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{teacherToEdit ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={teacherToEdit?.name || ''}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={teacherToEdit?.email || ''}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            className="col-span-3"
                            placeholder={teacherToEdit ? 'Leave blank to keep current' : 'Required'}
                            required={!teacherToEdit}
                        />
                    </div>

                    {!isSchoolAdmin && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="school_id" className="text-right">School</Label>
                            <div className="col-span-3">
                                <Select name="school_id" defaultValue={defaultSchoolId} required>
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
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {teacherToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
