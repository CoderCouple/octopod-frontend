"use client";

import { useCallback, useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  MoreHorizontal,
  Plug,
  PlugZap,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteMailbox,
  listMailboxes,
  testMailbox,
} from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { Mailbox, MailboxProvider } from "@/types/email-sequence";

function providerLabel(provider: MailboxProvider): string {
  switch (provider) {
    case "gmail":
      return "Gmail";
    case "outlook":
      return "Outlook";
    case "smtp":
      return "SMTP";
    case "ses":
      return "AWS SES";
    default:
      return provider;
  }
}

function StatusPill({ status }: { status: Mailbox["status"] }) {
  switch (status) {
    case "connected":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="mr-1 size-3" />
          Connected
        </Badge>
      );
    case "rate_limited":
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Rate limited
        </Badge>
      );
    case "error":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <AlertCircle className="mr-1 size-3" />
          Error
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMailboxes = useCallback(async () => {
    try {
      const page = await listMailboxes({ limit: 100 });
      setMailboxes(page.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load mailboxes");
      setMailboxes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMailboxes();
  }, [fetchMailboxes]);

  async function handleTest(mb: Mailbox) {
    setTestingId(mb.id);
    try {
      const result = await testMailbox(mb.id);
      if (result.success) {
        toast.success(result.message || "Connection OK");
      } else {
        toast.error(result.message || "Connection failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test failed");
    } finally {
      setTestingId(null);
    }
  }

  async function handleDisconnect(mb: Mailbox) {
    if (!confirm(`Disconnect ${mb.email_address}?`)) return;
    setDeletingId(mb.id);
    try {
      await deleteMailbox(mb.id);
      toast.success("Mailbox disconnected");
      fetchMailboxes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disconnect");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <Inbox className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Mailboxes</h1>
              <p className="text-sm text-muted-foreground">
                Sending accounts connected to your workspace.
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
        >
          <a href="/email-sequence">
            <Plus className="mr-2 size-4" />
            Connect mailbox
          </a>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : mailboxes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Plug className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No mailboxes connected
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Connect a Gmail, Outlook, SMTP, or SES mailbox to send emails.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {mailboxes.map((mb) => {
            const capacityUsed = mb.sends_today;
            const capacityLimit = mb.warmup_enabled
              ? Math.min(mb.daily_send_limit, mb.warmup_current_limit)
              : mb.daily_send_limit;
            const pct =
              capacityLimit > 0 ? (capacityUsed / capacityLimit) * 100 : 0;

            return (
              <Card key={mb.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                        <Mail className="size-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">
                          {mb.display_name || mb.email_address}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {mb.display_name ? mb.email_address : providerLabel(mb.provider)}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 opacity-0 group-hover:opacity-100"
                          disabled={testingId === mb.id || deletingId === mb.id}
                        >
                          {(testingId === mb.id || deletingId === mb.id) ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="size-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleTest(mb)}>
                          <PlugZap className="mr-2 size-3.5" />
                          Test connection
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDisconnect(mb)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="mr-2 size-3.5" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center gap-2">
                    <StatusPill status={mb.status} />
                    <Badge variant="outline" className="text-xs">
                      {providerLabel(mb.provider)}
                    </Badge>
                    {mb.warmup_enabled && (
                      <Badge variant="outline" className="text-xs">
                        Warming up
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Today&apos;s sends
                      </span>
                      <span className="font-medium">
                        {capacityUsed} / {capacityLimit}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 100
                            ? "bg-red-500"
                            : pct >= 80
                              ? "bg-yellow-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  {mb.error_message && (
                    <p className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                      {mb.error_message}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
