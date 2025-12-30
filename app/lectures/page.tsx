"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlayCircle } from "lucide-react"

export default function LecturesPage() {
    const videos = [
        {
            id: "H3RqkVWbjnk",
            title: "CEO Budgam addressing Students",
            description: "CEO Budgam Mtr. Romana Qazi Sahiba addressing EVs and Students of Seasonal Bahaks at ShungliPal Bahak."
        },
        {
            id: "7ZRd94DvW1w",
            title: "Educational Facilities in Govt Schools",
            description: "Documentary on Government school girls getting educational facilities more than private schools in Budgam."
        },
        {
            id: "E8Wy3cTwg5k",
            title: "Live Educational Session",
            description: "Special coverage of educational events and activities in Budgam district."
        },
        {
            id: "5tL6SWBnVCg",
            title: "Student Cultural Performance",
            description: "Students of Al-Asma Educational institute Budgam School showcasing their talent on TV."
        },
        {
            id: "yA0FjPIMu-M",
            title: "Jawahar Navodaya Vidyalaya Khanpora",
            description: "An insight into the infrastructure and facilities at JNV Khanpora, District Budgam."
        },
        {
            id: "67OykOSTcZ8",
            title: "Distribution of Study Kits",
            description: "Distribution of study Kits by Mtr. Romana Qazi Sahiba among Bahak Students adjoining Tosamaidan Area."
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Videos Grid */}
                <section className="py-8 md:py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Educational Lectures & Events</h2>
                            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                                Explore our collection of video lectures, events, and educational content from Budgam schools.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((video) => (
                                <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
                                    <div className="relative aspect-video bg-black/5">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    </div>
                                    <CardHeader className="p-6 pb-2">
                                        <CardTitle className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {video.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2">
                                        <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                            {video.description}
                                        </CardDescription>
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
