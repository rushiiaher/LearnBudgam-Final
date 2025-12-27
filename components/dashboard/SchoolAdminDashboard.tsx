"use client"

import {
    Users,
    GraduationCap,
    School,
    FileCheck,
    Video,
    ClipboardList,
    MessageSquare,
    UserPlus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SchoolAdminDashboard() {
    const stats = [
        { title: "Total Students", value: "850", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Teachers", value: "42", icon: Users, color: "text-green-600", bg: "bg-green-100" },
        { title: "Classes", value: "24", icon: School, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Today's Attendance", value: "92%", icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    const actions = [
        { title: "School Profile", desc: "Manage Details", icon: School },
        { title: "Add Teacher", desc: "Hire & Assign", icon: UserPlus },
        { title: "Admissions", desc: "Enroll Students", icon: GraduationCap },
        { title: "Live Classes", desc: "Co-ordination", icon: Video },
        { title: "Attendance", desc: "Monitor Daily", icon: ClipboardList },
        { title: "Homework", desc: "Submission Rates", icon: FileCheck },
        { title: "Parents", desc: "Communication", icon: MessageSquare },
        { title: "School Reports", desc: "View Analytics", icon: ClipboardList },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Govt High School Srinagar - Administration Center</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">View Reports</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">New Admission</Button>
                </div>
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
                            <h2 className="text-xl font-bold mb-4">Administration Tools</h2>
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
                            <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                            <div className="space-y-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-100 rounded-full">
                                                <Video className="w-4 h-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Live Class Request</p>
                                                <p className="text-xs text-gray-500">Science - Class 10th - By Mr. Sharma</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8">Reject</Button>
                                            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">Approve</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Teacher Activity</h2>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Teacher Name {i + 1}</p>
                                            <p className="text-xs text-gray-500">Submitted grades for Class 9</p>
                                        </div>
                                        <span className="text-xs text-gray-400">1h ago</span>
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
