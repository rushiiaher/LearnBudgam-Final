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
import { Edit, Trash2, ShieldCheck } from 'lucide-react';
import { Teacher, deleteTeacher } from '../_actions/teacher-actions';
import { School } from '../../schools/_actions/school-actions';
import { useState } from 'react';
import { AddTeacherDialog } from './teacher-dialog';
import { AssignTeacherDialog } from './assign-teacher-dialog';

export function TeacherTable({ teachers, schools }: { teachers: Teacher[], schools: School[] }) {
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [assigningTeacher, setAssigningTeacher] = useState<Teacher | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this Teacher? This action cannot be undone.')) {
            await deleteTeacher(id);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Assigned School</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No teachers found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            teachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>{teacher.school_name || 'N/A'}</TableCell>
                                    <TableCell>
                                        {new Date(teacher.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Assign Responsibilities"
                                                className="h-8 w-8 hover:bg-blue-100"
                                                onClick={() => setAssigningTeacher(teacher)}
                                            >
                                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => setEditingTeacher(teacher)}
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(teacher.id)}
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

            {assigningTeacher && (
                <AssignTeacherDialog
                    teacher={assigningTeacher}
                    isOpen={!!assigningTeacher}
                    onOpenChange={(open) => !open && setAssigningTeacher(null)}
                />
            )}

            {editingTeacher && (
                <AddTeacherDialog
                    teacherToEdit={editingTeacher}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingTeacher(null)}
                />
            )}
        </>
    );
}
