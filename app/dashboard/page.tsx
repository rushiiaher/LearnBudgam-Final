"use client"

import { useState } from "react"
import {
  Menu, Search, Bell, Globe, Maximize, ChevronDown,
  BarChart3, Users, School, BookOpen, UserCheck,
  ClipboardList, FileText, Calendar, Settings, GraduationCap,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard"
import SchoolAdminDashboard from "@/components/dashboard/SchoolAdminDashboard"
import ClassAdminDashboard from "@/components/dashboard/ClassAdminDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import ParentDashboard from "@/components/dashboard/ParentDashboard"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  // Simulated user role state: 'super_admin', 'school_admin', 'class_admin', 'teacher', 'student', 'parent'
  const [userRole, setUserRole] = useState('super_admin')

  // Helper to render correct dashboard
  const renderDashboard = () => {
    switch (userRole) {
      case 'super_admin': return <SuperAdminDashboard />
      case 'school_admin': return <SchoolAdminDashboard />
      case 'class_admin': return <ClassAdminDashboard />
      case 'teacher': return <TeacherDashboard />
      case 'student': return <StudentDashboard />
      case 'parent': return <ParentDashboard />
      default: return <SuperAdminDashboard />
    }
  }

  // Dynamic menu items based on role (simplified for demo)
  const getMenuItems = () => {
    const common = [
      { name: 'Dashboard', icon: LayoutDashboard, active: true },
      { name: 'Calendar', icon: Calendar },
      { name: 'Settings', icon: Settings },
    ]

    if (userRole === 'super_admin') return [
      ...common,
      { name: 'Schools', icon: School },
      { name: 'Users', icon: Users },
      { name: 'Analytics', icon: BarChart3 },
    ]

    if (userRole === 'student') return [
      ...common,
      { name: 'My Classes', icon: BookOpen },
      { name: 'Assignments', icon: ClipboardList },
      { name: 'Results', icon: FileText },
    ]

    // Default fallback
    return [
      ...common,
      { name: 'Students', icon: GraduationCap },
      { name: 'Teachers', icon: Users },
      { name: 'Reports', icon: FileText },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold truncate">LMS Admin</h1>}
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">L</div>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0"></div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="font-medium truncate">User Name</div>
                <div className="text-xs text-gray-400 capitalize">{userRole.replace('_', ' ')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${activeMenu === item.name ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                onClick={() => setActiveMenu(item.name)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input className="pl-10 w-64" placeholder="Search..." />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher for Demo Purposes */}
            <select
              className="p-2 border rounded text-sm bg-gray-50"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="super_admin">Super Admin</option>
              <option value="school_admin">School Admin</option>
              <option value="class_admin">Class Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>

            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderDashboard()}
        </main>
      </div>
    </div>
  )
}