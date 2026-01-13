import { getBlogs, getBlogCategories } from './_actions/blog-actions';
import { BlogTable } from './_components/blog-table';
import { BlogDialog } from './_components/blog-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ListFilter } from 'lucide-react';

export default async function BlogsPage() {
    const [blogs, categories] = await Promise.all([
        getBlogs(),
        getBlogCategories()
    ]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
                    <p className="text-muted-foreground">Create and manage blog posts and news.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/blogs/categories">
                        <Button variant="outline">
                            <ListFilter className="mr-2 h-4 w-4" /> Manage Categories
                        </Button>
                    </Link>
                    <BlogDialog categories={categories} />
                </div>
            </div>

            <BlogTable blogs={blogs} categories={categories} />
        </div>
    );
}
