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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createHomework, updateHomework, Homework } from '../_actions/homework-actions';
import { getClassesBySchool } from '../../classes/_actions/class-actions';
import { getSubjectsBySchool } from '../../subjects/_actions/subject-actions';

export function AddHomeworkDialog({
    homeworkToEdit,
    schools,
    userRole,
    userSchoolId,
    trigger
}: {
    homeworkToEdit?: Homework | null;
    schools: { id: number, name: string }[];
    userRole: number;
    userSchoolId?: number;
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedSchool, setSelectedSchool] = useState<string>(
        userSchoolId ? userSchoolId.toString() : (homeworkToEdit?.school_id.toString() || '')
    );
    const [selectedClass, setSelectedClass] = useState<string>(
        homeworkToEdit?.class_id.toString() || ''
    );
    const [selectedSubject, setSelectedSubject] = useState<string>(
        homeworkToEdit?.subject_id.toString() || ''
    );

    // Data Lists
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [allSubjects, setAllSubjects] = useState<{ id: number, name: string, class_id: number }[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        if (selectedSchool) {
            getClassesBySchool(parseInt(selectedSchool)).then(setClasses);
            getSubjectsBySchool(parseInt(selectedSchool)).then(setAllSubjects);
        }
    }, [selectedSchool]);

    useEffect(() => {
        if (selectedClass && allSubjects.length > 0) {
            setFilteredSubjects(allSubjects.filter(s => s.class_id.toString() === selectedClass));
        } else {
            setFilteredSubjects([]);
        }
    }, [selectedClass, allSubjects]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append('school_id', selectedSchool);
        if (selectedClass) formData.append('class_id', selectedClass);
        if (selectedSubject) formData.append('subject_id', selectedSubject);

        // If editing, preserve assigned-by meta is handled in backend logic usually.
        // Update Action just updates Title/Desc.

        let res;
        if (homeworkToEdit) {
            res = await updateHomework(homeworkToEdit.id, formData);
        } else {
            res = await createHomework(formData);
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Homework
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{homeworkToEdit ? 'Edit Homework' : 'Add Homework'}</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input name="title" defaultValue={homeworkToEdit?.title} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={homeworkToEdit?.description} />
                    </div>

                    {/* School Selection - SA Only */}
                    {userRole === 1 && (
                        <div className="grid gap-2">
                            <Label>School</Label>
                            <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={!!homeworkToEdit}>
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

                    {/* Class Selection - Disabled on Edit to maintain integrity */}
                    <div className="grid gap-2">
                        <Label>Class</Label>
                        <Select
                            value={selectedClass}
                            onValueChange={(val) => { setSelectedClass(val); setSelectedSubject(''); }}
                            disabled={!selectedSchool || !!homeworkToEdit}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject Selection - Disabled on Edit */}
                    <div className="grid gap-2">
                        <Label>Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass || !!homeworkToEdit}>
                            <SelectTrigger>
                                <SelectValue placeholder={!filteredSubjects.length ? "No subjects found for class" : "Select Subject"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredSubjects.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Upload PDF (Optional)</Label>
                        <Input type="file" name="pdf_file" accept="application/pdf" disabled={!!homeworkToEdit} />
                        {homeworkToEdit && homeworkToEdit.pdf_path && (
                            <p className="text-xs text-muted-foreground">Current: <a href={homeworkToEdit.pdf_path} target="_blank" className="underline text-blue-500">View PDF</a></p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Google Drive Link (Optional)</Label>
                        <Input name="google_drive_link" defaultValue={homeworkToEdit?.google_drive_link || ''} placeholder="https://drive.google.com/..." />
                    </div>

                    <div className="grid gap-2">
                        <Label>YouTube Link (Optional)</Label>
                        <Input name="youtube_link" defaultValue={homeworkToEdit?.youtube_link || ''} placeholder="https://youtube.com/..." />
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
