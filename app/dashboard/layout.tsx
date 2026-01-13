'use client';

import { Sidebar } from './_components/sidebar';
import { auth } from '@/auth';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function DashboardLayoutClient({
    children,
    user
}: {
    children: React.ReactNode;
    user: any;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:block
            `}>
                <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="hidden sm:inline">Learn Budgam</span>
                            <span className="hidden sm:inline">/</span>
                            <span className="font-medium text-gray-900">Dashboard</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <DashboardLayoutClient user={session?.user}>
            {children}
        </DashboardLayoutClient>
    );
}
