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
import { Edit, Trash2, FileText, HardDrive, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Homework, deleteHomework } from '../_actions/homework-actions';
import { AddHomeworkDialog } from './homework-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

export function HomeworkTable({
    homeworkData,
    userRole,
    userSchoolId,
    userId,
    schools
}: {
    homeworkData: Homework[],
    userRole: number,
    userSchoolId?: number,
    userId: number,
    schools: { id: number, name: string }[]
}) {

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this homework?')) {
            const res = await deleteHomework(id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }
    };

    // Helper to determine if user can edit
    const canEdit = (hw: Homework) => {
        if (userRole === 5 || userRole === 6) return false; // Students/Parents never edit

        // Rule 1: Assigned by SA (1)
        if (hw.assigned_by_role_id === 1) {
            return userRole === 1; // Only SA can edit SA work
        }

        // Rule 2: Assigned by SchAdmin (2)
        if (hw.assigned_by_role_id === 2) {
            // Only SchAdmin of SAME school can edit. SA CANNOT.
            if (userRole === 1) return false;
            return userRole === 2 && userSchoolId === hw.school_id;
        }

        // Rule 3: Assigned by Teacher (4)
        if (hw.assigned_by_role_id === 4) {
            // Teacher (Creator) can edit
            if (userRole === 4 && userId === hw.created_by) return true;
            // SA can edit
            if (userRole === 1) return true;
            // SchAdmin (same school) can edit
            if (userRole === 2 && userSchoolId === hw.school_id) return true;
        }

        return false;
    };

    // Helper to determine if user can delete
    const canDelete = (hw: Homework) => {
        if (userRole === 5 || userRole === 6) return false;
        if (userRole === 4) return false; // Teachers NEVER delete (Rule 3)

        // Rule 1: Assigned by SA (1)
        if (hw.assigned_by_role_id === 1) {
            return userRole === 1;
        }

        // Rule 2: Assigned by SchAdmin (2)
        if (hw.assigned_by_role_id === 2) {
            // Only SchAdmin of SAME school. SA CANNOT.
            if (userRole === 1) return false;
            return userRole === 2 && userSchoolId === hw.school_id;
        }

        // Rule 3: Assigned by Teacher (4)
        if (hw.assigned_by_role_id === 4) {
            // SA can delete
            if (userRole === 1) return true;
            // SchAdmin can delete
            if (userRole === 2 && userSchoolId === hw.school_id) return true;
        }

        return false;
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Assigned By</TableHead>
                        {userRole === 1 && <TableHead>School</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {homeworkData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                No homework found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        homeworkData.map((hw) => (
                            <TableRow key={hw.id}>
                                <TableCell className="font-medium">
                                    <div>{hw.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-[200px]">{hw.description}</div>
                                    <div className="flex gap-2 mt-1">
                                        {hw.pdf_path && (
                                            <a href={hw.pdf_path} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700" title="View PDF">
                                                <FileText className="h-4 w-4" />
                                            </a>
                                        )}
                                        {hw.google_drive_link && (
                                            <a href={hw.google_drive_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" title="Google Drive">
                                                <HardDrive className="h-4 w-4" />
                                            </a>
                                        )}
                                        {hw.youtube_link && (
                                            <a href={hw.youtube_link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800" title="YouTube Video">
                                                <Video className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{hw.class_name}</TableCell>
                                <TableCell>{hw.subject_name}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <span className="font-semibold">{hw.created_by_name}</span>
                                        <Badge variant="outline" className="ml-2 text-[10px]">
                                            {hw.assigned_by_role_id === 1 ? 'Super Admin' :
                                                hw.assigned_by_role_id === 2 ? 'School Admin' : 'Teacher'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                {userRole === 1 && <TableCell>{hw.school_name}</TableCell>}
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit(hw) && (
                                            <AddHomeworkDialog
                                                homeworkToEdit={hw}
                                                schools={schools}
                                                userRole={userRole}
                                                userSchoolId={userSchoolId}
                                                trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        )}
                                        {canDelete(hw) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(hw.id)}
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
