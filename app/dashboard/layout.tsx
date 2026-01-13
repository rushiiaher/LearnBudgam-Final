import { Sidebar } from './_components/sidebar';
import { auth } from '@/auth';
import { SidebarTrigger } from '@/components/ui/sidebar'; // Assuming we might use this later, but for now custom toggle or just responsive handling
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar - Hidden on mobile by default (implementation simplistic for now) */}
            <div className="hidden md:block">
                <Sidebar user={session?.user} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Learn Budgam</span>
                            <span>/</span>
                            <span className="font-medium text-gray-900">Dashboard</span>
                        </div>
                    </div>
                    {/* Right side actions if needed */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
