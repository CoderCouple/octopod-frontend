export interface ApiResponse<T> {
  success: boolean;
  result: T;
  status_code: number;
  message?: string;
}

export interface JobStartResult {
  job_id: string;
  status: string;
}

export interface RetryResult {
  gh_job_id: string;
  hf_job_id: string;
  status: string;
}

export interface SourceCounts {
  success: number;
  failed: number;
  pending?: number;
}

export interface RecentJob {
  id: string;
  job_type: string;
  platform: "github" | "huggingface";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  started_at: string;
  completed_at?: string | null;
  total_items: number;
  succeeded_count: number;
  failed_count: number;
  skipped_count: number;
}

export interface IngestStatus {
  github: SourceCounts;
  huggingface: SourceCounts;
  recent_jobs: RecentJob[];
}

export interface IngestJob {
  id: string;
  job_type: string;
  platform: "github" | "huggingface";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  trigger: string;
  triggered_by: string | null;
  execution_phase_id: string | null;
  input_params: Record<string, unknown>;
  concurrency: number;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  total_items: number;
  succeeded_count: number;
  failed_count: number;
  skipped_count: number;
  error_summary: string | null;
  error_detail: string | null;
  stats: Record<string, number>;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface IngestJobDetail extends IngestJob {
  item_counts: Record<string, number>;
}

export interface IngestJobItem {
  id: string;
  job_id: string;
  login: string;
  platform: "github" | "huggingface";
  status: "pending" | "running" | "success" | "failed" | "skipped";
  attempt_number: number;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  records_written: Record<string, number>;
  error_type: "permanent" | "transient" | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoverParams {
  top?: number;
  alpha?: number;
}

export interface IngestParams {
  logins: string[];
  concurrency?: number;
}

export interface RetryParams {
  status?: string;
  max_attempts?: number;
}

export interface JobListParams {
  limit?: number;
  offset?: number;
  platform?: "github" | "huggingface";
  status?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  stars: number;
  primary_language: string;
  topics: string[];
}

export interface GitHubUserData {
  id: number;
  login: string;
  name: string;
  email: string;
  followers: number;
  public_repos: number;
  repositories: GitHubRepo[];
  total_commits: number;
  total_events: number;
}

export interface HFModel {
  id: string;
  name: string;
  pipeline_tag: string;
  downloads_30d: number;
  likes: number;
}

export interface HFDataset {
  id: string;
  [key: string]: unknown;
}

export interface HuggingFaceUserData {
  username: string;
  type: string;
  fullname: string;
  num_models: number;
  models: HFModel[];
  datasets: HFDataset[];
}

export type JobData = GitHubUserData | HuggingFaceUserData;

// --- LinkedIn ---

export interface LinkedInRunParams {
  max_profiles?: number;
  concurrency?: number;
}

// --- Bridge Sync ---

export interface SyncParams {
  platform?: "all" | "gh_only" | "hf_only" | "ln_only";
  since_hours?: number;
}

// --- Embed ---

export interface EmbedParams {
  batch_size?: number;
  include_opensearch?: boolean;
}

// --- Pipeline Execution ---

export type PipelineType =
  | "daily"
  | "weekly"
  | "seed"
  | "gh_only"
  | "hf_only"
  | "ln_only"
  | "dependent";

export interface PipelineStartParams {
  pipeline_type: PipelineType;
  input_params?: {
    top?: number;
    alpha?: number;
    since_hours?: number;
  };
}

export interface PipelineStartResult {
  pipeline_type: string;
  status: string;
  rerun_of?: string;
}

export interface PipelineStep {
  id: string;
  step_order: number;
  step_name: string;
  step_label: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  total_items: number;
  succeeded_count: number;
  failed_count: number;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
}

export interface PipelineExecution {
  id: string;
  pipeline_type: PipelineType;
  status: "running" | "paused" | "completed" | "failed" | "cancelled";
  total_steps: number;
  completed_steps: number;
  current_step_order: number;
  input_params: Record<string, unknown>;
  started_at: string;
  completed_at?: string | null;
  steps?: PipelineStep[];
}

export interface PipelineControlResult {
  execution_id: string;
  control_signal?: string;
  status?: string;
  from_step?: number;
}

export interface PipelineHealthStatus {
  checkpoints: {
    github: { completed: number; failed: number };
    huggingface: { completed: number; failed?: number };
    linkedin: { completed: number; failed?: number };
  };
  latest_jobs: RecentJob[];
  profile_counts: {
    developer_profiles: number;
    cohesive_individual_profiles: number;
  };
}

// --- Schedules ---

export interface ScheduleCreateParams {
  name: string;
  pipeline_type: PipelineType;
  input_params?: Record<string, unknown>;
  cron_expression: string;
  is_enabled?: boolean;
}

export interface ScheduleUpdateParams {
  name?: string;
  pipeline_type?: PipelineType;
  input_params?: Record<string, unknown>;
  cron_expression?: string;
  is_enabled?: boolean;
}

export interface PipelineSchedule {
  id: string;
  name: string;
  pipeline_type: PipelineType;
  input_params: Record<string, unknown>;
  cron_expression: string;
  is_enabled: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

// --- Identity Resolution ---

export interface MergeSignal {
  signal: string;
  weight: number;
  detail: string;
}

export interface MergeCandidate {
  id: string;
  source_profile_id: string;
  target_profile_id: string;
  confidence_score: number;
  signals: MergeSignal[];
  status: "pending" | "approved" | "merged" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  source_name: string;
  source_gh: string | null;
  source_hf: string | null;
  target_name: string;
  target_gh: string | null;
  target_hf: string | null;
}

export interface MergeCandidateDetail extends MergeCandidate {
  source_profile: {
    id: string;
    github_username: string | null;
    huggingface_username: string | null;
    display_name: string;
    company: string | null;
    location: string | null;
    total_repos: number;
    total_stars: number;
    total_hf_models: number;
    total_hf_downloads: number;
  };
  target_profile: {
    id: string;
    github_username: string | null;
    huggingface_username: string | null;
    display_name: string;
    company: string | null;
    location: string | null;
    total_repos: number;
    total_stars: number;
    total_hf_models: number;
    total_hf_downloads: number;
  };
}

export interface MergeCandidateResult {
  id: string;
  status: string;
  source_profile_id: string;
  target_profile_id: string;
}

export interface IdentityResolveParams {
  since_hours?: number;
  full_scan?: boolean;
}

export interface IdentityStats {
  by_status: {
    status: string;
    count: number;
    avg_score: number;
  }[];
  total_merged_profiles: number;
}

export interface CandidateListParams {
  status?: "pending" | "approved" | "merged" | "rejected";
  min_score?: number;
  limit?: number;
  offset?: number;
}
