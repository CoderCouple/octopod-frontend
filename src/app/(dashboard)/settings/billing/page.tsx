"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeftRightIcon,
  ChartColumnStackedIcon,
  CreditCard,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  createCheckoutSession,
  createPortalSession,
  getBillingInfo,
  getUsage,
  listInvoices,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { BillingInfo, Invoice, UsageStats } from "@/types/billing";
import { PLAN_TIERS } from "@/types/billing";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
}

function formatDate(unixSec: number): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(unixSec * 1000));
}

function formatAmount(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
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
    paid: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
    open: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[status] || variants.active}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// ── Hero (current plan + seats, gradient like context0 BalanceCard) ──

function PlanHero({ billing }: { billing: BillingInfo | null }) {
  if (!billing) return <Skeleton className="h-[166px] w-full" />;
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Current Plan
            </h3>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold capitalize text-primary">
                {billing.plan}
              </p>
              <StatusBadge status={billing.status} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>
                {billing.seat_count} seat{billing.seat_count > 1 ? "s" : ""}
              </span>
              {billing.current_period_end && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span>
                    Renews {formatDate(new Date(billing.current_period_end).getTime() / 1000)}
                  </span>
                </>
              )}
            </div>
          </div>

          <CreditCard
            size={140}
            className="absolute bottom-0 right-0 text-primary opacity-20"
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {billing.cancel_at_period_end
          ? "Subscription will cancel at the end of the billing period."
          : "Manage your seats and plan from the customer portal."}
      </CardFooter>
    </Card>
  );
}

// ── Plan picker (RadioGroup, like context0 CreditsPurchase) ──

function PlanPicker({
  currentPlan,
  onUpgrade,
  loadingPlan,
}: {
  currentPlan: string;
  onUpgrade: (plan: string) => void;
  loadingPlan: string | null;
}) {
  const upgradablePlans = PLAN_TIERS.filter((t) => t.name !== "free");
  const defaultSelected =
    upgradablePlans.find((t) => t.name !== currentPlan)?.name ?? "pro";
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="size-6 text-primary" />
          Upgrade Plan
        </CardTitle>
        <CardDescription>
          Pick a tier to upgrade. Stripe Checkout opens in a new tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={setSelected}>
          {upgradablePlans.map((pack) => {
            const isCurrent = pack.name === currentPlan;
            return (
              <div
                key={pack.name}
                className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                  isCurrent
                    ? "bg-primary/5 ring-1 ring-primary/20"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                onClick={() => !isCurrent && setSelected(pack.name)}
              >
                <RadioGroupItem
                  value={pack.name}
                  id={pack.name}
                  disabled={isCurrent}
                />
                <Label
                  htmlFor={pack.name}
                  className="flex w-full cursor-pointer justify-between"
                >
                  <div>
                    <span className="font-medium capitalize">{pack.label}</span>
                    {isCurrent && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Current
                      </Badge>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {pack.description}
                    </p>
                  </div>
                  <span className="font-bold text-primary">
                    {pack.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      /seat/mo
                    </span>
                  </span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={selected === currentPlan || loadingPlan !== null}
          onClick={() => onUpgrade(selected)}
        >
          {loadingPlan ? (
            <Loader2 className="mr-2 size-5 animate-spin" />
          ) : (
            <CreditCard className="mr-2 size-5" />
          )}
          {selected === currentPlan
            ? "Already on this plan"
            : `Upgrade to ${selected.charAt(0).toUpperCase() + selected.slice(1)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Usage card (horizontal bars; replaces context0's stacked time chart) ──

function UsageCard({ usage }: { usage: UsageStats | null }) {
  if (!usage) return <Skeleton className="h-[300px] w-full" />;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ChartColumnStackedIcon className="size-6 text-primary" />
          Plan Usage
        </CardTitle>
        <CardDescription>
          Resource consumption against your{" "}
          <span className="font-medium capitalize">{usage.plan}</span> plan limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {usage.items.map((item) => {
          const pct = item.limit > 0 ? (item.used / item.limit) * 100 : 0;
          const overLimit = item.used >= item.limit;
          const nearLimit = pct >= 80 && !overLimit;
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span
                  className={
                    overLimit
                      ? "text-red-600 dark:text-red-400"
                      : nearLimit
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-muted-foreground"
                  }
                >
                  {formatNumber(item.used)} / {formatNumber(item.limit)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    overLimit
                      ? "bg-red-500"
                      : nearLimit
                        ? "bg-yellow-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ── Transaction history (Stripe invoices) ──

function TransactionHistoryCard({ invoices }: { invoices: Invoice[] | null }) {
  if (invoices === null) return <Skeleton className="h-[300px] w-full" />;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="size-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          Past invoices for your subscription. Download PDFs from Stripe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoices.length === 0 && (
          <p className="text-muted-foreground">No invoices yet</p>
        )}
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="flex items-center gap-2 font-medium">
                {formatDate(inv.created)}
                <StatusBadge status={inv.status} />
              </p>
              <p className="text-sm text-muted-foreground">
                {inv.number ? `Invoice ${inv.number}` : `Invoice ${inv.id.slice(0, 14)}`}
              </p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <p className="font-medium">
                {formatAmount(inv.amount_paid || inv.amount_due, inv.currency)}
              </p>
              {inv.invoice_pdf && (
                <Button variant="ghost" size="sm" asChild className="gap-1.5">
                  <a
                    href={inv.invoice_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="size-3.5" />
                    PDF
                  </a>
                </Button>
              )}
              {inv.hosted_invoice_url && (
                <Button variant="ghost" size="sm" asChild className="gap-1.5">
                  <a
                    href={inv.hosted_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                    View
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [b, u, i] = await Promise.all([
        getBillingInfo(),
        getUsage().catch(() => ({ plan: "free", items: [] })),
        listInvoices().catch(() => []),
      ]);
      setBilling(b);
      setUsage(u);
      setInvoices(i);
    } catch {
      toast.error("Failed to load billing info");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // After Stripe checkout success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      toast.success("Plan upgraded successfully!");
      window.history.replaceState({}, "", window.location.pathname);
      fetchAll();
    }
  }, [fetchAll]);

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
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const data = await createPortalSession(window.location.href);
      window.location.href = data.portal_url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open portal");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="mx-auto space-y-8 p-4">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Billing</h1>
        {billing?.stripe_subscription_id && (
          <Button
            variant="outline"
            onClick={handlePortal}
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

      <PlanHero billing={billing} />

      <PlanPicker
        currentPlan={billing?.plan ?? "free"}
        onUpgrade={handleUpgrade}
        loadingPlan={checkoutLoading}
      />

      <UsageCard usage={usage} />

      <TransactionHistoryCard invoices={invoices} />
    </div>
  );
}
