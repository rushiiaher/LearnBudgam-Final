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
import { Trash2 } from 'lucide-react';
import { TimetableEntry, deleteTimetableEntry } from '../_actions/timetable-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function TimetableList({ timetable }: { timetable: TimetableEntry[] }) {

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this class from the schedule?')) {
            await deleteTimetableEntry(id);
        }
    };

    // Group by Class
    const groupedByClass = timetable.reduce((acc, entry) => {
        const key = `${entry.school_name} - ${entry.class_name}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, TimetableEntry[]>);

    if (Object.keys(groupedByClass).length === 0) {
        return <div className="text-center p-8 text-gray-500">No timetable entries found.</div>
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedByClass).map(([className, entries]) => (
                <Card key={className}>
                    <CardHeader>
                        <CardTitle className="text-lg">{className}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map(entry => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-medium">{entry.day_of_week}</TableCell>
                                        <TableCell>{entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}</TableCell>
                                        <TableCell>{entry.subject_name}</TableCell>
                                        <TableCell>{entry.teacher_name || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
