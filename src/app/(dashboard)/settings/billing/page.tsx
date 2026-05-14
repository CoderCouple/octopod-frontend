"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  createCheckoutSession,
  createPortalSession,
  getBillingInfo,
} from "@/api/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BillingInfo } from "@/types/billing";
import { PLAN_TIERS } from "@/types/billing";

function formatNumber(n: number): string {
  if (n >= 100_000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(0)}k`;
  return n.toString();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
    past_due:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
    canceled:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    trialing:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[status] || variants.active}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchBilling = useCallback(async () => {
    try {
      const data = await getBillingInfo();
      setBilling(data);
    } catch {
      toast.error("Failed to load billing info");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  async function handleUpgrade(plan: string) {
    setCheckoutLoading(plan);
    try {
      const currentUrl = window.location.href;
      const data = await createCheckoutSession(
        plan,
        `${currentUrl}?upgraded=true`,
        currentUrl
      );
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create checkout"
      );
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const data = await createPortalSession(window.location.href);
      window.location.href = data.portal_url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to open portal"
      );
    } finally {
      setPortalLoading(false);
    }
  }

  // Show upgrade success toast
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      toast.success("Plan upgraded successfully!");
      window.history.replaceState({}, "", window.location.pathname);
      fetchBilling();
    }
  }, [fetchBilling]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlan = billing?.plan || "free";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <CreditCard className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Billing & Plans
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your subscription and billing details.
              </p>
            </div>
          </div>
        </div>
        {billing?.stripe_subscription_id && (
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={portalLoading}
          >
            {portalLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ExternalLink className="mr-2 size-4" />
            )}
            Manage Subscription
          </Button>
        )}
      </div>

      {/* Current Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold capitalize">
                  {currentPlan}
                </span>
                <StatusBadge status={billing?.status || "active"} />
              </div>
              {billing?.cancel_at_period_end && (
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  Cancels at end of billing period
                </p>
              )}
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>
                {billing?.seat_count || 1} seat
                {(billing?.seat_count || 1) > 1 ? "s" : ""}
              </span>
            </div>
            {billing?.current_period_end && (
              <>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-sm text-muted-foreground">
                  Renews {formatDate(billing.current_period_end)}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLAN_TIERS.map((tier) => {
            const isCurrent = tier.name === currentPlan;
            const isUpgrade =
              !isCurrent &&
              PLAN_TIERS.findIndex((t) => t.name === tier.name) >
                PLAN_TIERS.findIndex((t) => t.name === currentPlan);

            return (
              <Card
                key={tier.name}
                className={`relative ${tier.featured ? "border-green-500/50 shadow-lg shadow-green-500/10" : ""}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-sm">
                      <Sparkles className="mr-1 size-3" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.label}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">/seat/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Emails/month",
                      value: tier.limits.emails_per_month,
                    },
                    { label: "Mailboxes", value: tier.limits.mailboxes },
                    { label: "Campaigns", value: tier.limits.campaigns },
                    { label: "Profiles", value: tier.limits.developer_profiles },
                    {
                      label: "Ingestion jobs/mo",
                      value: tier.limits.ingestion_jobs_per_month,
                    },
                    {
                      label: "Enrichment calls/mo",
                      value: tier.limits.enrichment_calls_per_month,
                    },
                    { label: "Projects", value: tier.limits.projects },
                    { label: "Team members", value: tier.limits.org_members },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="size-4 shrink-0 text-green-500" />
                      <span className="text-muted-foreground">
                        {item.label}:
                      </span>
                      <span className="font-medium">
                        {formatNumber(item.value)}
                      </span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  {isCurrent ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      className={`w-full ${tier.featured ? "bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600" : ""}`}
                      onClick={() => handleUpgrade(tier.name)}
                      disabled={checkoutLoading !== null}
                    >
                      {checkoutLoading === tier.name ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 size-4" />
                      )}
                      Upgrade to {tier.label}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="ghost" disabled>
                      Included in your plan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
