"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import { BlogPost, BlogCategory } from "@/app/dashboard/blogs/_actions/blog-actions"
import Link from "next/link"
import Image from "next/image"

export function BlogList({
    initialBlogs,
    categories
}: {
    initialBlogs: BlogPost[],
    categories: BlogCategory[]
}) {
    const [selectedCategory, setSelectedCategory] = useState("All")

    const filteredPosts = selectedCategory === "All"
        ? initialBlogs
        : initialBlogs.filter(post => post.category_name === selectedCategory)

    return (
        <>
            {/* Category Filter */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        variant={selectedCategory === "All" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("All")}
                        className="text-sm"
                    >
                        All
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.name ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.name)}
                            className="text-sm"
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="lg:w-2/3">
                    <div className="space-y-6">
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No posts found in this category.
                            </div>
                        ) : (
                            filteredPosts.map((post, index) => (
                                <div key={post.id} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                                        {index < filteredPosts.length - 1 && <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>}
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="flex-1 group">
                                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/4 aspect-video md:aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                                    {post.image_path ? (
                                                        <Image
                                                            src={post.image_path}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                                            <span className="text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="md:w-3/4 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-semibold uppercase tracking-wider">
                                                                {post.category_name}
                                                            </span>
                                                        </div>
                                                        <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                            {post.title}
                                                        </CardTitle>
                                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="h-3.5 w-3.5" />
                                                                <span>{post.author}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/5 -mr-2">
                                                            Read More &rarr;
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-6">
                    {/* Recent Updates - Hardcoded or Dynamic? User asked for dynamic blog fields, 
              but Recent Updates block in original file looked like 'News'. 
              I'll just populate it with the latest 3 blogs for now to be dynamic. */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {initialBlogs.slice(0, 5).map(post => (
                                <div className="text-sm" key={post.id}>
                                    <div className="font-medium line-clamp-1">{post.title}</div>
                                    <div className="text-muted-foreground text-xs">{new Date(post.published_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Categories List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`text-sm cursor-pointer transition-colors ${selectedCategory === category.name
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-primary"
                                        }`}
                                    onClick={() => setSelectedCategory(category.name)}
                                >
                                    {category.name}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
