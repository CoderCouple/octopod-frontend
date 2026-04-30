"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getIngestStatus } from "@/api/ingest";
import type { IngestStatus } from "@/types/ingest";

export function useIngestStatus() {
  const [status, setStatus] = useState<IngestStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refetch = useCallback(async () => {
    try {
      const data = await getIngestStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(refetch, 5000);
  }, [refetch]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    refetch();
    startPolling();
    return stopPolling;
  }, [refetch, startPolling, stopPolling]);

  // Stop polling when no pending/running jobs
  useEffect(() => {
    if (!status) return;
    const hasActive = status.recent_jobs.some(
      (j) => j.status === "running" || j.status === "pending"
    );
    if (hasActive) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [status, startPolling, stopPolling]);

  return { status, loading, error, refetch, startPolling };
}
