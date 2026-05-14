import { authFetch } from "@/lib/api-client";
import type { BillingInfo, CheckoutResponse, PortalResponse } from "@/types/billing";

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
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed: ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.result;
}

export async function getBillingInfo(): Promise<BillingInfo> {
  return request<BillingInfo>("/billing");
}

export async function createCheckoutSession(
  plan: string,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({
      plan,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
  });
}

export async function createPortalSession(
  returnUrl: string
): Promise<PortalResponse> {
  return request<PortalResponse>("/billing/portal", {
    method: "POST",
    body: JSON.stringify({ return_url: returnUrl }),
  });
}
