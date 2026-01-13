'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Teacher, deleteTeacher } from '../_actions/teacher-actions';
import { AddTeacherDialog } from './teacher-dialog'; // We will reuse this
import { School } from '../../schools/_actions/school-actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeacherActionsCellProps {
    teacher: Teacher;
    schools: School[];
    userRole: number;
    userSchoolId?: number;
}

export function TeacherActionsCell({ teacher, schools, userRole, userSchoolId }: TeacherActionsCellProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteTeacher(teacher.id);
            if (!result.success) {
                alert(result.message); // Simple alert for now, can be toast later
            }
        } catch (error) {
            console.error('Failed to delete teacher:', error);
            alert('Failed to delete teacher');
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
                title="Edit Teacher"
            >
                <Pencil className="h-4 w-4 text-blue-600" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                title="Delete Teacher"
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </Button>

            {/* Reuse AddTeacherDialog for Editing */}
            {isEditDialogOpen && (
                <AddTeacherDialog
                    teacherToEdit={teacher}
                    schools={schools}
                    onOpenChange={setIsEditDialogOpen}
                    userRole={userRole}
                    userSchoolId={userSchoolId}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the teacher account for <b>{teacher.name}</b>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
