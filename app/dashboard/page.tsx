import { getDashboardStats } from './_actions/dashboard-actions';
import { DashboardFilters } from './_components/dashboard-filters';
import { StatsCards } from './_components/stats-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { auth } from '@/auth';
import { getSchoolDetails } from './school-admin/_actions/school-admin-actions';

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const userRoleId = user?.roleId || user?.role?.id || 5;
  const schoolId = user?.schoolId;

  const [stats, schoolDetails] = await Promise.all([
    getDashboardStats(userRoleId, schoolId ?? undefined),
    schoolId ? getSchoolDetails(schoolId) : null
  ]);

  const schoolName = schoolDetails?.name || '';

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        {schoolName && (
          <div className="text-xs sm:text-sm font-medium text-muted-foreground bg-blue-50 px-2 sm:px-3 py-1 rounded-md border border-blue-100 w-fit">
            {userRoleId === 4 ? 'Posted at:' : 'School:'} <span className="text-blue-700 font-semibold">{schoolName}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 md:p-4">
          <h3 className="mb-3 md:mb-4 text-sm font-medium text-muted-foreground">Filters</h3>
          <DashboardFilters userRoleId={userRoleId} schoolId={schoolId ?? undefined} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white p-1 w-full justify-start rounded-lg border h-auto">
            <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-gray-100 data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2 text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1 py-2 text-xs sm:text-sm">Feedback</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1 py-2 text-xs sm:text-sm">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <StatsCards stats={stats} userRoleId={userRoleId} />
          </TabsContent>
          <TabsContent value="feedback">
            <div className="h-24 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Feedback Content Placeholder
            </div>
          </TabsContent>
          <TabsContent value="attendance">
            <div className="h-24 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Attendance Content Placeholder
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}