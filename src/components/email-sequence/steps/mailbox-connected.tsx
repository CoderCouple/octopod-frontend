"use client";

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mailbox } from "@/types/email-sequence";

export function MailboxConnected({
  mailbox,
  onNext,
}: {
  mailbox: Mailbox;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Mailbox connected
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your email account has been linked successfully.
          </p>
        </div>

        <Badge variant="secondary" className="text-sm">
          {mailbox.email_address}
        </Badge>

        <div>
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
          >
            Next, review mailbox settings
          </Button>
        </div>
      </div>
    </div>
  );
}
