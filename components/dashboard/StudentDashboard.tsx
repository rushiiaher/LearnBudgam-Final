"use client"

import {
    BookOpen,
    Video,
    ClipboardList,
    FileText,
    Clock,
    Calendar,
    BarChart3,
    List
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function StudentDashboard() {
    const stats = [
        { title: "Attendance", value: "92%", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Avg Grade", value: "A-", icon: BarChart3, color: "text-green-600", bg: "bg-green-100" },
        { title: "Assignments", value: "2 Due", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Live Classes", value: "1 Today", icon: Video, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    const subjects = [
        { name: "Mathematics", progress: 75, grade: "94%" },
        { name: "Science", progress: 60, grade: "88%" },
        { name: "English", progress: 85, grade: "91%" },
        { name: "Social Science", progress: 70, grade: "85%" },
        { name: "Urdu", progress: 90, grade: "95%" },
        { name: "Kashmiri", progress: 88, grade: "89%" },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Class 10-A • Roll No: 42</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Join Live Class
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
                            <h2 className="text-xl font-bold mb-4">My Learning Progress</h2>
                            <div className="space-y-6">
                                {subjects.map((sub, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-700">{sub.name}</span>
                                            <span className="font-bold text-gray-900">{sub.grade}</span>
                                        </div>
                                        <Progress value={sub.progress} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Upcoming Homework</h2>
                            <div className="space-y-3">
                                {[
                                    { sub: "Math", task: "Ex 4.2 Quadratic Eq", due: "Tomorrow" },
                                    { sub: "English", task: "Essay on Pollution", due: "2 days left" }
                                ].map((hw, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded border">
                                                <ClipboardList className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{hw.sub}</p>
                                                <p className="text-sm text-gray-500">{hw.task}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 bg-white border rounded text-orange-600">
                                            {hw.due}
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
                            <h2 className="text-xl font-bold mb-4">My Timetable</h2>
                            <div className="space-y-4">
                                {[
                                    { time: "09:00", sub: "Math", status: "Done" },
                                    { time: "10:00", sub: "Science", status: "Done" },
                                    { time: "11:30", sub: "Urdu", status: "Now" },
                                    { time: "01:00", sub: "English", status: "Next" },
                                ].map((slot, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-gray-500 w-12">{slot.time}</span>
                                        <div className={`flex-1 p-2 rounded ${slot.status === 'Now' ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50 border-l-4 border-gray-300'}`}>
                                            <p className="text-sm font-medium">{slot.sub}</p>
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
