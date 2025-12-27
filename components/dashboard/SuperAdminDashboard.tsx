"use client"

import {
    Network,
    Building2,
    Users,
    UserCog,
    Video,
    BookOpen,
    Settings,
    BarChart3,
    Search,
    School,
    FileCheck,
    UserCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SuperAdminDashboard() {
    const stats = [
        { title: "Total Schools", value: "12", icon: Building2, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Users", value: "2,500+", icon: Users, color: "text-green-600", bg: "bg-green-100" },
        { title: "Active Live Classes", value: "8", icon: Video, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "System Utilization", value: "94%", icon: Network, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    const actions = [
        { title: "School Management", desc: "Add or manage schools", icon: Building2 },
        { title: "User Management", desc: "Manage all user roles", icon: UserCog },
        { title: "Role Assignment", desc: "Assign system roles", icon: UserCheck },
        { title: "Live Classes", desc: "Monitor & schedule", icon: Video },
        { title: "Teacher Allocation", desc: "Assign to classes", icon: Users },
        { title: "System Analytics", desc: "View global reports", icon: BarChart3 },
        { title: "Content Oversight", desc: "Review materials", icon: BookOpen },
        { title: "Platform Config", desc: "System settings", icon: Settings },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Complete System Control & Overview</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Platform Settings</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {actions.map((action, i) => (
                                    <div key={i} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-center group">
                                        <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                                            <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                        </div>
                                        <span className="font-medium text-sm text-gray-900">{action.title}</span>
                                        <span className="text-xs text-gray-500 mt-1">{action.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">System Live Activity</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Scheduled Maintenance: Backup</p>
                                            <p className="text-xs text-gray-500">System running optimally • Server Load 12%</p>
                                        </div>
                                        <span className="text-xs text-gray-400">2 mins ago</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Schools Overview</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                                                <School className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Govt High School {i + 1}</p>
                                                <p className="text-xs text-gray-500">Srinagar District</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">Active</p>
                                            <p className="text-xs text-green-600">98% Attd.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
