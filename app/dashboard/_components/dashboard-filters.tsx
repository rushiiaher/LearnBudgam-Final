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

export function DashboardFilters({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className={cn('grid gap-4 md:grid-cols-3', className)}>
            <Select defaultValue="all-schools">
                <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-schools">All Schools</SelectItem>
                    <SelectItem value="school-1">Learn Budgam High</SelectItem>
                </SelectContent>
            </Select>

            <Select defaultValue="all-classes">
                <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-classes">All Classes</SelectItem>
                    <SelectItem value="class-10">Class 10</SelectItem>
                    <SelectItem value="class-9">Class 9</SelectItem>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
