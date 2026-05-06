"use client";

import { Mail, MoreHorizontal, Send, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CampaignStatus, EmailCampaign } from "@/types/email-sequence";

function StatusBadge({ status }: { status: CampaignStatus }) {
  switch (status) {
    case "active":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          Active
        </Badge>
      );
    case "paused":
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Paused
        </Badge>
      );
    case "completed":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          Completed
        </Badge>
      );
    case "cancelled":
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Draft</Badge>;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SequenceList({
  campaigns,
  onSelect,
}: {
  campaigns: EmailCampaign[];
  onSelect: (campaign: EmailCampaign) => void;
}) {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Mail className="size-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          No campaigns yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create your first email campaign to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="group flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
          onClick={() => onSelect(campaign)}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
              <Mail className="size-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <span className="text-sm font-medium">{campaign.name}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {campaign.total_recipients} recipient
                  {campaign.total_recipients !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Send className="size-3" />
                  {campaign.total_sent} sent
                </span>
                {campaign.total_recipients > 0 && campaign.total_opened > 0 && (
                  <span>
                    {((campaign.total_opened / campaign.total_recipients) * 100).toFixed(0)}%
                    open
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={campaign.status} />
            <span className="text-xs text-muted-foreground">
              {formatDate(campaign.created_at)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
