'use client';

import { useState, useEffect } from 'react';
import { getSchoolTeachers } from '../../school-admin/_actions/school-admin-actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function TeacherSelect({ schoolId, value, onChange }: { schoolId: number, value?: string, onChange: (val: string) => void }) {
    const [teachers, setTeachers] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        if (schoolId) {
            getSchoolTeachers(schoolId).then(setTeachers);
        }
    }, [schoolId]);

    return (
        <div className="space-y-2">
            <Label>Teacher</Label>
            <Select onValueChange={onChange} defaultValue={value} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                    {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <input type="hidden" name="teacher_id" value={value || ''} />
        </div>
    );
}
