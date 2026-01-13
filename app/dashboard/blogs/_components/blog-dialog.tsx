'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createBlog, updateBlog, BlogCategory, BlogPost } from '../_actions/blog-actions';
import { Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export function BlogDialog({
    categories,
    blogToEdit,
    onOpenChange
}: {
    categories: BlogCategory[],
    blogToEdit?: BlogPost | null,
    onOpenChange?: (open: boolean) => void
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(blogToEdit?.category_id.toString() || '');

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Append Category ID (Select component doesn't submit naturally)
        if (selectedCategory) {
            formData.set('category_id', selectedCategory);
        }

        const res = blogToEdit
            ? await updateBlog(blogToEdit.id, formData)
            : await createBlog(formData);

        if (res.success) {
            setLoading(false);
            handleOpenChange(false);
        } else {
            setLoading(false);
            alert(res.message);
        }
    };

    return (
        <Dialog open={blogToEdit ? true : open} onOpenChange={handleOpenChange}>
            {!blogToEdit && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{blogToEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={blogToEdit?.title} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Published Date</Label>
                            <Input
                                id="published_at"
                                name="published_at"
                                type="date"
                                defaultValue={blogToEdit?.published_at ? new Date(blogToEdit.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" name="author" defaultValue={blogToEdit?.author || 'Admin Team'} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                        <Textarea id="excerpt" name="excerpt" defaultValue={blogToEdit?.excerpt} rows={3} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" defaultValue={blogToEdit?.content} rows={10} className="font-mono text-sm" required />
                        <p className="text-xs text-muted-foreground">HTML or Markdown content supported.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image_file">Cover Image</Label>
                        <div className="flex items-center gap-4">
                            <Input id="image_file" name="image_file" type="file" accept="image/*" />
                            {blogToEdit?.image_path && (
                                <div className="text-xs text-muted-foreground">
                                    Current: <a href={blogToEdit.image_path} target="_blank" className="underline">View</a>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {blogToEdit ? 'Update Post' : 'Publish Post'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
