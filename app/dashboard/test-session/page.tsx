
import { auth } from "@/auth";

export default async function TestSessionPage() {
    const session = await auth();

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Session Debugger</h1>
            <pre className="bg-gray-100 p-4 rounded overflow-auto border">
                {JSON.stringify(session, null, 2)}
            </pre>
            <div className="text-sm text-gray-500">
                <p>Role ID: {session?.user?.roleId} (Type: {typeof session?.user?.roleId})</p>
                <p>School ID: {session?.user?.schoolId} (Type: {typeof session?.user?.schoolId})</p>
            </div>
        </div>
    );
}
