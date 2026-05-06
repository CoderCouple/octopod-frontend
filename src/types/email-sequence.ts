// --- Paginated response wrapper ---

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

// --- Mailbox ---

export type MailboxProvider = "gmail" | "outlook" | "smtp" | "ses";
export type MailboxStatus = "connected" | "disconnected" | "error" | "rate_limited";

export interface Mailbox {
  id: string;
  owner_id: string;
  provider: MailboxProvider;
  email_address: string;
  display_name: string | null;
  status: MailboxStatus;
  daily_send_limit: number;
  sends_today: number;
  warmup_enabled: boolean;
  warmup_current_limit: number;
  error_message: string | null;
  last_error_at: string | null;
  metadata: Record<string, unknown>;
  is_deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectGmailParams {
  auth_code: string;
  display_name?: string | null;
}

export interface ConnectOutlookParams {
  auth_code: string;
  display_name?: string | null;
}

export interface ConnectSmtpParams {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_use_tls: boolean;
  email_address: string;
  display_name?: string | null;
}

export interface ConnectSesParams {
  email_address: string;
  display_name?: string | null;
}

export interface UpdateMailboxParams {
  display_name?: string | null;
  daily_send_limit?: number | null;
  warmup_enabled?: boolean | null;
  warmup_current_limit?: number | null;
}

// --- Email Template ---

export interface EmailTemplate {
  id: string;
  owner_id: string;
  name: string;
  category: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  variables: string[];
  metadata: Record<string, unknown>;
  is_deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailTemplateParams {
  name: string;
  category?: string | null;
  subject: string;
  body_html: string;
  body_text?: string | null;
  variables?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateEmailTemplateParams {
  name?: string;
  category?: string | null;
  subject?: string;
  body_html?: string;
  body_text?: string | null;
  variables?: string[];
  metadata?: Record<string, unknown>;
}

export interface TemplatePreviewResult {
  subject: string;
  body_html: string;
  body_text: string | null;
}

// --- Email Campaign ---

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface EmailCampaign {
  id: string;
  owner_id: string;
  mailbox_id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  send_window_start: string | null;
  send_window_end: string | null;
  send_timezone: string;
  send_days: number[];
  stop_on_reply: boolean;
  stop_on_bounce: boolean;
  track_opens: boolean;
  track_clicks: boolean;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  total_unsubscribed: number;
  started_at: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  is_deleted: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignParams {
  name: string;
  mailbox_id: string;
  description?: string | null;
  send_window_start?: string | null;
  send_window_end?: string | null;
  send_timezone?: string;
  send_days?: number[];
  stop_on_reply?: boolean;
  stop_on_bounce?: boolean;
  track_opens?: boolean;
  track_clicks?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateCampaignParams {
  name?: string;
  mailbox_id?: string;
  description?: string | null;
  send_window_start?: string | null;
  send_window_end?: string | null;
  send_timezone?: string;
  send_days?: number[];
  stop_on_reply?: boolean;
  stop_on_bounce?: boolean;
  track_opens?: boolean;
  track_clicks?: boolean;
  metadata?: Record<string, unknown>;
}

// --- Campaign Steps ---

export type StepType = "email" | "wait" | "condition";

export interface CampaignStep {
  id: string;
  campaign_id: string;
  template_id: string | null;
  step_order: number;
  step_type: StepType;
  delay_days: number;
  delay_hours: number;
  subject_override: string | null;
  body_override: string | null;
  condition_field: string | null;
  condition_op: string | null;
  condition_value: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateStepParams {
  template_id?: string | null;
  step_type: StepType;
  delay_days?: number;
  delay_hours?: number;
  subject_override?: string | null;
  body_override?: string | null;
  condition_field?: string | null;
  condition_op?: string | null;
  condition_value?: string | null;
}

export interface UpdateStepParams {
  template_id?: string | null;
  step_type?: StepType;
  step_order?: number | null;
  delay_days?: number;
  delay_hours?: number;
  subject_override?: string | null;
  body_override?: string | null;
  condition_field?: string | null;
  condition_op?: string | null;
  condition_value?: string | null;
}

// --- Campaign Recipients ---

export type RecipientStatus =
  | "active"
  | "paused"
  | "completed"
  | "replied"
  | "bounced"
  | "unsubscribed"
  | "error";

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  developer_profile_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  title: string | null;
  status: RecipientStatus;
  current_step_order: number;
  next_send_at: string | null;
  email_source: string;
  merge_variables: Record<string, string>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AddRecipientParams {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  title?: string | null;
  merge_variables?: Record<string, string>;
}

export interface AddRecipientsFromSearchParams {
  profile_ids: string[];
}

// --- Campaign Analytics ---

export interface CampaignAnalytics {
  campaign_id: string;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_replied: number;
  total_bounced: number;
  total_unsubscribed: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;
}

// --- Email Messages ---

export type EmailMessageStatus =
  | "scheduled"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled"
  | "bounced";

export interface EmailMessage {
  id: string;
  campaign_id: string;
  step_id: string;
  recipient_id: string;
  tracking_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  status: EmailMessageStatus;
  scheduled_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  bounced_at: string | null;
  open_count: number;
  click_count: number;
  error_message: string | null;
  created_at: string;
}

// --- Email Enrichment ---

export interface EmailEnrichmentResult {
  developer_profile_id: string;
  email: string | null;
  source: string | null;
  confidence: number;
  found: boolean;
}
