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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Search, FilterX } from 'lucide-react';
import { Student, deleteStudent } from '../_actions/student-actions';
import { School } from '../../schools/_actions/school-actions';
import { useState, useMemo } from 'react';
import { AddStudentDialog } from './student-dialog';

export function StudentTable({ students, schools }: { students: Student[], schools: School[] }) {
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('all');

    // Extract unique classes from students list for filter dropdown
    const availableClasses = useMemo(() => {
        const classes = new Set<string>();
        students.forEach(s => {
            if (s.class_name) classes.add(s.class_name);
        });
        return Array.from(classes).sort();
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.enrollment_no?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = selectedClass === 'all' || student.class_name === selectedClass;

            return matchesSearch && matchesClass;
        });
    }, [students, searchQuery, selectedClass]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this Student?')) {
            await deleteStudent(id);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, enrollment..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {availableClasses.map(cls => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(searchQuery || selectedClass !== 'all') && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedClass('all');
                                }}
                                title="Clear Filters"
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-md border bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Enrollment No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        {students.length === 0 ? "No students found." : "No matching students found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium font-mono">{student.enrollment_no}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{student.name}</span>
                                                <span className="text-xs text-muted-foreground">{student.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.school_name}</TableCell>
                                        <TableCell>{student.class_name}</TableCell>
                                        <TableCell>{student.gender}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-gray-100"
                                                    onClick={() => setEditingStudent(student)}
                                                >
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-100"
                                                    onClick={() => handleDelete(student.id)}
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
            </div>

            {editingStudent && (
                <AddStudentDialog
                    studentToEdit={editingStudent}
                    schools={schools}
                    onOpenChange={(open) => !open && setEditingStudent(null)}
                />
            )}
        </>
    );
}
