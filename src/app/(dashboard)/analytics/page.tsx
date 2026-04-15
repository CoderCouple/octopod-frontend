import { BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your recruitment metrics.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="mb-4 size-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No data available</h3>
          <p className="text-sm text-muted-foreground">
            Analytics will populate as you add candidates and jobs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
