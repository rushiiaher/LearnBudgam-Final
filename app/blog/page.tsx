"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import { useState } from "react"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Academics", "Announcements", "Technology", "Student Life", "Teacher Training"]

  const blogPosts = [
    {
      id: 1,
      title: "Why the First Year of Middle School Feels Confusing",
      excerpt: "For many students, Class 6 is the first time studies feel serious. New subjects, new teachers, and longer books can feel overwhelming. This confusion is normal. Students who slowly adjust their routine and don't panic usually perform better by the end of the year.",
      author: "Academic Team",
      date: "December 25, 2023",
      image: "/1st.jpg",
      category: "Academics"
    },
    {
      id: 2,
      title: "Exams Are a Learning Tool, Not a Threat",
      excerpt: "Students first face serious exams in Class 6. By Class 7, exams feel routine. In Class 8, exams help students understand their strengths before entering higher classes.",
      author: "Education Team",
      date: "March 15, 2024",
      image: "/1.jpg",
      category: "Academics"
    },
    {
      id: 3,
      title: "I Often See Students Losing Marks for Simple Reasons",
      excerpt: "In Class 7, many students know the answers but still lose marks. The reason is usually small mistakes — not reading questions properly or writing unclear answers. These mistakes are avoidable with a little attention and practice.",
      author: "Evaluation Team",
      date: "December 20, 2023",
      image: "/2nd.jpg",
      category: "Student Life"
    },
    {
      id: 4,
      title: "Smart School Initiative: A New Future for Budgam Students",
      excerpt: "The Smart School Initiative in Budgam aims to modernize traditional classrooms using technology-driven solutions. Features like live online classes, digital exams, performance tracking, and real-time communication have created a smarter and more efficient education ecosystem.",
      author: "Admin Team",
      date: "March 10, 2024",
      image: "/2.jpg",
      category: "Announcements"
    },
    {
      id: 5,
      title: "When Studies Start Feeling Heavy",
      excerpt: "Class 8 is often the point where students feel real academic pressure. Syllabus becomes deeper and expectations increase. Students who stay regular and don't delay revision manage this phase much better.",
      author: "Guidance Team",
      date: "December 15, 2023",
      image: "/3rd.jpg",
      category: "Student Life"
    },
    {
      id: 6,
      title: "Role of Teachers in Digital Transformation of Budgam Schools",
      excerpt: "Teachers play a crucial role in the successful implementation of digital education. In Budgam, teachers are being trained to use smart boards, online teaching tools, and digital assessment methods.",
      author: "Training Department",
      date: "March 5, 2024",
      image: "/3.jpg",
      category: "Teacher Training"
    },
    {
      id: 7,
      title: "Why Daily Study Matters More Than Long Study Hours",
      excerpt: "Studying for many hours on one day and skipping the next rarely works. Learning improves when study becomes a daily habit. Even short daily sessions build confidence over time.",
      author: "Study Team",
      date: "December 10, 2023",
      image: "/7.jpg",
      category: "Student Life"
    },
    {
      id: 8,
      title: "Benefits of Digital School Management for Parents",
      excerpt: "Digital school management systems have empowered parents in Budgam by providing real-time access to attendance, academic performance, homework, and school announcements.",
      author: "Development Team",
      date: "February 28, 2024",
      image: "/4.jpg",
      category: "Technology"
    },
    {
      id: 9,
      title: "Why Many Students Fear Maths Without Reason",
      excerpt: "Maths fear often starts in Class 6 when students face new concepts. The fear is not because Maths is difficult, but because students stop practicing. Regular practice removes fear faster than any shortcut.",
      author: "Math Team",
      date: "December 5, 2023",
      image: "/8.jpg",
      category: "Academics"
    },
    {
      id: 10,
      title: "Bridging the Education Gap in Rural Budgam Through Technology",
      excerpt: "Technology has become a powerful tool in bridging educational gaps in rural areas of Budgam. Online learning platforms and centralized digital systems ensure equal learning opportunities for all students, regardless of location.",
      author: "Community Team",
      date: "February 20, 2024",
      image: "/5.jpg",
      category: "Technology"
    },
    {
      id: 11,
      title: "Reading Again and Again Is Not Enough",
      excerpt: "Many Class 7 students believe that reading chapters multiple times is sufficient. But exams demand written answers. Writing practice helps organise thoughts and improves memory.",
      author: "Learning Team",
      date: "November 30, 2023",
      image: "/D1.jpg",
      category: "Academics"
    },
    {
      id: 12,
      title: "The Silent Pressure Students Don't Talk About",
      excerpt: "By Class 8, many students feel pressure but don't express it. They worry about expectations, marks, and future classes. Open discussion and proper guidance reduce this stress significantly.",
      author: "Counseling Team",
      date: "November 25, 2023",
      image: "/9.jpg",
      category: "Student Life"
    },
    {
      id: 13,
      title: "Good Handwriting Is Not About Beauty",
      excerpt: "Neat handwriting helps examiners understand answers easily. It also shows discipline. Good presentation reflects clear thinking and helps students express their knowledge effectively.",
      author: "Skills Team",
      date: "November 20, 2023",
      image: "/10.jpg",
      category: "Academics"
    },
    {
      id: 14,
      title: "Why Comparing Marks Does More Harm Than Good",
      excerpt: "In Class 7, students start comparing marks with friends. This comparison often lowers confidence. Every student learns differently. Improvement matters more than comparison.",
      author: "Motivation Team",
      date: "November 15, 2023",
      image: "/12.jpg",
      category: "Student Life"
    },
    {
      id: 15,
      title: "Revision Is the Most Ignored Part of Studying",
      excerpt: "Many students finish the syllabus but forget to revise. In Class 8, this habit becomes a serious problem. Regular revision reduces exam stress and improves performance significantly.",
      author: "Revision Team",
      date: "November 10, 2023",
      image: "/13.jpg",
      category: "Academics"
    }
  ]

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

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

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        {index < filteredPosts.length - 1 && <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>}
                      </div>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex-1">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 aspect-video md:aspect-[4/3] bg-gray-100">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {post.category}
                              </span>
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
                    {categories.slice(1).map((category) => (
                      <div 
                        key={category}
                        className={`text-sm cursor-pointer transition-colors ${
                          selectedCategory === category 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
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