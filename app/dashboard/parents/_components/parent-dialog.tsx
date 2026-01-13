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
import { createParent, updateParent, Parent, getStudentsBySchool } from '../_actions/parent-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

export function AddParentDialog({
    parentToEdit,
    schools,
    onOpenChange
}: {
    parentToEdit?: Parent | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<string>(parentToEdit?.school_id.toString() || '');
    const [availableStudents, setAvailableStudents] = useState<{ id: number, name: string }[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    useEffect(() => {
        if (selectedSchool) {
            setStudentsLoading(true);
            getStudentsBySchool(parseInt(selectedSchool))
                .then(data => {
                    setAvailableStudents(data);
                    setStudentsLoading(false);
                });
        } else {
            setAvailableStudents([]);
        }
    }, [selectedSchool]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        if (parentToEdit) {
            await updateParent(parentToEdit.id, formData);
        } else {
            await createParent(formData);
        }

        setLoading(false);
        handleOpenChange(false);
    };

    return (
        <Dialog open={parentToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!parentToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Parent
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{parentToEdit ? 'Edit Parent' : 'Add Parent'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" defaultValue={parentToEdit?.name || ''} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={parentToEdit?.email || ''} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input id="password" name="password" type="password" className="col-span-3" placeholder={parentToEdit ? 'Keep unchanged' : 'Required'} required={!parentToEdit} />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="school_id" className="text-right">School</Label>
                        <div className="col-span-3">
                            <Select name="school_id" value={selectedSchool} onValueChange={setSelectedSchool} required>
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

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="student_id" className="text-right mt-2">Children</Label>
                        <div className="col-span-3">
                            <div className="border rounded-md p-2 h-40 overflow-y-auto">
                                {studentsLoading ? (
                                    <p className="text-xs text-muted-foreground">Loading students...</p>
                                ) : availableStudents.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No students found in this school.</p>
                                ) : (
                                    availableStudents.map(student => (
                                        <div key={student.id} className="flex items-center space-x-2 mb-1">
                                            <input
                                                type="checkbox"
                                                name="student_id"
                                                value={student.id}
                                                id={`stu-${student.id}`}
                                                defaultChecked={parentToEdit?.student_ids.includes(student.id)}
                                            />
                                            <label htmlFor={`stu-${student.id}`} className="text-sm cursor-pointer select-none">
                                                {student.name}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Select all children belonging to this parent.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {parentToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
