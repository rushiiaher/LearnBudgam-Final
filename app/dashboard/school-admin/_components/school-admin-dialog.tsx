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
import { createSchoolAdmin, updateSchoolAdmin, SchoolAdmin } from '../_actions/school-admin-actions';
import { Plus, Loader2 } from 'lucide-react';
import { School } from '../../schools/_actions/school-actions';

export function AddSchoolAdminDialog({
    adminToEdit,
    schools,
    onOpenChange
}: {
    adminToEdit?: SchoolAdmin | null,
    schools: School[],
    onOpenChange?: (open: boolean) => void
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

        if (adminToEdit) {
            await updateSchoolAdmin(adminToEdit.id, formData);
        } else {
            await createSchoolAdmin(formData);
        }

        setLoading(false);
        handleOpenChange(false);
    };

    return (
        <Dialog open={adminToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!adminToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add School Admin
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{adminToEdit ? 'Edit School Admin' : 'Add School Admin'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={adminToEdit?.name || ''}
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
                            defaultValue={adminToEdit?.email || ''}
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
                            placeholder={adminToEdit ? 'Leave blank to keep current' : 'Required'}
                            required={!adminToEdit}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="school_id" className="text-right">
                            School
                        </Label>
                        <div className="col-span-3">
                            <Select name="school_id" defaultValue={adminToEdit?.school_id.toString()} required>
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

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {adminToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
