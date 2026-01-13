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
import { createSchool, updateSchool, School } from '../_actions/school-actions';
import { Plus, Loader2 } from 'lucide-react';

export function AddSchoolDialog({ schoolToEdit, onOpenChange }: { schoolToEdit?: School | null, onOpenChange?: (open: boolean) => void }) {
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

        let res;
        if (schoolToEdit) {
            res = await updateSchool(schoolToEdit.id, formData);
        } else {
            res = await createSchool(formData);
        }

        if (res.success) {
            setLoading(false);
            handleOpenChange(false);
        } else {
            setLoading(false);
            alert(res.message);
        }
    };

    return (
        <Dialog open={schoolToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!schoolToEdit && (
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add School
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{schoolToEdit ? 'Edit School' : 'Add New School'}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Form to {schoolToEdit ? 'edit' : 'add'} a school.
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
                            defaultValue={schoolToEdit?.name || ''}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Address
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={schoolToEdit?.address || ''}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {schoolToEdit ? 'Update' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
