"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { GraduationCap, Timer, ArrowLeft, Construction } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl px-4 py-16">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="bg-white p-6 rounded-full shadow-lg relative relative z-10 border border-blue-50">
                <GraduationCap className="h-16 w-16 text-primary" />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full border-4 border-white">
                  <Construction size={20} />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            LMS Portal <span className="text-primary">Coming Soon</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed text-balance">
            We are building a comprehensive Learning Management System to revolutionize education in Budgam. The portal is currently under development.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 max-w-lg mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Timer className="h-5 w-5 text-orange-500" />
              What to expect?
            </h3>
            <ul className="text-left space-y-3 text-gray-600 text-sm md:text-base">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Student & Teacher Dashboards
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Digital Attendance & Grading
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Online Resources & Assignments
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Progress Tracking & Analytics
              </li>
            </ul>
          </div>

          <Link href="/">
            <Button size="lg" className="rounded-full px-8 font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
