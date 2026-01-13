import { Sidebar } from './_components/sidebar';
import { auth } from '@/auth';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayoutClient } from './_components/dashboard-layout-client';

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
