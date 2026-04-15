import { Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground">Manage your candidate pipeline.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="mb-4 size-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No candidates yet</h3>
          <p className="text-sm text-muted-foreground">
            Candidates will appear here once added.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
