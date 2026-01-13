'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ClassItem, deleteClass } from '../_actions/class-actions';

import { School } from '../../schools/_actions/school-actions';
import { useState } from 'react';
import { AddClassDialog } from './class-dialog';
import { Badge } from '@/components/ui/badge'; // Added import

export function ClassTable({ classes, schools }: { classes: ClassItem[], schools: School[] }) {
    const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this class?')) {
            await deleteClass(id);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Class Name</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No classes found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            classes.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell>
                                        {cls.subjects_list ? (
                                            <div className="flex flex-wrap gap-1">
                                                {cls.subjects_list.split(', ').map(subj => (
                                                    <Badge key={subj} variant="secondary" className="text-xs">
                                                        {subj}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">No subjects</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(cls.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => setEditingClass(cls)}
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(cls.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {editingClass && (
                <AddClassDialog
                    classToEdit={editingClass}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingClass(null)}
                />
            )}
        </>
    );
}
