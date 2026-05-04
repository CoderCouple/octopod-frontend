import { authFetch } from "@/lib/api-client";
import type {
  ApiResponse,
  CandidateListParams,
  DiscoverParams,
  EmbedParams,
  IdentityResolveParams,
  IdentityStats,
  IngestJob,
  IngestJobDetail,
  IngestJobItem,
  IngestStatus,
  JobControlResult,
  JobData,
  JobListParams,
  JobStartResult,
  LinkedInRunParams,
  MergeCandidate,
  MergeCandidateDetail,
  MergeCandidateResult,
  PipelineControlResult,
  PipelineExecution,
  PipelineHealthStatus,
  PipelineSchedule,
  PipelineStartParams,
  PipelineStartResult,
  RetryParams,
  RetryResult,
  ScheduleCreateParams,
  ScheduleUpdateParams,
  SyncParams,
} from "@/types/ingest";

const BASE_URL =
  // eslint-disable-next-line n/no-process-env
  process.env.NEXT_PUBLIC_INGEST_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await authFetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.result;
}

export function discoverGitHub(params: DiscoverParams) {
  return request<JobStartResult>("/ingest/gh/discover", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function discoverHuggingFace(params: DiscoverParams) {
  return request<JobStartResult>("/ingest/hf/discover", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function ingestGitHub(logins: string[], concurrency?: number) {
  return request<JobStartResult>("/ingest/gh/run", {
    method: "POST",
    body: JSON.stringify({ logins, concurrency }),
  });
}

export function ingestHuggingFace(logins: string[], concurrency?: number) {
  return request<JobStartResult>("/ingest/hf/run", {
    method: "POST",
    body: JSON.stringify({ logins, concurrency }),
  });
}

export function getIngestStatus() {
  return request<IngestStatus>("/ingest/status");
}

export function retryFailed(params: RetryParams) {
  return request<RetryResult>("/ingest/retry", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listJobs(params?: JobListParams) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  if (params?.platform) searchParams.set("platform", params.platform);
  if (params?.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return request<IngestJob[]>(`/ingest/jobs${qs ? `?${qs}` : ""}`);
}

export function getJob(jobId: string) {
  return request<IngestJobDetail>(`/ingest/jobs/${jobId}`);
}

export function pauseJob(jobId: string) {
  return request<JobControlResult>(`/ingest/jobs/${jobId}/pause`, {
    method: "POST",
  });
}

export function resumeJob(jobId: string) {
  return request<JobControlResult>(`/ingest/jobs/${jobId}/resume`, {
    method: "POST",
  });
}

export function cancelJob(jobId: string) {
  return request<JobControlResult>(`/ingest/jobs/${jobId}/cancel`, {
    method: "POST",
  });
}

export function getJobItems(
  jobId: string,
  params?: { limit?: number; offset?: number }
) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return request<IngestJobItem[]>(
    `/ingest/jobs/${jobId}/items${qs ? `?${qs}` : ""}`
  );
}

export function getJobData(
  jobId: string,
  params?: { limit?: number; offset?: number }
) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return request<JobData[]>(`/ingest/jobs/${jobId}/data${qs ? `?${qs}` : ""}`);
}

export function getJobUserData(jobId: string, login: string) {
  return request<JobData>(`/ingest/jobs/${jobId}/data/${login}`);
}

// --- LinkedIn ---

export function discoverLinkedIn() {
  return request<JobStartResult>("/ingest/ln/discover", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function ingestLinkedIn(params?: LinkedInRunParams) {
  return request<JobStartResult>("/ingest/ln/run", {
    method: "POST",
    body: JSON.stringify(params ?? {}),
  });
}

// --- Bridge Sync ---

export function runSync(params?: SyncParams) {
  return request<JobStartResult>("/ingest/sync", {
    method: "POST",
    body: JSON.stringify(params ?? {}),
  });
}

// --- Embed ---

export function runEmbed(params?: EmbedParams) {
  return request<JobStartResult>("/ingest/embed", {
    method: "POST",
    body: JSON.stringify(params ?? {}),
  });
}

// --- Pipeline Execution ---

export function startPipeline(params: PipelineStartParams) {
  return request<PipelineStartResult>("/ingest/pipeline/start", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function getActivePipelines() {
  return request<PipelineExecution[]>("/ingest/pipeline/active");
}

export function getPipelineExecution(executionId: string) {
  return request<PipelineExecution>(`/ingest/pipeline/${executionId}`);
}

export function pausePipeline(executionId: string) {
  return request<PipelineControlResult>(
    `/ingest/pipeline/${executionId}/pause`,
    { method: "POST" }
  );
}

export function resumePipeline(executionId: string) {
  return request<PipelineControlResult>(
    `/ingest/pipeline/${executionId}/resume`,
    { method: "POST" }
  );
}

export function cancelPipeline(executionId: string) {
  return request<PipelineControlResult>(
    `/ingest/pipeline/${executionId}/cancel`,
    { method: "POST" }
  );
}

export function rerunPipeline(executionId: string) {
  return request<PipelineStartResult>(`/ingest/pipeline/${executionId}/rerun`, {
    method: "POST",
  });
}

export function getPipelineStatus() {
  return request<PipelineHealthStatus>("/ingest/pipeline/status");
}

// --- Schedules ---

export function createSchedule(params: ScheduleCreateParams) {
  return request<PipelineSchedule>("/ingest/schedule", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listSchedules() {
  return request<PipelineSchedule[]>("/ingest/schedules");
}

export function updateSchedule(
  scheduleId: string,
  params: ScheduleUpdateParams
) {
  return request<PipelineSchedule>(`/ingest/schedule/${scheduleId}`, {
    method: "PUT",
    body: JSON.stringify(params),
  });
}

export function deleteSchedule(scheduleId: string) {
  return request<{ id: string; deleted: boolean }>(
    `/ingest/schedule/${scheduleId}`,
    { method: "DELETE" }
  );
}

// --- Identity Resolution ---

export function listMergeCandidates(params?: CandidateListParams) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.min_score)
    searchParams.set("min_score", String(params.min_score));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return request<MergeCandidate[]>(
    `/ingest/identity/candidates${qs ? `?${qs}` : ""}`
  );
}

export function getMergeCandidate(candidateId: string) {
  return request<MergeCandidateDetail>(
    `/ingest/identity/candidates/${candidateId}`
  );
}

export function approveMergeCandidate(candidateId: string) {
  return request<MergeCandidateResult>(
    `/ingest/identity/candidates/${candidateId}/approve`,
    { method: "POST" }
  );
}

export function rejectMergeCandidate(candidateId: string) {
  return request<MergeCandidateResult>(
    `/ingest/identity/candidates/${candidateId}/reject`,
    { method: "POST" }
  );
}

export function resolveIdentity(params?: IdentityResolveParams) {
  return request<JobStartResult>("/ingest/identity/resolve", {
    method: "POST",
    body: JSON.stringify(params ?? {}),
  });
}

export function getIdentityStats() {
  return request<IdentityStats>("/ingest/identity/stats");
}
