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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Teacher, assignClassAdmin, assignSubjects, getTeacherAssignments, getAvailableClassesForAssignment, getAvailableSubjectsForAssignment } from '../_actions/teacher-actions';
import { toast } from 'sonner';

export function AssignTeacherDialog({
    teacher,
    isOpen,
    onOpenChange
}: {
    teacher: Teacher,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('class-admin');

    // Class Admin State
    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [currentClassAdminId, setCurrentClassAdminId] = useState<number | null>(null);

    // Subject State
    const [subjects, setSubjects] = useState<{ id: number, name: string, class_name: string }[]>([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen && teacher) {
            setLoading(true);
            Promise.all([
                getAvailableClassesForAssignment(teacher.school_id, teacher.id),
                getAvailableSubjectsForAssignment(teacher.school_id, teacher.id),
                getTeacherAssignments(teacher.id)
            ]).then(([cls, sub, assignments]) => {
                setClasses(cls);
                setSubjects(sub);

                // Set current assignments
                if (assignments.classAdminId) {
                    setCurrentClassAdminId(assignments.classAdminId);
                    setSelectedClassId(assignments.classAdminId.toString());
                } else {
                    setCurrentClassAdminId(null);
                    setSelectedClassId('');
                }

                setSelectedSubjectIds(assignments.subjectIds);
                setLoading(false);
            });
        }
    }, [isOpen, teacher]);

    const handleAssignClassAdmin = async () => {
        setLoading(true);
        // If empty string, it means unassign (if we allow that logic, currently action might need update)
        // But here we rely on selection.
        if (!selectedClassId && !currentClassAdminId) {
            setLoading(false);
            return;
        }

        const res = await assignClassAdmin(teacher.id, selectedClassId ? parseInt(selectedClassId) : null);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            onOpenChange(false);
        } else {
            toast.error(res.message);
        }
    };

    const handleAssignSubjects = async () => {
        setLoading(true);
        const res = await assignSubjects(teacher.id, selectedSubjectIds);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            onOpenChange(false);
        } else {
            toast.error(res.message);
        }
    };

    const toggleSubject = (id: number) => {
        setSelectedSubjectIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Responsibilities to {teacher.name}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="class-admin">Class Admin</TabsTrigger>
                        <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    </TabsList>

                    {/* CLASS ADMIN TAB */}
                    <TabsContent value="class-admin" className="space-y-4 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Assign as Class Admin</Label>
                                <p className="text-sm text-muted-foreground">
                                    Select a class to make this teacher its administrator.
                                    A teacher can only be admin of one class.
                                </p>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* If already assigned, show current option even if technically 'taken' by self */}
                                        {currentClassAdminId && !classes.find(c => c.id === currentClassAdminId) && (
                                            // This case shouldn't happen if API returns current class as available for self
                                            <SelectItem value={currentClassAdminId.toString()}>Current Class</SelectItem>
                                        )}
                                        {classes.length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground">No available classes</div>
                                        ) : classes.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleAssignClassAdmin} disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Class Admin
                            </Button>
                        </div>
                    </TabsContent>

                    {/* SUBJECTS TAB */}
                    <TabsContent value="subjects" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Assign Subjects</Label>
                            <p className="text-sm text-muted-foreground">
                                Select classes subjects for this teacher.
                            </p>
                            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto space-y-2">
                                {subjects.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No subjects found in this school.</div>
                                ) : (
                                    subjects.map(sub => (
                                        <div key={sub.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`sub-${sub.id}`}
                                                checked={selectedSubjectIds.includes(sub.id)}
                                                onCheckedChange={() => toggleSubject(sub.id)}
                                            />
                                            <Label htmlFor={`sub-${sub.id}`} className="cursor-pointer">
                                                <span className="font-medium">{sub.name}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({sub.class_name || 'No Class'})</span>
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button onClick={handleAssignSubjects} disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Subjects
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
