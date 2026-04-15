import { BriefcaseBusiness } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground">Create and manage job postings.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BriefcaseBusiness className="mb-4 size-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No jobs posted</h3>
          <p className="text-sm text-muted-foreground">
            Job postings will appear here once created.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
