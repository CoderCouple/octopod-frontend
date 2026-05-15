"use client";

import { useCallback, useEffect, useState } from "react";

import { Loader2, Mail, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  addRecipientsFromSearch,
  listCampaigns,
} from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmailCampaign } from "@/types/email-sequence";

export function AddToCampaignDialog({
  open,
  onOpenChange,
  profileIds,
  profileName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileIds: string[];
  profileName?: string | null;
}) {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    try {
      const page = await listCampaigns({ limit: 50 });
      // Only show campaigns we can add to (not completed/cancelled)
      const addable = page.items.filter(
        (c) => c.status === "draft" || c.status === "active" || c.status === "paused"
      );
      setCampaigns(addable);
      if (addable.length > 0) setSelected(addable[0].id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchCampaigns();
    }
  }, [open, fetchCampaigns]);

  async function handleAdd() {
    if (!selected) return;
    setSubmitting(true);
    try {
      const added = await addRecipientsFromSearch(selected, {
        profile_ids: profileIds,
      });
      toast.success(
        `Added ${added.length} recipient${added.length !== 1 ? "s" : ""} to campaign`
      );
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to campaign");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to email sequence</DialogTitle>
          <DialogDescription>
            {profileIds.length === 1 ? (
              <>
                Add{" "}
                <span className="font-medium">{profileName || "this developer"}</span>{" "}
                to one of your campaigns. We&apos;ll enrich their email automatically.
              </>
            ) : (
              <>
                Add {profileIds.length} developers to a campaign. Emails will be
                enriched automatically.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="my-3">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-lg border border-dashed py-8 text-center">
              <Mail className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                No active campaigns
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a campaign first to add recipients.
              </p>
            </div>
          ) : (
            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              className="space-y-2"
            >
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                    selected === c.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelected(c.id)}
                >
                  <RadioGroupItem value={c.id} id={c.id} />
                  <Label htmlFor={c.id} className="flex flex-1 cursor-pointer items-center justify-between">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {c.total_recipients} recipient
                        {c.total_recipients !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {c.status}
                    </Badge>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selected || submitting || campaigns.length === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
          >
            {submitting ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Plus className="mr-2 size-3.5" />
            )}
            Add to campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
