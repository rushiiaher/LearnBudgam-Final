
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
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { assignClassToSchool, getUnassignedGlobalClasses } from '../../classes/_actions/class-actions';

interface AssignClassDialogProps {
    schoolId: number;
    schoolName: string;
}

export function AssignClassDialog({ schoolId, schoolName }: AssignClassDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalClasses, setGlobalClasses] = useState<{ id: number; name: string }[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [fetchingClasses, setFetchingClasses] = useState(false);

    const handleOpenChange = async (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            setFetchingClasses(true);
            try {
                const classes = await getUnassignedGlobalClasses(schoolId);
                setGlobalClasses(classes);
            } catch (error) {
                console.error("Failed to fetch global classes", error);
            } finally {
                setFetchingClasses(false);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedClassId) return;

        setLoading(true);
        try {
            const formData = new FormData();
            const res = await assignClassToSchool(schoolId, parseInt(selectedClassId));

            if (res.success) {
                setOpen(false);
                // Optionally trigger a refresh or toast
                alert(`Successfully assigned class to ${schoolName}`);
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Assign Class
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Assign Class to {schoolName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={fetchingClasses}>
                        <SelectTrigger>
                            <SelectValue placeholder={fetchingClasses ? "Loading classes..." : "Select Master Class"} />
                        </SelectTrigger>
                        <SelectContent>
                            {globalClasses.length === 0 ? (
                                <SelectItem value="none" disabled>No global classes found</SelectItem>
                            ) : (
                                globalClasses.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                        {cls.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <Button type="submit" disabled={loading || !selectedClassId} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign Class
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
