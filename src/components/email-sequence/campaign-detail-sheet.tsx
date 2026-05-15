"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BarChart3,
  Loader2,
  Mail,
  Plus,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  addRecipient,
  getCampaignAnalytics,
  listRecipients,
  deleteRecipient,
} from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CampaignAnalytics,
  CampaignRecipient,
  EmailCampaign,
} from "@/types/email-sequence";

function pct(num: number, denom: number): string {
  if (denom === 0) return "—";
  return `${((num / denom) * 100).toFixed(1)}%`;
}

function StatCard({
  label,
  value,
  ratio,
}: {
  label: string;
  value: number;
  ratio?: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</span>
        {ratio && <span className="text-xs text-muted-foreground">{ratio}</span>}
      </div>
    </div>
  );
}

function RecipientRow({
  recipient,
  onRemove,
  removing,
}: {
  recipient: CampaignRecipient;
  onRemove: (id: string) => void;
  removing: boolean;
}) {
  const fullName = [recipient.first_name, recipient.last_name]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/40">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {fullName || recipient.email}
          </span>
          <Badge variant="outline" className="text-xs">
            {recipient.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {fullName ? recipient.email : ""}
          {recipient.company && fullName && (
            <>
              <span className="mx-1.5 text-muted-foreground/50">·</span>
              {recipient.company}
            </>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-red-600"
        onClick={() => onRemove(recipient.id)}
        disabled={removing}
      >
        {removing ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

export function CampaignDetailSheet({
  campaign,
  open,
  onOpenChange,
}: {
  campaign: EmailCampaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [recipients, setRecipients] = useState<CampaignRecipient[]>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const [draftFirstName, setDraftFirstName] = useState("");
  const [draftLastName, setDraftLastName] = useState("");
  const [draftCompany, setDraftCompany] = useState("");
  const [draftTitle, setDraftTitle] = useState("");

  const fetchData = useCallback(async () => {
    if (!campaign) return;
    setRecipientsLoading(true);
    setAnalyticsLoading(true);
    try {
      const [page, stats] = await Promise.all([
        listRecipients(campaign.id, { limit: 200 }),
        getCampaignAnalytics(campaign.id).catch(() => null),
      ]);
      setRecipients(page.items);
      setAnalytics(stats);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setRecipientsLoading(false);
      setAnalyticsLoading(false);
    }
  }, [campaign]);

  useEffect(() => {
    if (open && campaign) {
      fetchData();
    } else {
      setRecipients([]);
      setAnalytics(null);
      setAddOpen(false);
    }
  }, [open, campaign, fetchData]);

  async function handleAdd() {
    if (!campaign) return;
    if (!draftEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    setAdding(true);
    try {
      await addRecipient(campaign.id, {
        email: draftEmail.trim(),
        first_name: draftFirstName.trim() || null,
        last_name: draftLastName.trim() || null,
        company: draftCompany.trim() || null,
        title: draftTitle.trim() || null,
      });
      toast.success("Recipient added");
      setDraftEmail("");
      setDraftFirstName("");
      setDraftLastName("");
      setDraftCompany("");
      setDraftTitle("");
      setAddOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add recipient");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(recipientId: string) {
    setRemovingId(recipientId);
    try {
      await deleteRecipient(recipientId);
      setRecipients((prev) => prev.filter((r) => r.id !== recipientId));
      toast.success("Recipient removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  }

  if (!campaign) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-2xl">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
              <Mail className="size-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate">{campaign.name}</SheetTitle>
              <SheetDescription>
                <Badge variant="outline" className="text-xs capitalize">
                  {campaign.status}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="recipients" className="mt-6 flex flex-1 flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipients" className="gap-1.5">
              <Users className="size-3.5" />
              Recipients ({recipients.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="size-3.5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* RECIPIENTS TAB */}
          <TabsContent
            value="recipients"
            className="mt-4 flex-1 space-y-3 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {recipients.length} total
              </span>
              <Button
                size="sm"
                variant={addOpen ? "ghost" : "default"}
                onClick={() => setAddOpen((v) => !v)}
                className={
                  addOpen
                    ? ""
                    : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                }
              >
                {addOpen ? (
                  <>
                    <X className="mr-1.5 size-3.5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="mr-1.5 size-3.5" />
                    Add recipient
                  </>
                )}
              </Button>
            </div>

            {addOpen && (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="r-email" className="text-xs">
                      Email *
                    </Label>
                    <Input
                      id="r-email"
                      type="email"
                      placeholder="user@example.com"
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="r-first" className="text-xs">
                      First name
                    </Label>
                    <Input
                      id="r-first"
                      value={draftFirstName}
                      onChange={(e) => setDraftFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="r-last" className="text-xs">
                      Last name
                    </Label>
                    <Input
                      id="r-last"
                      value={draftLastName}
                      onChange={(e) => setDraftLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="r-company" className="text-xs">
                      Company
                    </Label>
                    <Input
                      id="r-company"
                      value={draftCompany}
                      onChange={(e) => setDraftCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="r-title" className="text-xs">
                      Title
                    </Label>
                    <Input
                      id="r-title"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAdd}
                  disabled={adding || !draftEmail.trim()}
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                >
                  {adding ? (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-3.5" />
                  )}
                  Add to campaign
                </Button>
              </div>
            )}

            {recipientsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : recipients.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <Users className="size-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  No recipients yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add a recipient above or from the search results page.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recipients.map((r) => (
                  <RecipientRow
                    key={r.id}
                    recipient={r}
                    onRemove={handleRemove}
                    removing={removingId === r.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent
            value="analytics"
            className="mt-4 flex-1 space-y-4 overflow-y-auto"
          >
            {analyticsLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !analytics ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No analytics available yet
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Recipients" value={analytics.total_recipients} />
                  <StatCard
                    label="Sent"
                    value={analytics.total_sent}
                    ratio={pct(analytics.total_sent, analytics.total_recipients)}
                  />
                  <StatCard
                    label="Delivered"
                    value={analytics.total_delivered}
                    ratio={pct(analytics.total_delivered, analytics.total_sent)}
                  />
                  <StatCard
                    label="Opened"
                    value={analytics.total_opened}
                    ratio={`${(analytics.open_rate * 100).toFixed(1)}%`}
                  />
                  <StatCard
                    label="Clicked"
                    value={analytics.total_clicked}
                    ratio={`${(analytics.click_rate * 100).toFixed(1)}%`}
                  />
                  <StatCard
                    label="Replied"
                    value={analytics.total_replied}
                    ratio={`${(analytics.reply_rate * 100).toFixed(1)}%`}
                  />
                  <StatCard
                    label="Bounced"
                    value={analytics.total_bounced}
                    ratio={`${(analytics.bounce_rate * 100).toFixed(1)}%`}
                  />
                  <StatCard
                    label="Unsubscribed"
                    value={analytics.total_unsubscribed}
                  />
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Send className="size-4 text-muted-foreground" />
                    Delivery rate
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Delivered</span>
                      <span className="font-medium">
                        {pct(analytics.total_delivered, analytics.total_sent)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{
                          width:
                            analytics.total_sent > 0
                              ? `${(analytics.total_delivered / analytics.total_sent) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
