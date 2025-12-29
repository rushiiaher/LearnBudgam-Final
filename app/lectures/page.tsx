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
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-primary to-accent py-16 md:py-24 text-primary-foreground overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                                <PlayCircle className="h-6 w-6 text-white mr-2" />
                                <span className="font-medium text-white">Video Library</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Educational Lectures & Events</h1>
                            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
                                Explore our collection of video lectures, events, and educational content from Budgam schools.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Videos Grid */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
