'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export type BlogCategory = {
    id: number;
    name: string;
    created_at: string;
};

export type BlogPost = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_path: string | null;
    category_id: number;
    category_name: string;
    author: string;
    published_at: string;
    created_at: string;
};

// --- Categories ---

export async function getBlogCategories() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM blog_categories ORDER BY name');
        return rows as BlogCategory[];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function createBlogCategory(formData: FormData) {
    const name = formData.get('name') as string;
    if (!name) return { success: false, message: 'Name is required' };

    try {
        await pool.execute('INSERT INTO blog_categories (name) VALUES (?)', [name]);
        revalidatePath('/dashboard/blogs');
        return { success: true, message: 'Category created successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteBlogCategory(id: number) {
    try {
        await pool.execute('DELETE FROM blog_categories WHERE id = ?', [id]);
        revalidatePath('/dashboard/blogs');
        return { success: true, message: 'Category deleted successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// --- Blogs ---

export async function getBlogs(limit?: number) {
    try {
        let query = `
            SELECT b.*, c.name as category_name 
            FROM blogs b
            LEFT JOIN blog_categories c ON b.category_id = c.id
            ORDER BY b.published_at DESC, b.created_at DESC
        `;
        const params: any[] = [];

        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return rows as BlogPost[];
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return [];
    }
}

export async function getBlogById(id: number) {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT b.*, c.name as category_name 
            FROM blogs b
            LEFT JOIN blog_categories c ON b.category_id = c.id
            WHERE b.id = ?
        `, [id]);
        return (rows[0] as BlogPost) || null;
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return null;
    }
}

export async function createBlog(formData: FormData) {
    const title = formData.get('title') as string;
    const category_id = formData.get('category_id') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const published_at = formData.get('published_at') as string;
    const imageFile = formData.get('image_file') as File | null;

    if (!title || !category_id) {
        return { success: false, message: 'Title and Category are required.' };
    }

    let image_path = null;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
        const uploadDir = path.resolve(process.cwd(), 'public/uploads/blogs');

        // Ensure dir exists (usually good to check, assuming standard public/uploads structure)
        // await mkdir(uploadDir, { recursive: true }); 

        await writeFile(path.join(uploadDir, fileName), buffer);
        image_path = `/uploads/blogs/${fileName}`;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
        await pool.execute(
            `INSERT INTO blogs (title, slug, excerpt, content, category_id, author, published_at, image_path) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, excerpt, content, parseInt(category_id), author, published_at || new Date(), image_path]
        );
        revalidatePath('/dashboard/blogs');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post created successfully.' };
    } catch (error: any) {
        console.error('Create blog error:', error);
        return { success: false, message: 'Failed to create blog post.' };
    }
}

export async function updateBlog(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const category_id = formData.get('category_id') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const published_at = formData.get('published_at') as string;
    const imageFile = formData.get('image_file') as File | null;

    let image_path = undefined;
    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
        const uploadDir = path.resolve(process.cwd(), 'public/uploads/blogs');
        await writeFile(path.join(uploadDir, fileName), buffer);
        image_path = `/uploads/blogs/${fileName}`;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
        let query = 'UPDATE blogs SET title=?, slug=?, excerpt=?, content=?, category_id=?, author=?, published_at=?';
        const params: any[] = [title, slug, excerpt, content, parseInt(category_id), author, published_at];

        if (image_path) {
            query += ', image_path=?';
            params.push(image_path);
        }

        query += ' WHERE id=?';
        params.push(id);

        await pool.execute(query, params);
        revalidatePath('/dashboard/blogs');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post updated successfully.' };
    } catch (error: any) {
        console.error('Update blog error:', error);
        return { success: false, message: 'Failed to update blog post.' };
    }
}

export async function deleteBlog(id: number) {
    try {
        // Optionally delete image file here too if needed
        await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
        revalidatePath('/dashboard/blogs');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete blog post.' };
    }
}
