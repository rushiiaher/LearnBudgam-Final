'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { ROLE_MENUS } from '@/lib/menus';
import { User } from '@/lib/definitions';
import { Button } from '@/components/ui/button';

export function Sidebar({ user, onClose }: { user?: User; onClose?: () => void }) {
    const pathname = usePathname();

    const roleId = user?.role?.id || user?.roleId || 5;
    let menuItems = ROLE_MENUS[roleId] || [];

    if (roleId === 4 && user?.isClassAdmin) {
        const classAdminMenus = ROLE_MENUS[3] || [];
        const existingHrefs = new Set(menuItems.map(m => m.href));
        classAdminMenus.forEach(item => {
            if (!existingHrefs.has(item.href)) {
                menuItems.push(item);
            }
        });
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-[#0f172a] text-white">
            {/* Mobile Close Button */}
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">Learn Budgam</span>
                    <span className="text-xs text-gray-400 mt-1">Transforming Education</span>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white hover:bg-white/10"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                                        isActive ? "bg-white/10 text-white" : "text-gray-400"
                                    )}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}

                    <li className="mt-4 pt-4 border-t border-white/10">
                        <button
                            onClick={() => {
                                signOut({ callbackUrl: '/login' });
                                onClose?.();
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate">Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0">
                        <span className="truncate text-sm font-medium text-white">
                            {user?.name || 'User'}
                        </span>
                        <div className="flex flex-col gap-1 text-xs text-gray-400">
                            <span className="truncate">{user?.email || 'user@example.com'}</span>
                            <span className="rounded bg-white/20 px-1 py-0.5 text-[10px] uppercase text-white w-fit">
                                {user?.role?.name?.replace('_', ' ') || 'User'}
                                {user?.isClassAdmin && roleId === 4 && <span className="ml-1 text-[8px] opacity-75">(Admin)</span>}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
