'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DashboardFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
    userRoleId: number;
    schoolId?: number;
}

export function DashboardFilters({
    className,
    userRoleId,
    schoolId
}: DashboardFiltersProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const showSchoolFilter = userRoleId === 1; // Only Super Admin sees school filter
    const showClassFilter = userRoleId !== 5; // Everyone except students see class filter

    return (
        <div className={cn('grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', className)}>
            {showSchoolFilter && (
                <Select defaultValue="all-schools">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-schools">All Schools</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {showClassFilter && (
                <Select defaultValue="all-classes">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-classes">All Classes</SelectItem>
                    </SelectContent>
                </Select>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                            {date ? format(date, 'PPP') : 'Pick a date'}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
