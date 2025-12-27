import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SchoolsPage() {
  const schools = [
    { id: 1, name: "Hr.sec school shagopora", location: "Shagopora" },
    { id: 2, name: "GHSS Chararsharief", location: "Chararsharief" },
    { id: 3, name: "MS Kultreh", location: "Kultreh" },
    { id: 4, name: "MS Ohangam", location: "Ohangam" },
    { id: 5, name: "MS Thazwooder", location: "Thazwooder" },
    { id: 6, name: "HS Dharmuna", location: "Dharmuna" },
    { id: 7, name: "MS Shankerpora", location: "Shankerpora" },
    { id: 8, name: "BMS Chararsharief", location: "Chararsharief" },
    { id: 9, name: "BMS Khansahib", location: "Khansahib" },
    { id: 10, name: "HSS Wagar", location: "Wagar" },
    { id: 11, name: "HSS Kanir", location: "Kanir" },
    { id: 12, name: "HSS Gogjipathri", location: "Gogjipathri" },
    { id: 13, name: "HS Rawalpora", location: "Rawalpora" },
    { id: 14, name: "HS Raiyar Ich", location: "Raiyar Ich" },
    { id: 15, name: "HS Dreygam", location: "Dreygam" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-accent py-16 md:py-20" style={{backgroundImage: 'url(/SS.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Our Schools</h1>
              <p className="text-lg md:text-xl opacity-90 text-pretty leading-relaxed">
                15 schools across Budgam now equipped with digital infrastructure and modern learning tools
              </p>
            </div>
          </div>
        </section>

        {/* Schools Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {schools.map((school) => (
                <Card key={school.id} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{school.id}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-balance group-hover:text-primary transition-colors">
                      {school.name}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="text-xs">{school.location}</span>
                    </div>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent text-sm"
                      >
                        Visit Portal
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
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
