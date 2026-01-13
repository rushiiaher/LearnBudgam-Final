'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { BlogPost, deleteBlog, BlogCategory } from '../_actions/blog-actions';
import { useState } from 'react';
import { BlogDialog } from './blog-dialog';
import Image from 'next/image';

export function BlogTable({
    blogs,
    categories
}: {
    blogs: BlogPost[],
    categories: BlogCategory[]
}) {
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlog(id);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No blog posts found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        <div className="h-10 w-16 relative bg-gray-100 rounded overflow-hidden">
                                            {blog.image_path ? (
                                                <Image
                                                    src={blog.image_path}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate" title={blog.title}>
                                        {blog.title}
                                    </TableCell>
                                    <TableCell>{blog.category_name}</TableCell>
                                    <TableCell>{blog.author}</TableCell>
                                    <TableCell>
                                        {new Date(blog.published_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100"
                                                onClick={() => setEditingBlog(blog)}
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100"
                                                onClick={() => handleDelete(blog.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {editingBlog && (
                <BlogDialog
                    categories={categories}
                    blogToEdit={editingBlog}
                    onOpenChange={(open) => !open && setEditingBlog(null)}
                />
            )}
        </>
    );
}
