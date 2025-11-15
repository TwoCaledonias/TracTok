import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">View your daily revenue, withdrawals, and rewards</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Coming in Phase 4</CardTitle>
          </div>
          <CardDescription>Earnings tracking will be available soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will show your daily revenue, withdrawals, and rewards with export
            capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
