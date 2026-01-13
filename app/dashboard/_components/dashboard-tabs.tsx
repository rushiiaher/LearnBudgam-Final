import {
    Tabs,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

export function DashboardTabs() {
    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white p-1">
                <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-gray-100 data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="feedback" className="flex-1">Feedback</TabsTrigger>
                <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
