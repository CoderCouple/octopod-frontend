// --- Billing API response types ---

export interface BillingInfo {
  plan: string;
  status: string;
  seat_count: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalResponse {
  portal_url: string;
}

// --- Plan display ---

export interface PlanTier {
  name: string;
  label: string;
  price: string;
  description: string;
  limits: {
    emails_per_month: number;
    mailboxes: number;
    campaigns: number;
    developer_profiles: number;
    ingestion_jobs_per_month: number;
    enrichment_calls_per_month: number;
    projects: number;
    org_members: number;
  };
  featured?: boolean;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    name: "free",
    label: "Free",
    price: "$0",
    description: "For individuals getting started",
    limits: {
      emails_per_month: 200,
      mailboxes: 1,
      campaigns: 2,
      developer_profiles: 100,
      ingestion_jobs_per_month: 5,
      enrichment_calls_per_month: 50,
      projects: 1,
      org_members: 1,
    },
  },
  {
    name: "pro",
    label: "Pro",
    price: "$29",
    description: "For growing teams",
    limits: {
      emails_per_month: 5_000,
      mailboxes: 5,
      campaigns: 20,
      developer_profiles: 5_000,
      ingestion_jobs_per_month: 50,
      enrichment_calls_per_month: 2_000,
      projects: 10,
      org_members: 10,
    },
    featured: true,
  },
  {
    name: "enterprise",
    label: "Enterprise",
    price: "$99",
    description: "For large organizations",
    limits: {
      emails_per_month: 100_000,
      mailboxes: 50,
      campaigns: 200,
      developer_profiles: 100_000,
      ingestion_jobs_per_month: 500,
      enrichment_calls_per_month: 50_000,
      projects: 100,
      org_members: 100,
    },
  },
];
