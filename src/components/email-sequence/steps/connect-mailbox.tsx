"use client";

import { Mail, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MailboxProvider } from "@/types/email-sequence";

export function ConnectMailbox({
  onConnect,
  onSkip,
}: {
  onConnect: (provider: MailboxProvider) => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Connect your mailbox to start sequencing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Link your email account so we can send sequences on your behalf.
          </p>
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            className="h-14 justify-start gap-3 text-left"
            onClick={() => onConnect("gmail")}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
              <Mail className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Connect Gmail</div>
              <div className="text-xs text-muted-foreground">
                Google Workspace or Gmail account
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-14 justify-start gap-3 text-left"
            onClick={() => onConnect("outlook")}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
              <Mail className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Connect Outlook</div>
              <div className="text-xs text-muted-foreground">
                Microsoft 365 or Outlook account
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-14 justify-start gap-3 text-left"
            onClick={() => onConnect("smtp")}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Server className="size-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Connect SMTP</div>
              <div className="text-xs text-muted-foreground">
                Any email provider via SMTP
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-14 justify-start gap-3 text-left"
            onClick={() => onConnect("ses")}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
              <Mail className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Connect Amazon SES</div>
              <div className="text-xs text-muted-foreground">
                AWS Simple Email Service
              </div>
            </div>
          </Button>
        </div>

        <div className="space-y-2">
          <button className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Having trouble connecting?
          </button>
          <div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Do this later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
