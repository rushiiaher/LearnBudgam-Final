import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function GalleryPage() {
  const galleryImages = [
    {
      title: "Vibrant and Lovely Children Take Part in Har Ghar Tiranga – Zone Nagam.",
      image: "/G1.jpg",
    },
    {
      title: "Cluster Head Kanir led a vibrant Tiranga Rally at HSS Kanir, uniting 1,000+ students and teachers from the Kanir cluster.",
      image: "/G2.jpg",
    },
    {
      title: "Parent-Teacher Meet Held at MS Ringzabal with 100+ Parents, Hon'ble MLA in Attendance",
      image: "/G3.jpg",
    },
    {
      title: "GHSS Hardu Dalwan Hosts Grand PTM and Felicitation Ceremony",
      image: "/G4.jpg",
    },
    {
      title: "CWSN Budgam Students Visit Chinar Book Festival at SKICC",
      image: "/G5.jpg",
    },
    {
      title: "PM Shri High School Sugin Hosts Successful Mass Parent-Teacher Meet with Cultural Showcase",
      image: "/G6.jpg",
    },
    {
      title: "Mass PTM Held at HS Sitharan zone Khag",
      image: "/G7.jpg",
    },
    {
      title: "Mass PTM Held at HS Sitharan zone Khag",
      image: "/G8.jpg",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-accent py-16 md:py-24" style={{backgroundImage: 'url(/GG.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Gallery</h1>
              <p className="text-lg md:text-xl opacity-90 text-pretty leading-relaxed">
                A visual journey through our digitization initiative—classrooms transformed, students empowered
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
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
