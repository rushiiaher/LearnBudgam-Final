"use client"

import {
    BookOpen,
    Video,
    ClipboardList,
    MessageCircle,
    FileCheck,
    Calendar,
    Users,
    Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TeacherDashboard() {
    const stats = [
        { title: "My Subjects", value: "3", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Classes Assigned", value: "5", icon: Users, color: "text-green-600", bg: "bg-green-100" },
        { title: "Pending Grading", value: "12", icon: FileCheck, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Upcoming Live", value: "2", icon: Video, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    const actions = [
        { title: "Start Live Class", desc: "YouTube Session", icon: Video },
        { title: "Assign Homework", desc: "Create New", icon: BookOpen },
        { title: "Mark Attendance", desc: "Daily Log", icon: ClipboardList },
        { title: "Grade Papers", desc: "Assessment", icon: FileCheck },
        { title: "My Schedule", desc: "View Timetable", icon: Calendar },
        { title: "Lesson Plans", desc: "Upload Resources", icon: ClipboardList },
        { title: "Student Progress", desc: "Analytics", icon: Users },
        { title: "Parent Chat", desc: "Messages", icon: MessageCircle },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Ms. Sabreena</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Go Live Now
                </Button>
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
                            <h2 className="text-xl font-bold mb-4">Teaching Workspace</h2>
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Today's Schedule</h2>
                                <span className="text-sm text-gray-500">{new Date().toDateString()}</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { time: "09:00 AM", class: "10-A", subject: "Math", topic: "Quadratic Equations", status: "Completed" },
                                    { time: "11:00 AM", class: "9-B", subject: "Math", topic: "Polynomials", status: "Upcoming" },
                                    { time: "02:00 PM", class: "Live", subject: "Math", topic: "Doubt Clearing Session", status: "Scheduled" }
                                ].map((cls, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                                        <div className="w-16 text-center">
                                            <p className="text-sm font-bold text-gray-900">{cls.time}</p>
                                            <p className="text-xs text-gray-500">{cls.class}</p>
                                        </div>
                                        <div className="w-1 h-10 bg-gray-200 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{cls.subject}</p>
                                            <p className="text-sm text-gray-500">Topic: {cls.topic}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs rounded-full ${cls.status === "Completed" ? "bg-green-100 text-green-700" :
                                                cls.status === "Upcoming" ? "bg-blue-100 text-blue-700" :
                                                    "bg-purple-100 text-purple-700"
                                            }`}>
                                            {cls.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="font-medium text-red-800 text-sm">Grade 10-A Assignments</p>
                                    <p className="text-xs text-red-600 mt-1">Due Today • 12 pending</p>
                                </div>
                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                    <p className="font-medium text-yellow-800 text-sm">Prepare Lesson Plan</p>
                                    <p className="text-xs text-yellow-600 mt-1">Class 9-B • Tomorrow's Topic</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
