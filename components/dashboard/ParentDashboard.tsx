"use client"

import {
    Users,
    MessageSquare,
    ClipboardList,
    BarChart3,
    Calendar,
    Clock,
    FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ParentDashboard() {
    const children = [
        { name: "Aadil Ahmad", class: "10-A", roll: "42", att: "92%" },
        { name: "Sana Ahmad", class: "7-B", roll: "12", att: "88%" }
    ]

    const stats = [
        { title: "Avg Attendance", value: "90%", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Behavior Score", value: "Excellent", icon: Users, color: "text-green-600", bg: "bg-green-100" },
        { title: "New Notices", value: "3", icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Next Meeting", value: "12 Jan", icon: Calendar, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitoring: 2 Children</p>
                </div>
                <Button variant="outline">Contact School</Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {children.map((child, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border min-w-[250px] cursor-pointer transition-all ${i === 0 ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white hover:bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {child.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{child.name}</p>
                            <p className="text-xs text-gray-500">Class {child.class} • Attd: {child.att}</p>
                        </div>
                    </div>
                ))}
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
                            <h2 className="text-xl font-bold mb-4">Academic Performance (Aadil)</h2>
                            <div className="space-y-4">
                                {[
                                    { sub: "Mathematics", grade: "94%", remark: "Excellent problem solving" },
                                    { sub: "Science", grade: "88%", remark: "Good understanding of concepts" },
                                    { sub: "English", grade: "91%", remark: "Very fluent" }
                                ].map((perf, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <div className="mb-2 md:mb-0">
                                            <p className="font-bold text-gray-800">{perf.sub}</p>
                                            <p className="text-sm text-gray-500">{perf.remark}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-blue-600">{perf.grade}</span>
                                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Passed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-yellow-600" />
                                        <p className="font-bold text-yellow-800">Behavioral Note</p>
                                        <span className="text-xs text-yellow-600 ml-auto">Yesterday</span>
                                    </div>
                                    <p className="text-sm text-yellow-900">Teacher noticed Aadil was very helpful to his classmates during the science project today.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">School Notices</h2>
                            <div className="space-y-3">
                                {[
                                    { title: "Winter Vacation", date: "Dec 30", type: "Holiday" },
                                    { title: "Parent Teacher Meeting", date: "Jan 12", type: "Event" },
                                    { title: "Fee Submission", date: "Jan 10", type: "Admin" }
                                ].map((notice, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                        <div className="text-center w-12 bg-white rounded border p-1">
                                            <p className="text-xs font-bold text-red-500">{notice.date.split(' ')[0]}</p>
                                            <p className="text-sm font-bold text-gray-900">{notice.date.split(' ')[1]}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{notice.title}</p>
                                            <p className="text-xs text-gray-500">{notice.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-auto py-4 bg-blue-600 hover:bg-blue-700 flex flex-col gap-1">
                        <span className="text-lg font-bold">Provide Feedback</span>
                        <span className="text-xs opacity-90 font-normal">Rate your satisfaction</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
