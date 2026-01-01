"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  School,
  BarChartBig as ChartBar,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = ['/banner1.jpg', '/banner2.jpg']

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const stats = [
    { value: "15", label: "Schools Digitized" },
    { value: "8,500+", label: "Students Enrolled" },
    { value: "450+", label: "Teachers Empowered" },
    { value: "100%", label: "Digital Coverage" },
  ]

  const features = [
    {
      icon: ChartBar,
      title: "Smart School Management",
      description: "Streamlined administration and resource management for efficient operations.",
    },
    {
      icon: Calendar,
      title: "Digital Attendance",
      description: "Real-time attendance tracking for students and staff with instant notifications.",
    },
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Comprehensive academic tracking, grading, and performance analytics.",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Seamless communication between teachers, students, and parents.",
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      description: "Data-driven insights and detailed reports for informed decision-making.",
    },
    {
      icon: Users,
      title: "Parent Portal",
      description: "Keep parents engaged with their child's educational journey.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-accent to-primary py-24 md:py-48 lg:py-72 overflow-hidden" style={{ minHeight: '400px' }}>
          {/* Background Images */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100%'
              }}
            />
          ))}
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all fixed-position"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all fixed-position"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === 0 ? 'opacity-100 bg-black/40' : 'opacity-0'
            }`}></div>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === 1 ? 'opacity-100' : 'opacity-0'
            }`}></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground px-12 sm:px-0">
              {currentImage === 0 ? (
                <div className="overflow-hidden whitespace-nowrap">
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 inline-block animate-marquee">
                    Wᴇʟᴄᴏᴍᴇ ᴛᴏ Tʜᴇ Uɴɪꜰɪᴇᴅ Dɪɢɪᴛᴀʟ Sᴄʜᴏᴏʟ Pʟᴀᴛꜰᴏʀᴍ ᴏꜰ Bᴜᴅɢᴀᴍ
                  </h1>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 font-medium text-balance leading-relaxed">
                    Smart Digital Schools for Modern Education<br />
                    Powered by Technology & Centralized Management
                  </p>
                  <style jsx>{`
                    @keyframes marquee {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                    .animate-marquee {
                      animation: marquee 18s linear infinite;
                      transform: translateX(100%);
                    }
                  `}</style>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance">Inspire • Connect • Ignite</h1>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 font-medium text-balance leading-relaxed">A welcoming community that inspires possibilities, connects people, and ignites learning!</p>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
                <Link href="/schools">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    <School className="mr-3 h-6 w-6" />
                    Explore Schools
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <GraduationCap className="mr-3 h-6 w-6" />
                    Access Digital Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Transforming Education Through Technology
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left side - Schools List */}
              <div>
                <h3 className="text-2xl font-bold mb-6 underline decoration-2 decoration-blue-500">OUR SCHOOLS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { name: "Hr.sec school shagopora", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
                    { name: "GHSS Chararsharief", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
                    { name: "MS Kultreh", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" },
                    { name: "MS Ohangam", color: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" },
                    { name: "MS Thazwooder", color: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" },
                    { name: "HS Dharmuna", color: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" },
                    { name: "MS Shankerpora", color: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100" },
                    { name: "BMS Chararsharief", color: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100" },
                    { name: "BMS Khansahib", color: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100" },
                    { name: "HSS Wagar", color: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100" },
                    { name: "HSS Kanir", color: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100" },
                    { name: "HSS Gogjipathri", color: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100" },
                    { name: "HS Rawalpora", color: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100" },
                    { name: "HS Raiyar Ich", color: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100" },
                    { name: "HS Dreygam", color: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100" },
                  ].map((school, i) => (
                    <div
                      key={i}
                      className={`${school.color} p-4 rounded-xl border transition-all duration-300 flex items-center justify-center text-center h-full min-h-[100px] shadow-sm hover:shadow-md cursor-default`}
                    >
                      <span className="font-semibold text-sm md:text-base leading-tight">{school.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex items-center justify-center pt-12">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-justify">
                    School Education is an important segment of the educational delivery system considerably contributing to the development scenario in the State. While elementary education provides the basis that's reinforced at the secondary tier, the plus two constitutes a core component where the teeming thousands of young boys and girls fan out into different career choices and options. In recent years, School Education has recorded an unprecedented thrust, particularly in the elementary segment. The SSA now Samagra Shiksha has come as a boon, as it were, unleashing a series of initiatives seeking universal enrolment and retention, reduction of social, regional and gender gaps, mainstreaming of the children with special needs and promotion of quality parameters.
                  </p>

                  <Link href="/about">
                    <Button variant="default">
                      Learn More About Our Mission
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 mt-12"></div>
          </div>
        </section>



        {/* Features Boxes Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center h-96 group overflow-hidden relative touch-manipulation focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0}>
                <img
                  src="/manoj.jpg"
                  alt="Manoj Sinha"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-3">Manoj Sinha (Lieutenant Governor)</h3>
                <div className="absolute inset-0 bg-white p-6 text-center transform translate-y-full hover:translate-y-0 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 overflow-y-auto">
                  <img
                    src="/manoj.jpg"
                    alt="Manoj Sinha"
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                  />
                  <h3 className="text-sm font-semibold mb-2">Manoj Sinha (Lieutenant Governor)</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">Manoj Sinha (born 1 July 1959) is an Indian politician serving as the 2nd and the current lieutenant governor of Jammu and Kashmir. He served as the minister of state for Communications (independent charge) and minister of state for Railways in the government of India. Sinha was elected to the Lok Sabha, representing Ghazipur parliamentary constituency for three terms from the Bharatiya Janata Party. Sinha was in the race for the post of Uttar Pradesh chief minister after the 2017 Uttar Pradesh Legislative Assembly election.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center h-96 group overflow-hidden relative touch-manipulation focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0}>
                <img
                  src="/education minister.jpg"
                  alt="Sakina Masood Itoo"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-3">Sakina Masood Itoo (Education Minister)</h3>
                <div className="absolute inset-0 bg-white p-6 text-center transform translate-y-full hover:translate-y-0 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 overflow-y-auto">
                  <img
                    src="/education minister.jpg"
                    alt="Sakina Masood Itoo"
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                  />
                  <h3 className="text-sm font-semibold mb-2">Sakina Masood Itoo (Education Minister)</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">Sakina Masood Itoo (born 5 December 1970) is an Indian politician affiliated to the Jammu & Kashmir National Conference. She is currently the Cabinet minister for Education, Health & Medical Education and Social Welfare in the union territory of Jammu and Kashmir. She has served as cabinet minister of erstwhile state of the Jammu and Kashmir. She has also served as minister for several departments, including Social Welfare, Ari Trainings and Public Grievances, Education, Tourism, Floriculture, Public Works, and PHE among others. She was only 26 years old when she won her first assembly election in 1996. She has won "Best MLA Award" in 2012 for her contribution to her constituency.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center h-96 group overflow-hidden relative touch-manipulation focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0}>
                <img
                  src="/dc.jpg"
                  alt="Dr. Bilal Mohi-ud-Din Bhat"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-3">Dr. Bilal Mohi-ud-Din Bhat (DC, Budgam)</h3>
                <div className="absolute inset-0 bg-white p-6 text-center transform translate-y-full hover:translate-y-0 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 overflow-y-auto">
                  <img
                    src="/dc.jpg"
                    alt="Dr. Bilal Mohi-ud-Din Bhat"
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                  />
                  <h3 className="text-sm font-semibold mb-2">Dr. Bilal Mohi-ud-Din Bhat (DC, Budgam)</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">Dr. Bilal Mohi-ud-Din Bhat is the Deputy Commissioner (DC) of Budgam district in the Union Territory of Jammu & Kashmir. He assumed charge as DC Budgam in June 2025, taking over the responsibilities of the district's chief administrative officer. As DC, Dr. Bhat is the senior most administrative officer in Budgam, responsible for overall governance, development, public welfare, law and order, and coordination of government departments in the district.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center h-96 group overflow-hidden relative touch-manipulation focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0}>
                <img
                  src="/Cheif-Education-Officer-Budgam.png"
                  alt="Mtr Rifat Irfan Qadri"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-3">Mtr Rifat Irfan Qadri (CEO, Budgam)</h3>
                <div className="absolute inset-0 bg-white p-6 text-center transform translate-y-full hover:translate-y-0 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 overflow-y-auto">
                  <img
                    src="/Cheif-Education-Officer-Budgam.png"
                    alt="Mtr Rifat Irfan Qadri"
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                  />
                  <h3 className="text-sm font-semibold mb-2">Mtr Rifat Irfan Qadri (CEO, Budgam)</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">Mtr Rifat Irfan Qadri heads the Chief Education Office in Budgam. She leads a team committed to shaping a future filled with opportunities for children, believing education extends beyond knowledge to nurturing character and curiosity. Her vision is to build an inclusive, equitable educational ecosystem of global standards, modernizing infrastructure and supporting educators to cultivate resilient, innovative, and compassionate leaders.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Features Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {/* Enrollment */}
            <div className="bg-green-100 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-green-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Enrollment</span>
            </div>

            {/* Calendar */}
            <div className="bg-yellow-100 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-yellow-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Calendar</span>
            </div>

            {/* Schools */}
            <div className="bg-green-200 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-green-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Schools</span>
            </div>

            {/* Resources */}
            <div className="bg-purple-100 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-purple-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Resources</span>
            </div>

            {/* Board */}
            <div className="bg-amber-50 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-amber-100 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Board</span>
            </div>

            {/* Announcements */}
            <div className="bg-blue-100 py-12 px-4 flex flex-col items-center justify-center text-center hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 mb-4">
                <svg className="w-full h-full text-blue-900 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Announcements</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Digital Features</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Comprehensive digital tools designed to enhance every aspect of the educational experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
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
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/features">
                <Button variant="outline" size="lg">
                  View All Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Excellence Section */}
        <section className="py-6 md:py-10 bg-teal-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M15 10h2v8h-2V10zm8 0h2v8h-2V10zm8 0h2v8h-2V10zm-16 12h2v8h-2v-8zm8 0h2v8h-2v-8zm8 0h2v8h-2v-8zm-16 12h2v8h-2v-8zm8 0h2v8h-2v-8zm8 0h2v8h-2v-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-2xl p-8 md:p-12 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Column - Text */}
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-teal-800 mb-6 leading-tight">
                    Achieving excellence by<br />nurturing a love of learning!
                  </h2>
                  <div className="w-24 h-1 bg-teal-600 mb-6"></div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    A district where all students are welcomed, valued, engaged and excited about learning. Students graduate with excellence in critical thinking, a love of learning and are prepared to move successfully in the world and life. Every staff member, working as a team, helps to create a community of continuous learning, equity and opportunity for all.
                  </p>
                </div>

                {/* Right Column - Image */}
                <div>
                  <img
                    src="/2nd.jpg"
                    alt="Teacher interacting with students in classroom"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
