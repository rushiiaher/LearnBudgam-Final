import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-accent to-primary py-12 md:py-16" style={{backgroundImage: 'url(/AA.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">About Us</h1>
              <p className="text-lg md:text-xl opacity-90 text-pretty leading-relaxed">
                Dedicated to transforming education in Budgam district through innovative policies, quality infrastructure, and comprehensive support for students, teachers, and educational institutions.
              </p>
            </div>
          </div>
        </section>

        {/* About Us Content Section */}
        <section className="py-4 md:py-6 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-8 md:p-12">
                {/* Page Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">Education</h1>
                
                {/* Primary Section Title */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-serif text-blue-800 mb-2">Chief Education Office Budgam</h2>
                  <div className="w-full h-0.5 bg-blue-800"></div>
                </div>
                
                {/* Introductory Paragraph */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8 text-left">
                  Welcome to the about us page of the Chief Education Office (CEO), Budgam. Our office stands as the central hub for implementing, monitoring, and supervising all educational policies and programs across the Budgam district of Jammu and Kashmir. We are dedicated to nurturing an environment where every child has the opportunity to thrive academically, creatively, and socially. Our commitment is to elevate educational standards, promote inclusivity, and ensure that our schools serve as pillars of knowledge and community development.
                </p>
                
                {/* Section Divider */}
                <hr className="border-gray-300 my-8" />
                
                {/* Mission & Vision Section */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-8 bg-blue-600 mr-4"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission & Vision</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Mission */}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Mission:</h4>
                        <p className="text-gray-700 leading-relaxed">To ensure equitable and inclusive access to quality education for every child in the Budgam district. We strive to provide a robust learning environment that fosters critical thinking, problem-solving skills, and a strong sense of civic responsibility.</p>
                      </div>
                    </div>
                    
                    {/* Vision */}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Vision:</h4>
                        <p className="text-gray-700 leading-relaxed">To create an innovative, technologically-advanced, and highly effective educational ecosystem that not only produces literate individuals but also empowers them to become leaders and innovators who contribute positively to society.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Key Initiatives */}
        <section className="py-1 md:py-2 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">Key Initiatives</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>

              <div className="space-y-4">
                {[
                  {
                    title: "Digital Education for All",
                    description: "Launched a comprehensive program to equip schools with smart boards and computer labs. This initiative aims to integrate technology into the learning process, making education more interactive and accessible, particularly in remote areas."
                  },
                  {
                    title: "\"Hamara Gaon, Hamara Vidyalaya\" (Our Village, Our School)",
                    description: "A community-based initiative focused on improving school infrastructure and cleanliness. By involving local Panchayats and community leaders, we have fostered a sense of collective ownership, leading to visible improvements in school environments."
                  },
                  {
                    title: "Teacher Professional Development",
                    description: "Regular workshops and training sessions are conducted to empower teachers with modern pedagogical techniques, subject-specific knowledge, and soft skills. Our goal is to create a highly skilled and motivated teaching workforce."
                  },
                  {
                    title: "Career Guidance & Counseling",
                    description: "In collaboration with career experts, we have established dedicated counseling sessions for high school students. This initiative helps them make informed decisions about their future academic and professional paths."
                  },
                  {
                    title: "Environmental Awareness Program",
                    description: "Promoting eco-friendly practices in schools through plantation drives, waste management campaigns, and environmental clubs. This initiative instills a sense of responsibility towards the planet in our young learners."
                  }
                ].map((initiative, index) => (
                  <Card key={index} className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-800 mb-2 border-b border-blue-600 pb-2">{initiative.title}:</h3>
                        <p className="text-muted-foreground">{initiative.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Functions */}
        <section className="py-1 md:py-2">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">Our Key Functions</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
              
              <p className="text-lg text-muted-foreground mb-8 text-center">
                The CEO Budgam's responsibilities are diverse and crucial to the educational landscape of the district. We serve as the primary link between government policies and their on-ground implementation. Our key functions include:
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Administrative Oversight",
                    description: "Managing all administrative affairs of government and private educational institutions, including staff appointments, promotions, and resource allocation."
                  },
                  {
                    title: "Policy Implementation",
                    description: "Effectively executing all educational schemes and initiatives launched by the state and central governments, such as Sarva Shiksha Abhiyan (SSA) and Samagra Shiksha."
                  },
                  {
                    title: "Academic Supervision",
                    description: "Conducting regular inspections and audits to ensure schools adhere to prescribed academic standards, curriculum guidelines, and quality benchmarks."
                  },
                  {
                    title: "Teacher Development",
                    description: "Organizing and facilitating continuous professional development programs, workshops, and training for teachers to enhance their pedagogical skills and keep them updated with modern teaching methodologies."
                  },
                  {
                    title: "Community Engagement",
                    description: "Fostering strong partnerships with parents, community leaders, and local bodies to create a collaborative approach to education and address local needs."
                  }
                ].map((func, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2 border-b border-blue-600 pb-2">{func.title}:</h3>
                        <p className="text-muted-foreground">{func.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
