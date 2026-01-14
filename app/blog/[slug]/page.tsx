import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getBlogBySlug } from "../../dashboard/blogs/_actions/blog-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await getBlogBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
                    <div className="mb-8">
                        <Link href="/blog">
                            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {post.category_name}
                            </span>
                            <span className="text-muted-foreground text-sm">•</span>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>By {post.author}</span>
                        </div>
                    </div>

                    {post.image_path && (
                        <div className="relative w-full aspect-video md:aspect-[21/9] mb-10 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                            <Image
                                src={post.image_path}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}
