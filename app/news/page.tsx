import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export default function NewsPage() {
  const newsItems = [
    {
      date: "December 15, 2024",
      category: "Announcement",
      title: "Digital Portal Launch Successful",
      content:
        "The digital portal for all 15 schools has been successfully launched. Students, teachers, and parents can now access the platform using their credentials.",
    },
    {
      date: "December 10, 2024",
      category: "Training",
      title: "Teacher Training Program Completed",
      content:
        "Over 450 teachers have completed comprehensive training on using digital tools and the school management system. The training covered attendance, grading, and communication features.",
    },
    {
      date: "December 5, 2024",
      category: "Milestone",
      title: "All Schools Now Connected",
      content:
        "Infrastructure setup is complete across all 15 schools. High-speed internet, smart classrooms, and computer labs are now operational.",
    },
    {
      date: "November 28, 2024",
      category: "Event",
      title: "Parent Orientation Sessions",
      content:
        "Orientation sessions for parents were conducted across all schools. Over 3,000 parents attended to learn about the new digital systems and parent portal features.",
    },
    {
      date: "November 20, 2024",
      category: "Update",
      title: "Mobile App Released",
      content:
        "The official Budgam Schools mobile app is now available for download on iOS and Android. Parents and students can access key features on the go.",
    },
    {
      date: "November 15, 2024",
      category: "Achievement",
      title: "Digital Attendance Crosses 90% Adoption",
      content:
        "More than 90% of all attendance marking is now done digitally. This has significantly reduced administrative overhead and improved accuracy.",
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Announcement: "bg-primary text-primary-foreground",
      Training: "bg-accent text-accent-foreground",
      Milestone: "bg-chart-2 text-primary-foreground",
      Event: "bg-chart-3 text-primary-foreground",
      Update: "bg-chart-4 text-foreground",
      Achievement: "bg-chart-5 text-foreground",
    }
    return colors[category] || "bg-secondary text-secondary-foreground"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">News & Updates</h1>
              <p className="text-lg md:text-xl opacity-90 text-pretty leading-relaxed">
                Stay informed about the latest developments in our digitization initiative
              </p>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {newsItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-balance">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Stay Updated</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground text-pretty">
                Follow our news and updates to stay informed about the progress of the Budgam School Digitization
                Initiative
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
