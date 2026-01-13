import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ParentsPage() {
    return (
        <div className="flex h-[80vh] w-full items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Construction className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Manage Parents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This feature is currently under development.
                        Please check back soon for updates regarding parent management functionality.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
