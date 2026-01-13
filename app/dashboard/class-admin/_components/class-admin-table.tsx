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
import { ClassAdmin, removeClassAdmin } from '../_actions/class-admin-actions';
import { School } from '../../schools/_actions/school-actions';
import { useState } from 'react';
import { AddClassAdminDialog } from './class-admin-dialog';

export function ClassAdminTable({
    admins,
    schools,
    userRole,
    userSchoolId
}: {
    admins: ClassAdmin[],
    schools: School[],
    userRole?: number,
    userSchoolId?: number
}) {
    const [editingAdmin, setEditingAdmin] = useState<ClassAdmin | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to remove this Class Admin assignment? The user will remain an active Teacher.')) {
            await removeClassAdmin(id);
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
                            {userRole !== 2 && <TableHead>Assigned School</TableHead>}
                            <TableHead>Assigned Class</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={userRole !== 2 ? 6 : 5} className="text-center h-24 text-muted-foreground">
                                    No class admins found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">{admin.name}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    {userRole !== 2 && <TableCell>{admin.school_name || 'N/A'}</TableCell>}
                                    <TableCell>{admin.class_name || <span className="text-red-500 text-xs">Unassigned</span>}</TableCell>
                                    <TableCell>
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => setEditingAdmin(admin)}
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(admin.id)}
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

            {editingAdmin && (
                <AddClassAdminDialog
                    adminToEdit={editingAdmin}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingAdmin(null)}
                    userRole={userRole}
                    userSchoolId={userSchoolId}
                />
            )}
        </>
    );
}
