'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAttendance, saveAttendance, getStudentAttendanceHistory, AttendanceRecord } from '../_actions/attendance-actions';
// import { getDataBySchool } from '../../live-classes/_actions/live-class-actions'; // Removed
import { getClassesBySchool } from '../../classes/_actions/class-actions';
import { School } from '../../schools/_actions/school-actions';
import { Loader2, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function AttendanceSheet({
    schools,
    userRole,
    userSchoolId,
    assignedClassId,
    userId
}: {
    schools: School[],
    userRole?: number,
    userSchoolId?: number,
    assignedClassId?: number,
    userId?: number
}) {
    // Determine initial logic
    const isSchoolAdmin = userRole === 2;
    const isTeacher = userRole === 4; // Class Admin
    const isStudent = userRole === 5;

    // Student View State
    const [studentHistory, setStudentHistory] = useState<{ date: string, status: string, student_name: string }[]>([]);

    // Existing Admin State
    // Set initial school: Locked if School Admin or Teacher
    const defaultSchool = (isSchoolAdmin || isTeacher) && userSchoolId ? userSchoolId.toString() : '';
    // Set initial class: Locked if Teacher and has assigned class
    const defaultClass = isTeacher && assignedClassId ? assignedClassId.toString() : '';

    const [selectedSchool, setSelectedSchool] = useState<string>(defaultSchool);
    const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [classes, setClasses] = useState<{ id: number, name: string }[]>([]);
    const [students, setStudents] = useState<AttendanceRecord[]>([]);

    const [loadingConfig, setLoadingConfig] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [statusMap, setStatusMap] = useState<Record<number, string>>({});

    // Load Student History if Student
    useEffect(() => {
        if (isStudent && userId) {
            setLoadingData(true);
            getStudentAttendanceHistory(userId).then(data => {
                setStudentHistory(data);
                setLoadingData(false);
            });
        }
    }, [isStudent, userId]);

    // Admin Logic 1. Load Classes when School Changes
    useEffect(() => {
        if (!isStudent && selectedSchool) {
            setLoadingConfig(true);
            getClassesBySchool(parseInt(selectedSchool)).then(data => {
                setClasses(data);
                setLoadingConfig(false);
                // If not locked to a specific class, reset it
                if (!defaultClass) {
                    setSelectedClass('');
                }
            });
        }
    }, [selectedSchool, defaultClass, isStudent]);

    // Admin Logic 2. Load Attendance when Class or Date Changes
    useEffect(() => {
        if (!isStudent && selectedSchool && selectedClass && selectedDate) {
            setLoadingData(true);
            getAttendance(parseInt(selectedSchool), parseInt(selectedClass), selectedDate)
                .then(data => {
                    setStudents(data);
                    const initialStatus: Record<number, string> = {};
                    data.forEach(s => {
                        initialStatus[s.student_id] = s.status || 'Present';
                    });
                    setStatusMap(initialStatus);
                    setLoadingData(false);
                });
        }
    }, [selectedSchool, selectedClass, selectedDate, isStudent]);

    const handleStatusChange = (studentId: number, status: string) => {
        setStatusMap(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        if (!selectedSchool || !selectedClass || !selectedDate) return;
        setSaving(true);
        const updates = Object.entries(statusMap).map(([sid, status]) => ({
            studentId: parseInt(sid),
            status
        }));
        await saveAttendance({
            schoolId: parseInt(selectedSchool),
            classId: parseInt(selectedClass),
            date: selectedDate,
            updates
        });
        setSaving(false);
        alert('Attendance saved successfully!');
    };

    if (isStudent) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingData ? (
                        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : studentHistory.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">No attendance records found.</div>
                    ) : (
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentHistory.map((record, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {new Date(record.date).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                                    ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                                            record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                    {record.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Admin/Teacher View
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Criteria</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>School</Label>
                        <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={!!defaultSchool}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select School" />
                            </SelectTrigger>
                            <SelectContent>
                                {schools.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!!defaultClass || !selectedSchool || loadingConfig}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {selectedSchool && selectedClass && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student List</CardTitle>
                        <Button onClick={handleSave} disabled={saving || loadingData} className="bg-green-600 hover:bg-green-700">
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Attendance
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loadingData ? (
                            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : students.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">No students found in this class.</div>
                        ) : (
                            <div className="border rounded-md overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Roll No</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-center">Present</TableHead>
                                            <TableHead className="text-center">Absent</TableHead>
                                            <TableHead className="text-center">Late</TableHead>
                                            <TableHead className="text-center">Excused</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map(student => (
                                            <TableRow key={student.student_id}>
                                                <TableCell className="font-mono">{student.enrollment_no}</TableCell>
                                                <TableCell className="font-medium">{student.student_name}</TableCell>
                                                {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                                    <TableCell key={status} className="text-center">
                                                        <input
                                                            type="radio"
                                                            name={`status-${student.student_id}`}
                                                            checked={statusMap[student.student_id] === status}
                                                            onChange={() => handleStatusChange(student.student_id, status)}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
