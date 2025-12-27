import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Download } from "lucide-react"
import Link from "next/link"

export default function TextbookPage() {
  const textbooks = [
    { id: 1, title: "Mathematics Class 10", subject: "Mathematics", class: "10", format: "PDF" },
    { id: 2, title: "Science Class 9", subject: "Science", class: "9", format: "PDF" },
    { id: 3, title: "English Class 8", subject: "English", class: "8", format: "PDF" },
    { id: 4, title: "Social Studies Class 7", subject: "Social Studies", class: "7", format: "PDF" },
    { id: 5, title: "Hindi Class 6", subject: "Hindi", class: "6", format: "PDF" },
    { id: 6, title: "Urdu Class 5", subject: "Urdu", class: "5", format: "PDF" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-accent py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Digital Textbooks</h1>
              <p className="text-lg md:text-xl opacity-90">
                Access digital textbooks for all classes and subjects
              </p>
            </div>
          </div>
        </section>

        {/* Textbooks Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textbooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">Class {book.class} • {book.subject}</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download {book.format}
                    </Button>
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