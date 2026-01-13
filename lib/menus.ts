import {
    LayoutDashboard,
    School,
    Users,
    BookOpen,
    GraduationCap,
    Video,
    CalendarDays,
    MessageSquare,
    FileText,
    KeyRound,
    UserCog,
    ClipboardList,
    User,
    BookMarked
} from 'lucide-react';

export type MenuItem = {
    href: string;
    label: string;
    icon: any;
};

export const ROLE_MENUS: Record<number, MenuItem[]> = {
    // Super Admin
    1: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/school-admin', label: 'School Admin', icon: UserCog },
        { href: '/dashboard/homework', label: 'Homework', icon: FileText },
        { href: '/dashboard/schools', label: 'School', icon: School },
        { href: '/dashboard/teachers', label: 'Teacher', icon: GraduationCap },
        { href: '/dashboard/classes', label: 'Class', icon: BookOpen },
        { href: '/dashboard/subjects', label: 'Subject', icon: BookMarked },
        { href: '/dashboard/live-classes', label: 'Manage Live Classes', icon: Video },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare },
        { href: '/dashboard/blogs', label: 'Manage Blogs', icon: FileText },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
    // School Admin
    2: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/teachers', label: 'Teachers', icon: Users },
        { href: '/dashboard/class-admin', label: 'Class Admin', icon: UserCog },
        { href: '/dashboard/homework', label: 'Homework', icon: FileText },
        { href: '/dashboard/live-classes', label: 'Manage Live Classes', icon: Video },
        { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/students', label: 'Student', icon: User },
        { href: '/dashboard/parents', label: 'Parent', icon: Users },
        { href: '/dashboard/classes', label: 'Class', icon: BookOpen },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
    // Class Admin
    3: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/students', label: 'Student', icon: User },
        { href: '/dashboard/parents', label: 'Parent', icon: Users },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
    // Teacher
    4: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/homework', label: 'Homework', icon: FileText },
        { href: '/dashboard/live-classes', label: 'Manage Live Classes', icon: Video },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
    // Student
    5: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/live-classes', label: 'Live Classes', icon: Video },
        { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
        { href: '/dashboard/homework', label: 'Homework', icon: FileText },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
    // Parent
    6: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardList },
        { href: '/dashboard/homework', label: 'Homework', icon: FileText },
        { href: '/dashboard/timetable', label: 'Timetable', icon: CalendarDays },
        { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare },
        { href: '/dashboard/change-password', label: 'Change Password', icon: KeyRound },
    ],
};
