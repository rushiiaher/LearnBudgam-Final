
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
import { Badge } from '@/components/ui/badge'; // Added
import { Edit, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { School, deleteSchool } from '../_actions/school-actions';
import { useState } from 'react';
import { AddSchoolDialog } from './add-school-dialog';
import { AssignClassDialog } from './assign-class-dialog';

export function SchoolTable({ schools }: { schools: School[] }) {
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this school?')) {
            await deleteSchool(id);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">School Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                No schools found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        schools.map((school) => (
                            <TableRow key={school.id}>
                                <TableCell className="font-semibold">{school.name}</TableCell>
                                <TableCell className="text-muted-foreground">{school.address || '—'}</TableCell>
                                <TableCell>{school.admin_name || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1" title="Classes">
                                                <GraduationCap className="h-3 w-3" /> {school.classes_count}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="flex items-center gap-1" title="Subjects">
                                                <BookOpen className="h-3 w-3" /> {school.subjects_count}
                                            </span>
                                        </div>
                                        {school.class_names ? (
                                            <div className="flex flex-wrap gap-1">
                                                {school.class_names.split(',').map((name, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                        {name.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No classes assigned</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(school.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <AssignClassDialog schoolId={school.id} schoolName={school.name} />
                                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => setEditingSchool(school)}
                                            title="Edit School"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(school.id)}
                                            title="Delete School"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {editingSchool && (
                <AddSchoolDialog
                    schoolToEdit={editingSchool}
                    onOpenChange={(open) => !open && setEditingSchool(null)}
                />
            )}
        </>
    );
}
