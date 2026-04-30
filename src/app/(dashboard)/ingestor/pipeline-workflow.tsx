"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Database,
  GitMerge,
  Globe,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelPipeline,
  getActivePipelines,
  getPipelineExecution,
  getPipelineStatus,
  pausePipeline,
  resumePipeline,
  startPipeline,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  PipelineExecution,
  PipelineHealthStatus,
  PipelineStep,
  PipelineType,
} from "@/types/ingest";

// --- Step status helpers ---

function stepStatusIcon(status: PipelineStep["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="size-4 text-green-500" />;
    case "running":
      return <Loader2 className="size-4 animate-spin text-blue-500" />;
    case "failed":
      return <XCircle className="size-4 text-red-500" />;
    case "skipped":
      return <Circle className="size-4 text-muted-foreground" />;
    default:
      return <Circle className="size-4 text-muted-foreground/40" />;
  }
}

function stepStatusColor(status: PipelineStep["status"]) {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "running":
      return "bg-blue-500 animate-pulse";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/20";
  }
}

function executionStatusBadge(
  status: PipelineExecution["status"]
): React.ReactNode {
  switch (status) {
    case "running":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <Loader2 className="mr-1 size-3 animate-spin" />
          Running
        </Badge>
      );
    case "paused":
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Pause className="mr-1 size-3" />
          Paused
        </Badge>
      );
    case "completed":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          <CheckCircle2 className="mr-1 size-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <XCircle className="mr-1 size-3" />
          Failed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary">
          <XCircle className="mr-1 size-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

// --- Stage definitions for the visual flow ---

interface WorkflowStage {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  stepNames: string[];
  color: string;
  bgColor: string;
  iconBg: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "discover",
    label: "Discover",
    description: "Find users across platforms",
    icon: <Search className="size-5" />,
    stepNames: ["gh_discover", "hf_discover", "ln_discover"],
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  {
    id: "ingest",
    label: "Ingest",
    description: "Fetch detailed profile data",
    icon: <Database className="size-5" />,
    stepNames: ["gh_ingest", "hf_ingest", "ln_ingest"],
    color: "text-green-600 dark:text-green-400",
    bgColor: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900",
  },
  {
    id: "sync",
    label: "Bridge Sync",
    description: "4-layer profile merge",
    icon: <GitMerge className="size-5" />,
    stepNames: ["sync", "bridge_sync", "identity_resolve"],
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "border-purple-200 dark:border-purple-800",
    iconBg: "bg-purple-100 dark:bg-purple-900",
  },
  {
    id: "embed",
    label: "Embed",
    description: "Generate search vectors",
    icon: <Sparkles className="size-5" />,
    stepNames: ["embed", "qdrant_embed", "opensearch_embed"],
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900",
  },
];

function getStageStatus(
  stage: WorkflowStage,
  steps: PipelineStep[]
): PipelineStep["status"] {
  const stageSteps = steps.filter((s) => stage.stepNames.includes(s.step_name));
  if (stageSteps.length === 0) return "pending";
  if (stageSteps.some((s) => s.status === "running")) return "running";
  if (stageSteps.some((s) => s.status === "failed")) return "failed";
  if (stageSteps.every((s) => s.status === "completed")) return "completed";
  if (stageSteps.some((s) => s.status === "completed")) return "running";
  return "pending";
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "";
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remainSecs = secs % 60;
  return `${mins}m ${remainSecs}s`;
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

// --- Workflow Stage Node ---

function StageNode({
  stage,
  steps,
  isLast,
}: {
  stage: WorkflowStage;
  steps: PipelineStep[];
  isLast: boolean;
}) {
  const stageSteps = steps.filter((s) => stage.stepNames.includes(s.step_name));
  const status = getStageStatus(stage, steps);
  const [expanded, setExpanded] = useState(false);

  const totalItems = stageSteps.reduce((sum, s) => sum + s.total_items, 0);
  const succeededItems = stageSteps.reduce(
    (sum, s) => sum + s.succeeded_count,
    0
  );
  const totalDuration = stageSteps.reduce(
    (sum, s) => sum + (s.duration_ms ?? 0),
    0
  );

  return (
    <div className="flex items-start gap-0">
      <div className="flex min-w-[200px] max-w-[240px] flex-1 flex-col">
        {/* Stage card */}
        <div
          className={`rounded-xl border-2 p-4 transition-all ${
            status === "running"
              ? `${stage.bgColor} shadow-md`
              : status === "completed"
                ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30"
                : status === "failed"
                  ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30"
                  : "border-border bg-card"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${stage.iconBg}`}>
              <span className={stage.color}>{stage.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stage.label}</span>
                {stepStatusIcon(status)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stage.description}
              </p>
            </div>
          </div>

          {/* Progress */}
          {stageSteps.length > 0 && (
            <div className="mt-3 space-y-2">
              {/* Progress bar */}
              {totalItems > 0 && (
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>
                      {succeededItems}/{totalItems} items
                    </span>
                    {totalDuration > 0 && (
                      <span>{formatDuration(totalDuration)}</span>
                    )}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status === "failed"
                          ? "bg-red-500"
                          : status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                      style={{
                        width: `${totalItems > 0 ? (succeededItems / totalItems) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Expand steps toggle */}
              {stageSteps.length > 0 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex w-full items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {expanded ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                  {stageSteps.length} step{stageSteps.length > 1 ? "s" : ""}
                </button>
              )}

              {/* Expanded steps */}
              {expanded && (
                <div className="space-y-1.5 border-t pt-2">
                  {stageSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        {stepStatusIcon(step.status)}
                        <span className="font-medium">{step.step_label}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {step.succeeded_count}/{step.total_items}
                        {step.duration_ms
                          ? ` · ${formatDuration(step.duration_ms)}`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div className="flex items-center self-center px-2">
          <div
            className={`h-0.5 w-6 ${
              status === "completed" ? "bg-green-400" : "bg-border"
            }`}
          />
          <ArrowRight
            className={`-ml-1 size-4 ${
              status === "completed"
                ? "text-green-400"
                : "text-muted-foreground/30"
            }`}
          />
        </div>
      )}
    </div>
  );
}

// --- Idle state (no active pipeline) ---

function IdleWorkflow({
  health,
  onStart,
  starting,
}: {
  health: PipelineHealthStatus | null;
  onStart: (type: PipelineType) => void;
  starting: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Visual flow diagram (idle state) */}
      <div className="flex flex-wrap items-start justify-center gap-0 py-4">
        {WORKFLOW_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <div className="flex min-w-[180px] flex-col items-center">
              <div
                className={`flex size-14 items-center justify-center rounded-2xl ${stage.iconBg}`}
              >
                <span className={stage.color}>{stage.icon}</span>
              </div>
              <span className="mt-2 text-sm font-semibold">{stage.label}</span>
              <span className="text-xs text-muted-foreground">
                {stage.description}
              </span>
            </div>
            {i < WORKFLOW_STAGES.length - 1 && (
              <div className="flex items-center px-2">
                <div className="h-0.5 w-8 bg-border" />
                <ArrowRight className="-ml-1 size-4 text-muted-foreground/30" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Health stats */}
      {health && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                <Globe className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                GitHub
              </span>
            </div>
            <div className="mt-2 text-lg font-bold tabular-nums">
              {health.checkpoints.github.completed}
            </div>
            <span className="text-[11px] text-muted-foreground">
              profiles ingested
            </span>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950">
                <Sparkles className="size-3.5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                HuggingFace
              </span>
            </div>
            <div className="mt-2 text-lg font-bold tabular-nums">
              {health.checkpoints.huggingface.completed}
            </div>
            <span className="text-[11px] text-muted-foreground">
              profiles ingested
            </span>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950">
                <Globe className="size-3.5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                LinkedIn
              </span>
            </div>
            <div className="mt-2 text-lg font-bold tabular-nums">
              {health.checkpoints.linkedin.completed}
            </div>
            <span className="text-[11px] text-muted-foreground">
              profiles enriched
            </span>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-green-50 dark:bg-green-950">
                <GitMerge className="size-3.5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Unified Profiles
              </span>
            </div>
            <div className="mt-2 text-lg font-bold tabular-nums">
              {health.profile_counts.cohesive_individual_profiles}
            </div>
            <span className="text-[11px] text-muted-foreground">
              cohesive profiles
            </span>
          </div>
        </div>
      )}

      {/* Start pipeline buttons */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["daily", "Daily Pipeline"],
            ["weekly", "Weekly Pipeline"],
            ["seed", "Seed Pipeline"],
          ] as [PipelineType, string][]
        ).map(([type, label]) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => onStart(type)}
            disabled={starting}
            className="gap-1.5"
          >
            {starting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// --- Active pipeline execution view ---

function ActivePipelineView({
  execution,
  onPause,
  onResume,
  onCancel,
  onRerun,
  acting,
}: {
  execution: PipelineExecution;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRerun: () => void;
  acting: boolean;
}) {
  const steps = execution.steps ?? [];
  const progress =
    execution.total_steps > 0
      ? Math.round((execution.completed_steps / execution.total_steps) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {executionStatusBadge(execution.status)}
          <div>
            <span className="text-sm font-medium capitalize">
              {execution.pipeline_type} Pipeline
            </span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {execution.id.slice(0, 12)}...
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Started {formatTime(execution.started_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {execution.status === "running" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
                disabled={acting}
                className="gap-1.5"
              >
                <Pause className="size-3.5" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={acting}
                className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
              >
                <XCircle className="size-3.5" />
                Cancel
              </Button>
            </>
          )}
          {execution.status === "paused" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResume}
              disabled={acting}
              className="gap-1.5"
            >
              <Play className="size-3.5" />
              Resume
            </Button>
          )}
          {(execution.status === "completed" ||
            execution.status === "failed" ||
            execution.status === "cancelled") && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRerun}
              disabled={acting}
              className="gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              Re-run
            </Button>
          )}
        </div>
      </div>

      {/* Overall progress bar */}
      <div>
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            Step {execution.completed_steps} of {execution.total_steps}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              execution.status === "failed"
                ? "bg-red-500"
                : execution.status === "completed"
                  ? "bg-green-500"
                  : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage flow */}
      <div className="flex flex-wrap items-start justify-center gap-0 py-2">
        {WORKFLOW_STAGES.map((stage, i) => (
          <StageNode
            key={stage.id}
            stage={stage}
            steps={steps}
            isLast={i === WORKFLOW_STAGES.length - 1}
          />
        ))}
      </div>

      {/* Step list */}
      {steps.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            All Steps
          </h4>
          <div className="rounded-lg border">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex items-center justify-between px-4 py-2.5 ${
                  i > 0 ? "border-t" : ""
                } ${step.status === "running" ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {step.step_order}
                  </span>
                  {stepStatusIcon(step.status)}
                  <span className="text-sm font-medium">{step.step_label}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {step.total_items > 0 && (
                    <span>
                      {step.succeeded_count}/{step.total_items} items
                    </span>
                  )}
                  {step.failed_count > 0 && (
                    <span className="text-red-600">
                      {step.failed_count} failed
                    </span>
                  )}
                  {step.duration_ms ? (
                    <span className="min-w-[60px] text-right">
                      {formatDuration(step.duration_ms)}
                    </span>
                  ) : step.status === "running" ? (
                    <span className="min-w-[60px] text-right text-blue-600">
                      in progress
                    </span>
                  ) : null}
                  <div
                    className={`size-2 rounded-full ${stepStatusColor(step.status)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main component ---

export function PipelineWorkflow() {
  const [health, setHealth] = useState<PipelineHealthStatus | null>(null);
  const [activeExecution, setActiveExecution] =
    useState<PipelineExecution | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [acting, setActing] = useState(false);

  const fetchState = useCallback(async () => {
    try {
      const [healthData, activePipelines] = await Promise.all([
        getPipelineStatus(),
        getActivePipelines(),
      ]);
      setHealth(healthData);

      if (activePipelines.length > 0) {
        const execution = await getPipelineExecution(activePipelines[0].id);
        setActiveExecution(execution);
      } else {
        setActiveExecution(null);
      }
    } catch {
      // Silently handle — shows idle state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Poll when there's an active execution
  useEffect(() => {
    if (!activeExecution || activeExecution.status !== "running") return;
    const interval = setInterval(async () => {
      try {
        const execution = await getPipelineExecution(activeExecution.id);
        setActiveExecution(execution);
        if (execution.status !== "running") {
          const healthData = await getPipelineStatus();
          setHealth(healthData);
        }
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeExecution]);

  async function handleStart(type: PipelineType) {
    setStarting(true);
    try {
      await startPipeline({ pipeline_type: type });
      toast.success(`${type} pipeline started`);
      await fetchState();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start pipeline"
      );
    } finally {
      setStarting(false);
    }
  }

  async function handlePause() {
    if (!activeExecution) return;
    setActing(true);
    try {
      await pausePipeline(activeExecution.id);
      toast.success("Pipeline paused");
      await fetchState();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to pause pipeline"
      );
    } finally {
      setActing(false);
    }
  }

  async function handleResume() {
    if (!activeExecution) return;
    setActing(true);
    try {
      await resumePipeline(activeExecution.id);
      toast.success("Pipeline resumed");
      await fetchState();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to resume pipeline"
      );
    } finally {
      setActing(false);
    }
  }

  async function handleCancel() {
    if (!activeExecution) return;
    setActing(true);
    try {
      await cancelPipeline(activeExecution.id);
      toast.success("Pipeline cancelled");
      await fetchState();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel pipeline"
      );
    } finally {
      setActing(false);
    }
  }

  async function handleRerun() {
    if (!activeExecution) return;
    setStarting(true);
    try {
      await startPipeline({
        pipeline_type: activeExecution.pipeline_type,
        input_params:
          activeExecution.input_params as PipelineExecution["input_params"] & {
            top?: number;
            alpha?: number;
            since_hours?: number;
          },
      });
      toast.success("Pipeline re-run started");
      await fetchState();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to re-run pipeline"
      );
    } finally {
      setStarting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-4 text-green-600" />
              Pipeline Workflow
            </CardTitle>
            <CardDescription>
              {activeExecution
                ? `Tracking ${activeExecution.pipeline_type} pipeline execution`
                : "Discover → Ingest → Bridge Sync → Embed"}
            </CardDescription>
          </div>
          {activeExecution && (
            <Button variant="ghost" size="sm" onClick={fetchState}>
              <RotateCcw className="mr-1.5 size-3.5" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-center gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="size-14 rounded-2xl" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ) : activeExecution ? (
          <ActivePipelineView
            execution={activeExecution}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
            onRerun={handleRerun}
            acting={acting}
          />
        ) : (
          <IdleWorkflow
            health={health}
            onStart={handleStart}
            starting={starting}
          />
        )}
      </CardContent>
    </Card>
  );
}
