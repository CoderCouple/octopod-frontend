import { authFetch } from "@/lib/api-client";
import type {
  AddRecipientParams,
  AddRecipientsFromSearchParams,
  CampaignAnalytics,
  CampaignRecipient,
  CampaignStep,
  ConnectGmailParams,
  ConnectOutlookParams,
  ConnectSesParams,
  ConnectSmtpParams,
  CreateCampaignParams,
  CreateEmailTemplateParams,
  CreateStepParams,
  EmailCampaign,
  EmailEnrichmentResult,
  EmailMessage,
  EmailTemplate,
  Mailbox,
  PaginatedResponse,
  TemplatePreviewResult,
  UpdateCampaignParams,
  UpdateEmailTemplateParams,
  UpdateMailboxParams,
  UpdateStepParams,
} from "@/types/email-sequence";

const BASE_URL =
  // eslint-disable-next-line n/no-process-env
  process.env.NEXT_PUBLIC_INGEST_API_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  result: T;
  status_code: number;
  message?: string;
}

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

// --- Mailbox ---

export function connectGmail(params: ConnectGmailParams) {
  return request<Mailbox>("/mailbox/gmail/connect", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function connectOutlook(params: ConnectOutlookParams) {
  return request<Mailbox>("/mailbox/outlook/connect", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function connectSmtp(params: ConnectSmtpParams) {
  return request<Mailbox>("/mailbox/smtp/connect", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function connectSes(params: ConnectSesParams) {
  return request<Mailbox>("/mailbox/ses/connect", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listMailboxes(params?: { offset?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return request<PaginatedResponse<Mailbox>>(`/mailbox${qs ? `?${qs}` : ""}`);
}

export function getMailbox(mailboxId: string) {
  return request<Mailbox>(`/mailbox/${mailboxId}`);
}

export function updateMailbox(mailboxId: string, params: UpdateMailboxParams) {
  return request<Mailbox>(`/mailbox/${mailboxId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export function deleteMailbox(mailboxId: string) {
  return request<Mailbox>(`/mailbox/${mailboxId}`, { method: "DELETE" });
}

export function testMailbox(mailboxId: string) {
  return request<{ success: boolean; message: string }>(
    `/mailbox/${mailboxId}/test`,
    { method: "POST" }
  );
}

// --- Email Templates ---

export function createEmailTemplate(params: CreateEmailTemplateParams) {
  return request<EmailTemplate>("/email-template", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listEmailTemplates(params?: {
  offset?: number;
  limit?: number;
  category?: string;
}) {
  const sp = new URLSearchParams();
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.category) sp.set("category", params.category);
  const qs = sp.toString();
  return request<PaginatedResponse<EmailTemplate>>(
    `/email-template${qs ? `?${qs}` : ""}`
  );
}

export function getEmailTemplate(templateId: string) {
  return request<EmailTemplate>(`/email-template/${templateId}`);
}

export function updateEmailTemplate(
  templateId: string,
  params: UpdateEmailTemplateParams
) {
  return request<EmailTemplate>(`/email-template/${templateId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export function deleteEmailTemplate(templateId: string) {
  return request<EmailTemplate>(`/email-template/${templateId}`, {
    method: "DELETE",
  });
}

export function previewEmailTemplate(
  templateId: string,
  variables: Record<string, string>
) {
  return request<TemplatePreviewResult>(
    `/email-template/${templateId}/preview`,
    {
      method: "POST",
      body: JSON.stringify({ variables }),
    }
  );
}

// --- Email Campaigns ---

export function createCampaign(params: CreateCampaignParams) {
  return request<EmailCampaign>("/email-campaign", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listCampaigns(params?: { offset?: number; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return request<PaginatedResponse<EmailCampaign>>(
    `/email-campaign${qs ? `?${qs}` : ""}`
  );
}

export function getCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}`);
}

export function updateCampaign(
  campaignId: string,
  params: UpdateCampaignParams
) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export function deleteCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}`, {
    method: "DELETE",
  });
}

export function startCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}/start`, {
    method: "POST",
  });
}

export function pauseCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}/pause`, {
    method: "POST",
  });
}

export function resumeCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}/resume`, {
    method: "POST",
  });
}

export function cancelCampaign(campaignId: string) {
  return request<EmailCampaign>(`/email-campaign/${campaignId}/cancel`, {
    method: "POST",
  });
}

// --- Campaign Steps ---

export function addCampaignStep(
  campaignId: string,
  params: CreateStepParams
) {
  return request<CampaignStep>(`/email-campaign/${campaignId}/steps`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function listCampaignSteps(campaignId: string) {
  return request<CampaignStep[]>(`/email-campaign/${campaignId}/steps`);
}

export function updateCampaignStep(
  stepId: string,
  params: UpdateStepParams
) {
  return request<CampaignStep>(`/email-campaign/steps/${stepId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export function deleteCampaignStep(stepId: string) {
  return request<CampaignStep>(`/email-campaign/steps/${stepId}`, {
    method: "DELETE",
  });
}

// --- Campaign Recipients ---

export function addRecipient(
  campaignId: string,
  params: AddRecipientParams
) {
  return request<CampaignRecipient>(
    `/email-campaign/${campaignId}/recipients`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
}

export function addRecipientsFromSearch(
  campaignId: string,
  params: AddRecipientsFromSearchParams
) {
  return request<CampaignRecipient[]>(
    `/email-campaign/${campaignId}/recipients/from-search`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
}

export function listRecipients(
  campaignId: string,
  params?: { offset?: number; limit?: number }
) {
  const sp = new URLSearchParams();
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return request<PaginatedResponse<CampaignRecipient>>(
    `/email-campaign/${campaignId}/recipients${qs ? `?${qs}` : ""}`
  );
}

export function deleteRecipient(recipientId: string) {
  return request<CampaignRecipient>(
    `/email-campaign/recipients/${recipientId}`,
    { method: "DELETE" }
  );
}

// --- Campaign Analytics ---

export function getCampaignAnalytics(campaignId: string) {
  return request<CampaignAnalytics>(
    `/email-campaign/${campaignId}/analytics`
  );
}

export function listCampaignMessages(
  campaignId: string,
  params?: { offset?: number; limit?: number }
) {
  const sp = new URLSearchParams();
  if (params?.offset) sp.set("offset", String(params.offset));
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return request<PaginatedResponse<EmailMessage>>(
    `/email-campaign/${campaignId}/messages${qs ? `?${qs}` : ""}`
  );
}

// --- Email Enrichment ---

export function enrichEmail(profileId: string) {
  return request<EmailEnrichmentResult>(`/email-enrichment/${profileId}`, {
    method: "POST",
  });
}

export function getEnrichmentResult(profileId: string) {
  return request<EmailEnrichmentResult>(`/email-enrichment/${profileId}`);
}

export function enrichEmailBatch(profileIds: string[]) {
  return request<EmailEnrichmentResult[]>("/email-enrichment/batch", {
    method: "POST",
    body: JSON.stringify({ profile_ids: profileIds }),
  });
}
