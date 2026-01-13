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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createLiveClass, updateLiveClass, LiveClass } from '../_actions/live-class-actions';
import { getClassesBySchool } from '../../classes/_actions/class-actions';
import { getSubjectsBySchool } from '../../subjects/_actions/subject-actions';

export function AddLiveClassDialog({
    liveClassToEdit,
    schools,
    userRole,
    userSchoolId,
    trigger
}: {
    liveClassToEdit?: LiveClass | null;
    schools: { id: number, name: string }[];
    userRole: number;
    userSchoolId?: number;
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    // Initial School: For SA, it might be multiple. For others single.
    // If Editing, we stick to the single school of the record.
    const [selectedSchool, setSelectedSchool] = useState<string>(
        userSchoolId ? userSchoolId.toString() : (liveClassToEdit?.school_id.toString() || '')
    );

    // Multi Schools (SA Only)
    const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<string>(
        liveClassToEdit?.subject_id.toString() || ''
    );
    // Multiple Class Selection
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>(
        liveClassToEdit?.class_ids || []
    );

    // Data
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [subjects, setSubjects] = useState<{ id: number, name: string }[]>([]);

    // Load Classes/Subjects when School Changes (For Single School Context)
    // If SA selects multiple schools, we CANNOT easily show classes/subjects common to all.
    // STRATEGY: 
    // If SA, we allow selecting multiple schools. 
    // BUT we need a "Primary" school to drive the Class/Subject dropdowns?
    // OR we assume Classes/Subjects are standardized?
    // In this system, classes/subjects are tied to school_id.
    // COMPROMISE: If multiple schools selected, we disable specific class/subject selection OR we force them to be same name?
    // Better: Allow SA to select ONE school to "Templatize" the class names, and then apply to other schools?
    // User Request: "super admin can select the classes and the schools".
    // Let's implement Multi-School Checkbox List.
    // And for Classes, we show "Class Names" (distinct names from all schools? OR just from the first selected school?)

    // SIMPLIFICATION: We use 'selectedSchool' as the "Template Source".
    // Super Admins can 'Include other schools'.

    useEffect(() => {
        if (selectedSchool) {
            getClassesBySchool(parseInt(selectedSchool)).then(setClasses);
            getSubjectsBySchool(parseInt(selectedSchool)).then(setSubjects);
        }
    }, [selectedSchool]);

    const handleClassToggle = (id: number) => {
        setSelectedClassIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleSchoolToggle = (id: number) => {
        setSelectedSchoolIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSelectAllClasses = () => {
        if (selectedClassIds.length === classes.length) {
            setSelectedClassIds([]);
        } else {
            setSelectedClassIds(classes.map(c => c.id));
        }
    };

    async function handleSubmit(formData: FormData) {
        if (selectedClassIds.length === 0) {
            toast.error("Please select at least one class.");
            return;
        }

        setLoading(true);
        formData.append('school_id', selectedSchool);
        formData.append('subject_id', selectedSubject);
        formData.append('class_ids', JSON.stringify(selectedClassIds));

        // Append Multi-Schools if SA
        if (userRole === 1 && selectedSchoolIds.length > 0) {
            formData.append('additional_school_ids', JSON.stringify(selectedSchoolIds.filter(id => id !== parseInt(selectedSchool))));
        }

        let res;
        if (liveClassToEdit) {
            res = await updateLiveClass(liveClassToEdit.id, formData);
        } else {
            res = await createLiveClass(formData);
        }

        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setOpen(false);
        } else {
            toast.error(res.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Schedule Class
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{liveClassToEdit ? 'Edit Live Class' : 'Schedule Live Class'}</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Meeting Title</Label>
                        <Input name="title" defaultValue={liveClassToEdit?.title} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Meeting URL</Label>
                        <Input name="url" type="url" defaultValue={liveClassToEdit?.url} required placeholder="https://..." />
                    </div>

                    <div className="grid gap-2">
                        <Label>Start Time</Label>
                        <Input
                            name="start_time"
                            type="datetime-local"
                            defaultValue={liveClassToEdit ? new Date(liveClassToEdit.start_time).toISOString().slice(0, 16) : ''}
                            required
                        />
                    </div>

                    {/* School Selection - SA Only */}
                    {userRole === 1 && (
                        <div className="grid gap-2">
                            <Label>Primary School (Source for Classes/Subjects)</Label>
                            <Select value={selectedSchool} onValueChange={val => { setSelectedSchool(val); if (!selectedSchoolIds.includes(parseInt(val))) setSelectedSchoolIds(prev => [...prev, parseInt(val)]); }} disabled={!!liveClassToEdit}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Source School" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schools.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {!liveClassToEdit && (
                                <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
                                    <Label className="mb-2 block text-xs text-muted-foreground">Select Additional Schools to Broadcast To</Label>
                                    {schools.map(s => (
                                        <div key={s.id} className="flex items-center space-x-2 mb-1">
                                            <Checkbox
                                                id={`sch-${s.id}`}
                                                checked={selectedSchoolIds.includes(s.id) || s.id.toString() === selectedSchool}
                                                onCheckedChange={() => handleSchoolToggle(s.id)}
                                                disabled={s.id.toString() === selectedSchool}
                                            />
                                            <Label htmlFor={`sch-${s.id}`} className="font-normal text-sm cursor-pointer">{s.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Subject Selection */}
                    <div className="grid gap-2">
                        <Label>Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedSchool || !!liveClassToEdit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Multi-Class Selection */}
                    <div className="grid gap-2">
                        <Label className="flex justify-between">
                            Classes {userRole === 1 && selectedSchoolIds.length > 1 && "(Will try to match class names in other schools)"}
                            <span
                                className="text-xs text-blue-500 cursor-pointer"
                                onClick={handleSelectAllClasses}
                            >
                                {selectedClassIds.length === classes.length ? 'Deselect All' : 'Select All'}
                            </span>
                        </Label>
                        <div className="border rounded-md p-2 h-32 overflow-y-auto space-y-2">
                            {classes.length === 0 ? <p className="text-xs text-muted-foreground">Select school to load classes</p> :
                                classes.map(c => (
                                    <div key={c.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cls-${c.id}`}
                                            checked={selectedClassIds.includes(c.id)}
                                            onCheckedChange={() => handleClassToggle(c.id)}
                                            disabled={!!liveClassToEdit}
                                        />
                                        <Label htmlFor={`cls-${c.id}`} className="cursor-pointer font-normal">
                                            {c.name}
                                        </Label>
                                    </div>
                                ))
                            }
                        </div>
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
