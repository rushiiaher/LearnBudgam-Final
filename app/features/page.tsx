import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Bell,
  Shield,
  Database,
  Smartphone,
} from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      category: "Smart School Management",
      icon: LayoutDashboard,
      items: [
        "Centralized dashboard for school administration",
        "Resource allocation and inventory management",
        "Staff management and scheduling",
        "Financial tracking and budgeting tools",
      ],
    },
    {
      category: "Attendance System",
      icon: Calendar,
      items: [
        "Digital attendance marking for students and staff",
        "Real-time attendance reports and analytics",
        "Automated absence notifications to parents",
        "Biometric and manual attendance options",
      ],
    },
    {
      category: "Academic Management",
      icon: BookOpen,
      items: [
        "Curriculum planning and tracking",
        "Assignment and homework management",
        "Online examinations and assessments",
        "Grade book and report card generation",
      ],
    },
    {
      category: "Communication Hub",
      icon: MessageSquare,
      items: [
        "Direct messaging between teachers and parents",
        "Announcements and notifications",
        "Event calendar and reminders",
        "Group discussions and forums",
      ],
    },
    {
      category: "Reports & Analytics",
      icon: FileText,
      items: [
        "Comprehensive performance analytics",
        "Custom report generation",
        "Student progress tracking",
        "Data visualization and insights",
      ],
    },
    {
      category: "Parent Portal",
      icon: Users,
      items: [
        "View child's attendance and grades",
        "Track academic progress",
        "Receive real-time notifications",
        "Access fee payment history",
      ],
    },
    {
      category: "Time Management",
      icon: Clock,
      items: [
        "Automated timetable generation",
        "Class scheduling and room allocation",
        "Teacher workload distribution",
        "Period and break management",
      ],
    },
    {
      category: "Performance Tracking",
      icon: TrendingUp,
      items: [
        "Individual student performance metrics",
        "Class-wise comparison and analysis",
        "Subject-wise performance insights",
        "Predictive analytics for intervention",
      ],
    },
    {
      category: "Notifications",
      icon: Bell,
      items: [
        "Push notifications for important updates",
        "SMS and email alerts",
        "Customizable notification preferences",
        "Emergency broadcast system",
      ],
    },
    {
      category: "Security & Privacy",
      icon: Shield,
      items: [
        "Role-based access control",
        "Secure data encryption",
        "Regular backups and recovery",
        "Compliance with data protection laws",
      ],
    },
    {
      category: "Data Management",
      icon: Database,
      items: [
        "Centralized student database",
        "Document management system",
        "Historical data preservation",
        "Easy data import and export",
      ],
    },
    {
      category: "Mobile Access",
      icon: Smartphone,
      items: [
        "Responsive design for all devices",
        "Mobile apps for iOS and Android",
        "Offline access to key features",
        "On-the-go administration",
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-accent py-16 md:py-24" style={{backgroundImage: 'url(/D1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Digital Features</h1>
              <p className="text-lg md:text-xl opacity-90 text-pretty leading-relaxed">
                Comprehensive digital solutions designed to transform every aspect of school operations
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.category}</h3>
                    <ul className="space-y-2">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
