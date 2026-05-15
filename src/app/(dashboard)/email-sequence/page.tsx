"use client";

import { useCallback, useEffect, useState } from "react";

import { Loader2, Mail, Plus, Send, Users } from "lucide-react";
import { toast } from "sonner";

import { listCampaigns } from "@/api/email-sequence";
import { CampaignDetailSheet } from "@/components/email-sequence/campaign-detail-sheet";
import { CreateSequenceDialog } from "@/components/email-sequence/create-sequence-dialog";
import { SequenceList } from "@/components/email-sequence/sequence-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmailCampaign } from "@/types/email-sequence";

function StatNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default function EmailSequencePage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await listCampaigns();
      setCampaigns(data.items);
    } catch {
      // API not available yet — show empty state
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const totalRecipients = campaigns.reduce(
    (sum, c) => sum + c.total_recipients,
    0
  );

  function handleCampaignCreated() {
    setWizardOpen(false);
    toast.success("Campaign created");
    fetchCampaigns();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <Mail className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Email Sequences
              </h1>
              <p className="text-sm text-muted-foreground">
                Build multi-step outreach sequences to engage prospects.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setWizardOpen(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
        >
          <Plus className="mr-2 size-4" />
          Create Sequence
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-400/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
              <Mail className="size-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <StatNumber value={campaigns.length} label="Campaigns" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-400/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
              <Send className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <StatNumber value={activeCount} label="Active" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent dark:from-purple-400/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              Contacts Reached
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
              <Users className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <StatNumber value={totalRecipients} label="Recipients" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            {campaigns.length > 0
              ? `${campaigns.length} campaign${campaigns.length > 1 ? "s" : ""}`
              : "No campaigns have been created yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SequenceList
            campaigns={campaigns}
            onSelect={(c) => setSelectedCampaign(c)}
            onChanged={fetchCampaigns}
          />
        </CardContent>
      </Card>

      {/* Create Sequence Wizard */}
      <CreateSequenceDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreated={handleCampaignCreated}
      />

      {/* Campaign Detail Sheet — recipients + analytics */}
      <CampaignDetailSheet
        campaign={selectedCampaign}
        open={selectedCampaign !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCampaign(null);
            fetchCampaigns();
          }
        }}
      />
    </div>
  );
}
