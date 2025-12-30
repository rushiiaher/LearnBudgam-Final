import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "How Digital Education is Transforming Schools in Budgam",
      excerpt: "Education in Budgam is entering a new digital era. With the introduction of smart classrooms, online attendance systems, digital learning platforms, and centralized school management, students and teachers are experiencing a more interactive and transparent education system.",
      author: "Education Team",
      date: "March 15, 2024",
      image: "/1.jpg"
    },
    {
      id: 2,
      title: "Smart School Initiative: A New Future for Budgam Students",
      excerpt: "The Smart School Initiative in Budgam aims to modernize traditional classrooms using technology-driven solutions. Features like live online classes, digital exams, performance tracking, and real-time communication have created a smarter and more efficient education ecosystem.",
      author: "Admin Team",
      date: "March 10, 2024",
      image: "/2.jpg"
    },
    {
      id: 3,
      title: "Role of Teachers in Digital Transformation of Budgam Schools",
      excerpt: "Teachers play a crucial role in the successful implementation of digital education. In Budgam, teachers are being trained to use smart boards, online teaching tools, and digital assessment methods.",
      author: "Training Department",
      date: "March 5, 2024",
      image: "/3.jpg"
    },
    {
      id: 4,
      title: "Benefits of Digital School Management for Parents",
      excerpt: "Digital school management systems have empowered parents in Budgam by providing real-time access to attendance, academic performance, homework, and school announcements.",
      author: "Development Team",
      date: "February 28, 2024",
      image: "/4.jpg"
    },
    {
      id: 5,
      title: "Bridging the Education Gap in Rural Budgam Through Technology",
      excerpt: "Technology has become a powerful tool in bridging educational gaps in rural areas of Budgam. Online learning platforms and centralized digital systems ensure equal learning opportunities for all students, regardless of location.",
      author: "Community Team",
      date: "February 20, 2024",
      image: "/5.jpg"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Latest Blog Posts</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Stay updated with the latest news, insights, and stories from Budgam's educational journey.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  {blogPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        {index < blogPosts.length - 1 && <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>}
                      </div>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex-1">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 aspect-video md:aspect-[4/3] bg-gray-100">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="md:w-3/4 p-4">
                            <CardTitle className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-6">
                {/* Recent Updates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium">New Smart Classrooms</div>
                      <div className="text-muted-foreground text-xs">March 20, 2024</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Teacher Training Program</div>
                      <div className="text-muted-foreground text-xs">March 18, 2024</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Digital Assessment Launch</div>
                      <div className="text-muted-foreground text-xs">March 15, 2024</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Schools</span>
                      <span className="font-medium">150+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Students</span>
                      <span className="font-medium">25,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Teachers</span>
                      <span className="font-medium">1,200+</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Digital Education</div>
                    <div className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Teacher Training</div>
                    <div className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Infrastructure</div>
                    <div className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Student Success</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}