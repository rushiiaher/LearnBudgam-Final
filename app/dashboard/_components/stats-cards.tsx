import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Users, GraduationCap, School, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
    stats: {
        totalStudents: number;
        totalTeachers: number;
        totalSchools: number;
        totalClasses: number;
        attendanceRate: number;
        activeHomework: number;
    };
    userRoleId: number;
}

export function StatsCards({ stats, userRoleId }: StatsCardsProps) {
    const getStatsForRole = () => {
        if (userRoleId === 1) { // Super Admin
            return [
                {
                    title: "Total Schools",
                    value: stats.totalSchools,
                    icon: School,
                    description: "Active schools"
                },
                {
                    title: "Total Teachers",
                    value: stats.totalTeachers,
                    icon: GraduationCap,
                    description: "Active teachers"
                },
                {
                    title: "Total Students",
                    value: stats.totalStudents,
                    icon: Users,
                    description: "Enrolled students"
                }
            ];
        } else if (userRoleId === 2) { // School Admin
            return [
                {
                    title: "Total Classes",
                    value: stats.totalClasses,
                    icon: BookOpen,
                    description: "Active classes"
                },
                {
                    title: "Total Teachers",
                    value: stats.totalTeachers,
                    icon: GraduationCap,
                    description: "School teachers"
                },
                {
                    title: "Total Students",
                    value: stats.totalStudents,
                    icon: Users,
                    description: "School students"
                }
            ];
        } else if (userRoleId === 4) { // Teacher
            return [
                {
                    title: "School Students",
                    value: stats.totalStudents,
                    icon: Users,
                    description: "Total students"
                },
                {
                    title: "School Classes",
                    value: stats.totalClasses,
                    icon: BookOpen,
                    description: "Available classes"
                },
                {
                    title: "Active Homework",
                    value: stats.activeHomework,
                    icon: ClipboardList,
                    description: "Assignments posted"
                }
            ];
        } else { // Student
            return [
                {
                    title: "My Classes",
                    value: stats.totalClasses,
                    icon: BookOpen,
                    description: "Enrolled classes"
                },
                {
                    title: "Active Homework",
                    value: stats.activeHomework,
                    icon: ClipboardList,
                    description: "Pending assignments"
                },
                {
                    title: "Attendance",
                    value: `${stats.attendanceRate}%`,
                    icon: TrendingUp,
                    description: "This month"
                }
            ];
        }
    };

    const statsToShow = getStatsForRole();

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {statsToShow.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
