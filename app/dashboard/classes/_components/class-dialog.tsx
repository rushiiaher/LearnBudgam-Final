
'use client';

import { useState } from 'react';
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
import { createClass, updateClass, ClassItem } from '../_actions/class-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

export function AddClassDialog({
    classToEdit,
    schools,
    onOpenChange,
    userRole,
    userSchoolId
}: {
    classToEdit?: ClassItem | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void,
    userRole?: number,
    userSchoolId?: number
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // If school_id is "global", remove it or set it to empty so backend treats it as null
        if (formData.get('school_id') === 'global') {
            formData.set('school_id', '');
        }

        if (classToEdit) {
            await updateClass(classToEdit.id, formData);
        } else {
            await createClass(formData);
        }

        setLoading(false);
        handleOpenChange(false);
    };

    // If School Admin, auto-select their school
    const isSchoolAdmin = userRole === 2;
    const defaultSchoolId = isSchoolAdmin ? userSchoolId?.toString() : (classToEdit?.school_id ? classToEdit.school_id.toString() : 'global');

    return (
        <Dialog open={classToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!classToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Class
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{classToEdit ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Form to {classToEdit ? 'edit' : 'create'} a class.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={classToEdit?.name || ''}
                            className="col-span-3"
                            placeholder="e.g. Class 10"
                            required
                        />
                    </div>

                    {!isSchoolAdmin && false && (
                        /* Hidden for now as per requirement: Super Admin only creates Global Classes here */
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="school_id" className="text-right">
                                School
                            </Label>
                            <div className="col-span-3">
                                <Select name="school_id" defaultValue={defaultSchoolId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Scope" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="global">Global (Master Template)</SelectItem>
                                        {schools.map((school) => (
                                            <SelectItem key={school.id} value={school.id.toString()}>
                                                {school.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {!isSchoolAdmin && (
                        <input type="hidden" name="school_id" value="global" />
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {classToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
