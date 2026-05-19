"use client";

import { useState } from "react";

import { Cloud, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { connectSes } from "@/api/email-sequence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Mailbox } from "@/types/email-sequence";

export function SesCredentials({
  onConnected,
}: {
  onConnected: (mb: Mailbox) => void;
}) {
  const [emailAddress, setEmailAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!emailAddress.trim()) {
      toast.error("Email address is required");
      return;
    }
    setSubmitting(true);
    try {
      const mb = await connectSes({
        email_address: emailAddress.trim(),
        display_name: displayName.trim() || null,
      });
      toast.success("SES mailbox connected");
      onConnected(mb);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect SES");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-8">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900">
          <Cloud className="size-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Connect Amazon SES</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The sender email must be a <strong>verified identity</strong> in your AWS SES
          account. Authentication uses the workspace AWS IAM role — no keys needed here.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ses-email" className="text-xs">
            From email address *
          </Label>
          <Input
            id="ses-email"
            type="email"
            placeholder="outreach@yourdomain.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Must be verified in SES Console → Verified identities.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ses-display" className="text-xs">
            Display name
          </Label>
          <Input
            id="ses-display"
            placeholder="Jane @ YourCo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
      >
        {submitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Cloud className="mr-2 size-4" />
        )}
        Connect SES
      </Button>
    </div>
  );
}
