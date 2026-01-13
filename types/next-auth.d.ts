
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            roleId: number
            schoolId: number | null
            isClassAdmin: boolean
            role?: {
                id: number
                name: string
            }
        } & DefaultSession["user"]
    }

    interface User {
        roleId: number
        schoolId: number | null
        isClassAdmin: boolean
        role?: {
            id: number
            name: string
        }
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        roleId: number
        schoolId: number | null
        isClassAdmin: boolean
        role?: {
            id: number
            name: string
        }
    }
}
