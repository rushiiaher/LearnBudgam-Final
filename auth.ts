import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/definitions"
import { RowDataPacket } from "mysql2"

async function getUser(email: string): Promise<User | undefined> {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT u.*, r.name as role_name, cap.id as class_admin_profile_id 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             LEFT JOIN class_admin_profiles cap ON u.id = cap.user_id
             WHERE u.email = ?`,
            [email]
        );

        if (rows.length === 0) return undefined;

        const row = rows[0];

        // Transform the raw row data to match the User type
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            roleId: row.role_id,
            schoolId: row.school_id,
            isClassAdmin: !!row.class_admin_profile_id,
            role: {
                id: row.role_id,
                name: row.role_name
            },
            // Assuming school handling might be needed later, for now optional
            school: row.school_id ? { id: row.school_id, name: '' } : null
        } as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password || '');
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
