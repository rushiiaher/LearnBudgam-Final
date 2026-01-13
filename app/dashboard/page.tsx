import { DashboardFilters } from './_components/dashboard-filters';
import { StatsCards } from './_components/stats-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { auth } from '@/auth';
import { getSchoolDetails } from './school-admin/_actions/school-admin-actions';

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isTeacher = user?.roleId === 4;
  let schoolName = '';

  if (isTeacher && user?.schoolId) {
    const school = await getSchoolDetails(user.schoolId);
    schoolName = school?.name || '';
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {isTeacher && schoolName && (
          <div className="text-sm font-medium text-muted-foreground bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
            Posted at: <span className="text-blue-700 font-semibold">{schoolName}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Filters Section */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Filters</h3>
          <DashboardFilters />
        </div>

        {/* Tabs & Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white p-1 w-full justify-start rounded-lg border h-auto">
            <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-gray-100 data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1 py-2">Feedback</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1 py-2">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <StatsCards />
          </TabsContent>
          <TabsContent value="feedback">
            <div className="h-24 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
              Feedback Content Placeholder
            </div>
          </TabsContent>
          <TabsContent value="attendance">
            <div className="h-24 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
              Attendance Content Placeholder
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}