
export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    roleId: number;
    schoolId: number | null;
    isClassAdmin: boolean;
    role?: {
        id: number;
        name: string;
    };
    school?: {
        id: number;
        name: string;
    } | null;
};
