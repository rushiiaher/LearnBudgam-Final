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
import { Parent, deleteParent } from '../_actions/parent-actions';
import { School } from '../../schools/_actions/school-actions';
import { useState } from 'react';
import { AddParentDialog } from './parent-dialog';

export function ParentTable({ parents, schools }: { parents: Parent[], schools: School[] }) {
    const [editingParent, setEditingParent] = useState<Parent | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this Parent?')) {
            await deleteParent(id);
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
                            <TableHead>School</TableHead>
                            <TableHead>Children</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No parents found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            parents.map((parent) => (
                                <TableRow key={parent.id}>
                                    <TableCell className="font-medium">{parent.name}</TableCell>
                                    <TableCell>{parent.email}</TableCell>
                                    <TableCell>{parent.school_name}</TableCell>
                                    <TableCell>
                                        {parent.student_names.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {parent.student_names.map((name, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No children linked</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => setEditingParent(parent)}
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(parent.id)}
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

            {editingParent && (
                <AddParentDialog
                    parentToEdit={editingParent}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingParent(null)}
                />
            )}
        </>
    );
}
