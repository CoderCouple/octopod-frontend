"use client";

import { useState } from "react";

import {
  Ban,
  Loader2,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelCampaign,
  deleteCampaign,
  pauseCampaign,
  resumeCampaign,
  startCampaign,
} from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onChanged,
}: {
  campaigns: EmailCampaign[];
  onSelect: (campaign: EmailCampaign) => void;
  onChanged?: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function runAction(
    campaignId: string,
    action: "start" | "pause" | "resume" | "cancel" | "delete",
    label: string,
  ) {
    setBusyId(campaignId);
    try {
      if (action === "start") await startCampaign(campaignId);
      else if (action === "pause") await pauseCampaign(campaignId);
      else if (action === "resume") await resumeCampaign(campaignId);
      else if (action === "cancel") await cancelCampaign(campaignId);
      else await deleteCampaign(campaignId);
      toast.success(`Campaign ${label}`);
      onChanged?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : `Failed to ${action} campaign`
      );
    } finally {
      setBusyId(null);
    }
  }

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
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover:opacity-100"
                    disabled={busyId === campaign.id}
                  >
                    {busyId === campaign.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="size-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {(campaign.status === "draft" ||
                    campaign.status === "paused") && (
                    <DropdownMenuItem
                      onClick={() =>
                        runAction(
                          campaign.id,
                          campaign.status === "draft" ? "start" : "resume",
                          campaign.status === "draft" ? "started" : "resumed",
                        )
                      }
                    >
                      <Play className="mr-2 size-3.5 text-green-600" />
                      {campaign.status === "draft" ? "Start" : "Resume"}
                    </DropdownMenuItem>
                  )}
                  {campaign.status === "active" && (
                    <DropdownMenuItem
                      onClick={() => runAction(campaign.id, "pause", "paused")}
                    >
                      <Pause className="mr-2 size-3.5 text-amber-600" />
                      Pause
                    </DropdownMenuItem>
                  )}
                  {(campaign.status === "active" ||
                    campaign.status === "paused" ||
                    campaign.status === "draft") && (
                    <DropdownMenuItem
                      onClick={() =>
                        runAction(campaign.id, "cancel", "cancelled")
                      }
                    >
                      <Ban className="mr-2 size-3.5 text-red-600" />
                      Cancel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      runAction(campaign.id, "delete", "deleted")
                    }
                    className="text-red-600 focus:text-red-700"
                  >
                    <Trash2 className="mr-2 size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
