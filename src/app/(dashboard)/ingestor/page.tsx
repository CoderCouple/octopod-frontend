"use client";

import { useState } from "react";

import {
  Activity,
  Ban,
  CheckCircle2,
  Clock,
  Download,
  Github,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelJob,
  discoverGitHub,
  discoverHuggingFace,
  ingestGitHub,
  ingestHuggingFace,
  pauseJob,
  resumeJob,
  retryFailed,
} from "@/api/ingest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useIngestStatus } from "@/hooks/use-ingest-status";
import type { RecentJob } from "@/types/ingest";

import { JobDataSheet } from "./job-data-sheet";
import { PipelineWorkflow } from "./pipeline-workflow";

function StatusBadge({ status }: { status: RecentJob["status"] }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="mr-1 size-3" />
          completed
        </Badge>
      );
    case "running":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <Loader2 className="mr-1 size-3 animate-spin" />
          running
        </Badge>
      );
    case "paused":
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Pause className="mr-1 size-3" />
          paused
        </Badge>
      );
    case "failed":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <XCircle className="mr-1 size-3" />
          failed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary">
          <XCircle className="mr-1 size-3" />
          cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 size-3" />
          {status}
        </Badge>
      );
  }
}

function formatTime(dateStr?: string | null) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function jobTypeLabel(jobType: string) {
  const labels: Record<string, string> = {
    gh_discover: "GH Discover",
    gh_ingest: "GH Ingest",
    gh_retry: "GH Retry",
    hf_discover: "HF Discover",
    hf_ingest: "HF Ingest",
    hf_retry: "HF Retry",
  };
  return labels[jobType] ?? jobType;
}

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

export default function IngestorPage() {
  const { status, loading, error, refetch, startPolling } = useIngestStatus();

  const [ghTop, setGhTop] = useState("5000");
  const [ghAlpha, setGhAlpha] = useState("0.5");
  const [ghDiscovering, setGhDiscovering] = useState(false);

  const [hfTop, setHfTop] = useState("5000");
  const [hfAlpha, setHfAlpha] = useState("0.5");
  const [hfDiscovering, setHfDiscovering] = useState(false);

  const [ghLogins, setGhLogins] = useState("");
  const [ghIngesting, setGhIngesting] = useState(false);

  const [hfLogins, setHfLogins] = useState("");
  const [hfIngesting, setHfIngesting] = useState(false);

  const [retrying, setRetrying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RecentJob | null>(null);

  async function handleGhDiscover() {
    setGhDiscovering(true);
    try {
      const res = await discoverGitHub({
        top: Number(ghTop),
        alpha: Number(ghAlpha),
      });
      toast.success(`GitHub discovery started: ${res.job_id}`);
      startPolling();
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start discovery"
      );
    } finally {
      setGhDiscovering(false);
    }
  }

  async function handleHfDiscover() {
    setHfDiscovering(true);
    try {
      const res = await discoverHuggingFace({
        top: Number(hfTop),
        alpha: Number(hfAlpha),
      });
      toast.success(`HuggingFace discovery started: ${res.job_id}`);
      startPolling();
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start discovery"
      );
    } finally {
      setHfDiscovering(false);
    }
  }

  async function handleGhIngest() {
    const logins = ghLogins
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (logins.length === 0) {
      toast.error("Enter at least one username");
      return;
    }
    setGhIngesting(true);
    try {
      const res = await ingestGitHub(logins);
      toast.success(`GitHub ingestion started: ${res.job_id}`);
      startPolling();
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start ingestion"
      );
    } finally {
      setGhIngesting(false);
    }
  }

  async function handleHfIngest() {
    const logins = hfLogins
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (logins.length === 0) {
      toast.error("Enter at least one username");
      return;
    }
    setHfIngesting(true);
    try {
      const res = await ingestHuggingFace(logins);
      toast.success(`HuggingFace ingestion started: ${res.job_id}`);
      startPolling();
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start ingestion"
      );
    } finally {
      setHfIngesting(false);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      await retryFailed({});
      toast.success("Retry jobs started for both platforms");
      startPolling();
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to retry jobs");
    } finally {
      setRetrying(false);
    }
  }

  async function handleJobAction(
    jobId: string,
    action: "pause" | "resume" | "cancel"
  ) {
    try {
      if (action === "pause") await pauseJob(jobId);
      else if (action === "resume") await resumeJob(jobId);
      else await cancelJob(jobId);
      toast.success(
        `Job ${action === "pause" ? "paused" : action === "resume" ? "resumed" : "cancelled"}`
      );
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : `Failed to ${action} job`
      );
    }
  }

  const totalFailed =
    (status?.github.failed ?? 0) + (status?.huggingface.failed ?? 0);
  const totalRunning = (status?.recent_jobs ?? []).filter(
    (j) => j.status === "running"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <Download className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Ingestor</h1>
              <p className="text-sm text-muted-foreground">
                Manage data ingestion from GitHub and HuggingFace.
              </p>
            </div>
          </div>
        </div>
        {totalRunning > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
            </span>
            {totalRunning} job{totalRunning > 1 ? "s" : ""} running
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <XCircle className="size-4 shrink-0" />
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="ml-auto h-7 text-red-700 hover:text-red-900 dark:text-red-300"
          >
            <RefreshCw className="mr-1 size-3" />
            Retry
          </Button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-transparent dark:from-white/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">GitHub</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Github className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <StatNumber
                  value={status?.github.success ?? 0}
                  label="Success"
                />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber value={status?.github.failed ?? 0} label="Failed" />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber
                  value={status?.github.pending ?? 0}
                  label="Pending"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-400/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">HuggingFace</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
              <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <StatNumber
                  value={status?.huggingface.success ?? 0}
                  label="Success"
                />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber
                  value={status?.huggingface.failed ?? 0}
                  label="Failed"
                />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber
                  value={status?.huggingface.pending ?? 0}
                  label="Pending"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-400/5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
              <Activity className="size-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex h-16 items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <StatNumber value={totalRunning} label="Running" />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber value={totalFailed} label="Failed" />
                <Separator orientation="vertical" className="h-10" />
                <StatNumber
                  value={status?.recent_jobs.length ?? 0}
                  label="Recent"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Workflow */}
      <PipelineWorkflow />

      {/* Tabs */}
      <Card>
        <Tabs defaultValue="github" className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-4 text-green-600" />
                  Ingestion Controls
                </CardTitle>
                <CardDescription>
                  Trigger discovery and ingestion pipelines.
                </CardDescription>
              </div>
              <TabsList className="grid w-[240px] grid-cols-2">
                <TabsTrigger value="github" className="gap-1.5">
                  <Github className="size-3.5" />
                  GitHub
                </TabsTrigger>
                <TabsTrigger value="huggingface" className="gap-1.5">
                  <Sparkles className="size-3.5" />
                  HuggingFace
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <TabsContent value="github" className="m-0 space-y-6">
              <div className="rounded-lg border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
                    <Search className="size-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Discovery</h3>
                    <p className="text-xs text-muted-foreground">
                      Find top contributors to ingest
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="gh-top"
                      className="text-xs text-muted-foreground"
                    >
                      Top N
                    </Label>
                    <Input
                      id="gh-top"
                      type="number"
                      value={ghTop}
                      onChange={(e) => setGhTop(e.target.value)}
                      className="h-9 w-28"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="gh-alpha"
                      className="text-xs text-muted-foreground"
                    >
                      Alpha
                    </Label>
                    <Input
                      id="gh-alpha"
                      type="number"
                      step="0.1"
                      value={ghAlpha}
                      onChange={(e) => setGhAlpha(e.target.value)}
                      className="h-9 w-28"
                    />
                  </div>
                  <Button
                    onClick={handleGhDiscover}
                    disabled={ghDiscovering}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-blue-600"
                  >
                    {ghDiscovering ? (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-3.5" />
                    )}
                    Start Discovery
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-green-100 dark:bg-green-900">
                    <TrendingUp className="size-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Ingestion</h3>
                    <p className="text-xs text-muted-foreground">
                      Ingest data for specific users
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="gh-logins"
                      className="text-xs text-muted-foreground"
                    >
                      Usernames (one per line)
                    </Label>
                    <Textarea
                      id="gh-logins"
                      placeholder={"torvalds\ngvanrossum\nmitchellh"}
                      value={ghLogins}
                      onChange={(e) => setGhLogins(e.target.value)}
                      rows={4}
                      className="resize-none font-mono text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleGhIngest}
                    disabled={ghIngesting}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
                  >
                    {ghIngesting ? (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-3.5" />
                    )}
                    Start Ingestion
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="huggingface" className="m-0 space-y-6">
              <div className="rounded-lg border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900">
                    <Search className="size-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Discovery</h3>
                    <p className="text-xs text-muted-foreground">
                      Find top HuggingFace contributors
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="hf-top"
                      className="text-xs text-muted-foreground"
                    >
                      Top N
                    </Label>
                    <Input
                      id="hf-top"
                      type="number"
                      value={hfTop}
                      onChange={(e) => setHfTop(e.target.value)}
                      className="h-9 w-28"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="hf-alpha"
                      className="text-xs text-muted-foreground"
                    >
                      Alpha
                    </Label>
                    <Input
                      id="hf-alpha"
                      type="number"
                      step="0.1"
                      value={hfAlpha}
                      onChange={(e) => setHfAlpha(e.target.value)}
                      className="h-9 w-28"
                    />
                  </div>
                  <Button
                    onClick={handleHfDiscover}
                    disabled={hfDiscovering}
                    size="sm"
                    className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-md shadow-amber-500/20 hover:from-amber-700 hover:to-amber-600"
                  >
                    {hfDiscovering ? (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-3.5" />
                    )}
                    Start Discovery
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-green-100 dark:bg-green-900">
                    <TrendingUp className="size-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Ingestion</h3>
                    <p className="text-xs text-muted-foreground">
                      Ingest data for specific users
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="hf-logins"
                      className="text-xs text-muted-foreground"
                    >
                      Usernames (one per line)
                    </Label>
                    <Textarea
                      id="hf-logins"
                      placeholder={"bigscience\nhuggingface\nmeta-llama"}
                      value={hfLogins}
                      onChange={(e) => setHfLogins(e.target.value)}
                      rows={4}
                      className="resize-none font-mono text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleHfIngest}
                    disabled={hfIngesting}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
                  >
                    {hfIngesting ? (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-2 size-3.5" />
                    )}
                    Start Ingestion
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              Recent Jobs
            </CardTitle>
            <CardDescription>
              {(status?.recent_jobs.length ?? 0) > 0
                ? `${status!.recent_jobs.length} job${status!.recent_jobs.length > 1 ? "s" : ""} tracked`
                : "No jobs have been triggered yet."}
            </CardDescription>
          </div>
          {totalFailed > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={retrying}
              className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              {retrying ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RotateCcw className="size-3.5" />
              )}
              Retry Failed ({totalFailed})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {(status?.recent_jobs.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Activity className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No jobs yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start a discovery or ingestion above to see jobs here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {status!.recent_jobs.map((job) => (
                <div
                  key={job.id}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-2 rounded-full ${
                        job.status === "running"
                          ? "animate-pulse bg-blue-500"
                          : job.status === "paused"
                            ? "bg-amber-500"
                            : job.status === "completed"
                              ? "bg-green-500"
                              : job.status === "failed"
                                ? "bg-red-500"
                                : "bg-muted-foreground"
                      }`}
                    />
                    <div>
                      <span className="text-sm font-medium">
                        {jobTypeLabel(job.job_type)}
                      </span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {job.id.slice(0, 12)}...
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {job.total_items > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {job.succeeded_count}/{job.total_items} items
                      </span>
                    )}
                    {(job.status === "running" ||
                      job.status === "paused") && (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.status === "running" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            title="Pause job"
                            onClick={() => handleJobAction(job.id, "pause")}
                          >
                            <Pause className="size-3.5 text-amber-600" />
                          </Button>
                        )}
                        {job.status === "paused" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            title="Resume job"
                            onClick={() => handleJobAction(job.id, "resume")}
                          >
                            <Play className="size-3.5 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          title="Cancel job"
                          onClick={() => handleJobAction(job.id, "cancel")}
                        >
                          <Ban className="size-3.5 text-red-600" />
                        </Button>
                      </div>
                    )}
                    <StatusBadge status={job.status} />
                    <span className="min-w-[60px] text-right text-xs text-muted-foreground">
                      {formatTime(job.started_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <JobDataSheet
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
