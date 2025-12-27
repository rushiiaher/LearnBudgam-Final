"use client"

import {
    Users,
    UserCheck,
    Calendar,
    FileCheck,
    ClipboardList,
    AlertCircle,
    MessageCircle,
    BookOpen,
    BarChart3
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ClassAdminDashboard() {
    const stats = [
        { title: "Class Strength", value: "45", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Present Today", value: "42", icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
        { title: "Homework Due", value: "3", icon: FileCheck, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Avg Performance", value: "78%", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-100" },
    ]


    const actions = [
        { title: "Attendance", desc: "Mark Today's", icon: UserCheck },
        { title: "Timetable", desc: "View Schedule", icon: Calendar },
        { title: "Students", desc: "Manage List", icon: Users },
        { title: "Performance", desc: "View Grades", icon: ClipboardList },
        { title: "Homework", desc: "Assign/Check", icon: FileCheck },
        { title: "Disciplinary", desc: "Report Issues", icon: AlertCircle },
        { title: "Parents", desc: "Messages", icon: MessageCircle },
        { title: "Class Reports", desc: "Generate PDF", icon: BookOpen },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Class Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Class 10-A • Academic Year 2025-26</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Mark Attendance</Button>
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
                            <h2 className="text-xl font-bold mb-4">Class Management</h2>
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
                            <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
                            <div className="space-y-3">
                                {[
                                    { time: "09:00 AM", subject: "Mathematics", teacher: "Mr. Lateef" },
                                    { time: "10:00 AM", subject: "Science", teacher: "Ms. Sabreena" },
                                    { time: "11:30 AM", subject: "English", teacher: "Mrs. Nighat" },
                                ].map((slot, i) => (
                                    <div key={i} className="flex items-center p-3 border-l-4 border-blue-500 bg-gray-50">
                                        <span className="w-24 font-bold text-sm text-gray-700">{slot.time}</span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{slot.subject}</p>
                                            <p className="text-xs text-gray-500">{slot.teacher}</p>
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
                            <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-sm font-medium text-red-800">Low Attendance Alert</p>
                                    <p className="text-xs text-red-600 mt-1">Student: Aadil Ahmad (3 days absent)</p>
                                </div>
                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">Homework Incomplete</p>
                                    <p className="text-xs text-yellow-600 mt-1">5 students pending for Math</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
