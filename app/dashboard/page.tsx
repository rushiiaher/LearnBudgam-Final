"use client"

import { useState } from "react"
import { 
  Menu, Search, Bell, Globe, Maximize, ChevronDown, ChevronRight,
  BarChart3, DollarSign, Users, ShoppingBag, ShoppingCart,
  Calendar, MapPin, Plus, Minus, Settings, User, GraduationCap,
  BookOpen, FileText, UserCheck, School, ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('Analytics')

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, active: true },
    { name: 'Students', icon: GraduationCap },
    { name: 'Teachers', icon: Users },
    { name: 'Classes', icon: School },
    { name: 'Subjects', icon: BookOpen },
    { name: 'Attendance', icon: UserCheck },
    { name: 'Grades', icon: ClipboardList },
    { name: 'Reports', icon: FileText },
    { name: 'Calendar', icon: Calendar },
    { name: 'Settings', icon: Settings },
  ]

  const statsCards = [
    { title: 'Total Students', value: '1,247', change: '+12%', changeType: 'positive', subtitle: 'This semester', icon: GraduationCap },
    { title: 'Total Teachers', value: '89', change: '+3%', changeType: 'positive', subtitle: 'Active staff', icon: Users },
    { title: 'Classes', value: '45', change: '+5%', changeType: 'positive', subtitle: 'This year', icon: School },
    { title: 'Attendance Rate', value: '94.2%', change: '+2.1%', changeType: 'positive', subtitle: 'This month', icon: UserCheck },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div>
              <div className="font-medium">Canosolutions</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-400 mb-2">Main</h3>
            {menuItems.slice(0, 5).map((item) => (
              <div key={item.name} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${
                item.active ? 'bg-blue-600' : ''
              }`}>
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Management</h3>
            {menuItems.slice(5).map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700">
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.name}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <div className="flex items-center gap-4 flex-1">
            <Menu className="w-5 h-5 cursor-pointer" />
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input className="pl-10 w-64" placeholder="Search..." />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <span>Mega Menu</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <span>Resources</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">4</span>
            </div>
            <Globe className="w-5 h-5 cursor-pointer" />
            <Maximize className="w-5 h-5 cursor-pointer" />
            <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
            <div className="flex gap-3">
              <Button variant="outline">Generate Report</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Add Student</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card) => (
              <Card key={card.title} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          card.changeType === 'positive' ? 'bg-green-100 text-green-800' : 
                          card.changeType === 'negative' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {card.change}
                        </span>
                        <span className="text-xs text-gray-500">{card.subtitle}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Student Performance Trends</CardTitle>
                <div className="flex items-center gap-2">
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All Classes</option>
                    <option>Class 10</option>
                    <option>Class 9</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-t from-green-50 to-transparent rounded flex items-end justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-2 text-green-600" />
                    <p>Academic Performance Chart</p>
                    <p className="text-xs">Average: 87.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Add New Student
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Register Teacher
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <School className="w-4 h-4 mr-2" />
                  Create Class
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Enter Grades
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New student enrolled</p>
                      <p className="text-xs text-gray-500">John Doe - Class 10A</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Grades updated</p>
                      <p className="text-xs text-gray-500">Mathematics - Class 9B</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Parent meeting scheduled</p>
                      <p className="text-xs text-gray-500">Tomorrow 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border-l-4 border-blue-500 bg-blue-50">
                    <div>
                      <p className="font-medium text-sm">Mathematics</p>
                      <p className="text-xs text-gray-500">Class 10A</p>
                    </div>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">9:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-l-4 border-green-500 bg-green-50">
                    <div>
                      <p className="font-medium text-sm">Science</p>
                      <p className="text-xs text-gray-500">Class 9B</p>
                    </div>
                    <span className="text-xs bg-green-100 px-2 py-1 rounded">10:30 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-l-4 border-purple-500 bg-purple-50">
                    <div>
                      <p className="font-medium text-sm">English</p>
                      <p className="text-xs text-gray-500">Class 8A</p>
                    </div>
                    <span className="text-xs bg-purple-100 px-2 py-1 rounded">2:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Attendance Overview</CardTitle>
                <Calendar className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Class 10A</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Class 9B</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Class 8A</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}