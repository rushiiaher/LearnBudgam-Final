import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Academic Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3.4/5.0</div>
                    <p className="text-xs text-muted-foreground">
                        2 ratings from parents
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Behavioral Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.2/5.0</div>
                    <p className="text-xs text-muted-foreground">
                        1 ratings from parents
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Overall Satisfaction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2.3/5.0</div>
                    <p className="text-xs text-muted-foreground">
                        1 ratings from parents
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
