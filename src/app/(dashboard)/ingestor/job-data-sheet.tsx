"use client";

import { useCallback, useEffect, useState } from "react";

import { Loader2, Star } from "lucide-react";

import { getJobData } from "@/api/ingest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GitHubUserData,
  HuggingFaceUserData,
  JobData,
  RecentJob,
} from "@/types/ingest";

const PAGE_SIZE = 20;

function isGitHubUser(data: JobData): data is GitHubUserData {
  return "login" in data;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function GitHubUserCard({ user }: { user: GitHubUserData }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-sm font-semibold">{user.login}</span>
          {user.name && (
            <span className="ml-2 text-sm text-muted-foreground">
              {user.name}
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
        <span>{formatNumber(user.followers)} followers</span>
        <span>{user.public_repos} repos</span>
      </div>

      {user.repositories.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {user.repositories.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs"
            >
              <span className="font-medium">{repo.name}</span>
              <div className="flex items-center gap-3">
                {repo.primary_language && (
                  <span className="text-muted-foreground">
                    {repo.primary_language}
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Star className="size-3" />
                  {formatNumber(repo.stars)}
                </span>
                {repo.topics.length > 0 && (
                  <span className="hidden text-muted-foreground sm:inline">
                    {repo.topics.slice(0, 3).join(", ")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
        <span>{user.total_commits} commits</span>
        <span>{user.total_events} events</span>
      </div>
    </div>
  );
}

function HuggingFaceUserCard({ user }: { user: HuggingFaceUserData }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold">{user.username}</span>
        {user.fullname && (
          <span className="text-sm text-muted-foreground">{user.fullname}</span>
        )}
        <Badge variant="secondary" className="text-[10px]">
          {user.type}
        </Badge>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {user.num_models} models · {user.datasets.length} datasets
      </div>

      {user.models.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {user.models.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs"
            >
              <span className="font-medium">{model.name}</span>
              <div className="flex items-center gap-3">
                {model.pipeline_tag && (
                  <span className="text-muted-foreground">
                    {model.pipeline_tag}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {formatNumber(model.downloads_30d)} dl
                </span>
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Star className="size-3" />
                  {model.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="mb-3 h-3 w-56" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
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

interface JobDataSheetProps {
  job: RecentJob | null;
  open: boolean;
  onClose: () => void;
}

export function JobDataSheet({ job, open, onClose }: JobDataSheetProps) {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(
    async (jobId: string, currentOffset: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const result = await getJobData(jobId, {
          limit: PAGE_SIZE,
          offset: currentOffset,
        });
        if (append) {
          setData((prev) => [...prev, ...result]);
        } else {
          setData(result);
        }
        setHasMore(result.length === PAGE_SIZE);
        setOffset(currentOffset + result.length);
      } catch {
        // silently handle — the sheet just shows empty state
        if (!append) setData([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open && job) {
      setData([]);
      setOffset(0);
      setHasMore(false);
      fetchData(job.id, 0, false);
    }
  }, [open, job, fetchData]);

  function handleLoadMore() {
    if (job) {
      fetchData(job.id, offset, true);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden sm:max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {job && jobTypeLabel(job.job_type)}
            {job && (
              <span className="font-mono text-xs text-muted-foreground">
                {job.id.slice(0, 12)}...
              </span>
            )}
            {job && (
              <Badge
                variant="secondary"
                className={
                  job.status === "completed"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                    : ""
                }
              >
                {job.status}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {job
              ? `${job.succeeded_count}/${job.total_items} items ingested`
              : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="-mx-6 flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <LoadingSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No data available for this job yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((item, idx) => {
                if (isGitHubUser(item)) {
                  return <GitHubUserCard key={item.login} user={item} />;
                }
                return (
                  <HuggingFaceUserCard key={item.username ?? idx} user={item} />
                );
              })}

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore && (
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
