import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Clock, Award, Smartphone, BarChart3 } from "lucide-react"

export default function ImpactPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Improved Learning Outcomes",
      description:
        "Data-driven insights help identify struggling students early, enabling timely interventions and personalized learning paths that improve overall academic performance.",
    },
    {
      icon: Clock,
      title: "Time Efficiency",
      description:
        "Automated attendance, grading, and administrative tasks save thousands of hours annually, allowing teachers to focus more on teaching and less on paperwork.",
    },
    {
      icon: Users,
      title: "Enhanced Parent Engagement",
      description:
        "Real-time updates and transparent communication keep parents actively involved in their child's education, fostering a stronger home-school partnership.",
    },
    {
      icon: Smartphone,
      title: "Accessibility & Convenience",
      description:
        "Access important information anytime, anywhere. Parents can check attendance, view grades, and communicate with teachers from their mobile devices.",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Decisions",
      description:
        "Comprehensive analytics and reports empower administrators to make informed decisions based on real data, improving resource allocation and planning.",
    },
    {
      icon: Award,
      title: "Quality Education",
      description:
        "Digital tools and resources enhance teaching methodologies, making education more engaging, interactive, and effective for students.",
    },
  ]

  const stats = [
    { value: "40%", label: "Reduction in Administrative Work" },
    { value: "95%", label: "Parent Satisfaction Rate" },
    { value: "30%", label: "Improvement in Communication" },
    { value: "100%", label: "Digital Coverage Across Schools" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Benefits Grid */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Benefits of Digitization</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Transforming education through technology creates lasting positive impact for all stakeholders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const cardColors = [
                  "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
                  "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100",
                  "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100",
                  "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100",
                  "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100",
                  "bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-100"
                ]
                return (
                <Card key={index} className={`group hover:shadow-lg transition-shadow ${cardColors[index]}`}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 text-pretty leading-relaxed">
                    "The digitization initiative has transformed how we manage our schools. What used to take hours now
                    takes minutes. Parents are more engaged, teachers are more efficient, and most importantly, students
                    are benefiting from a modern, connected learning environment."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Education Administrator</div>
                      <div className="text-sm text-muted-foreground">Budgam District</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Long-term Impact */}
        <section className="relative py-16 md:py-24" style={{backgroundImage: 'url(/IM.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance text-black bg-white/80 py-2 px-4 rounded">Long-term Impact</h2>
              <div className="w-24 h-1 bg-black mx-auto mb-8"></div>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      The Budgam School Digitization Initiative is not just about implementing technology—it's about
                      creating a sustainable ecosystem that will benefit generations of students to come. By
                      establishing digital infrastructure today, we're laying the foundation for continuous improvement
                      and innovation in education.
                    </p>
                    <p>
                      Students graduating from these digitally-enabled schools will be better prepared for higher
                      education and the modern workforce. They'll have developed digital literacy skills, learned to
                      work with technology-enhanced learning tools, and experienced a more connected and engaged
                      educational environment.
                    </p>
                    <p>
                      The data collected through our systems will enable evidence-based policy making, helping education
                      authorities understand what works and what doesn't. This continuous feedback loop ensures that our
                      schools are always evolving, always improving, and always putting students first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
