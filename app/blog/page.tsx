import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogList } from "./_components/blog-list"
import { getBlogs, getBlogCategories } from "../dashboard/blogs/_actions/blog-actions"

export const dynamic = 'force-dynamic'; // Ensure we get fresh data

export default async function BlogPage() {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getBlogCategories()
  ]);

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

            <BlogList initialBlogs={blogs} categories={categories} />

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}