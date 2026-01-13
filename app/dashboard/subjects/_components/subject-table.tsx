'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { Subject, deleteSubject } from '../_actions/subject-actions';
import { School } from '../../schools/_actions/school-actions';
import { useState } from 'react';
import { AddSubjectDialog } from './subject-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function SubjectTable({ subjects, schools }: { subjects: Subject[], schools: School[] }) {
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this Subject?')) {
            await deleteSubject(id);
        }
    };

    // Group subjects by class_name
    const subjectsByClass = subjects.reduce((acc, subject) => {
        const className = subject.class_name || 'Unassigned Class';
        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(subject);
        return acc;
    }, {} as Record<string, Subject[]>);

    const sortedClassNames = Object.keys(subjectsByClass).sort();

    return (
        <div className="space-y-4">
            {subjects.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/20 text-muted-foreground">
                    No subjects found. Add one to get started.
                </div>
            ) : (
                sortedClassNames.map((className) => (
                    <CollapsibleClassGroup
                        key={className}
                        className={className}
                        subjects={subjectsByClass[className]}
                        onEdit={setEditingSubject}
                        onDelete={handleDelete}
                    />
                ))
            )}

            {editingSubject && (
                <AddSubjectDialog
                    subjectToEdit={editingSubject}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingSubject(null)}
                />
            )}
        </div>
    );
}

function CollapsibleClassGroup({
    className,
    subjects,
    onEdit,
    onDelete
}: {
    className: string,
    subjects: Subject[],
    onEdit: (s: Subject) => void,
    onDelete: (id: number) => void
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors rounded-t-lg">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent flex items-center gap-2 w-full justify-start">
                            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-base text-gray-800">{className}</span>
                                <Badge variant="secondary" className="text-xs font-normal text-gray-500">
                                    {subjects.length} Subjects
                                </Badge>
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-t">
                                <TableHead className="w-[40%] pl-8">Subject Name</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-medium pl-8 py-3">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                                            {subject.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-gray-100"
                                                onClick={() => onEdit(subject)}
                                            >
                                                <Edit className="h-3.5 w-3.5 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-red-50"
                                                onClick={() => onDelete(subject.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
