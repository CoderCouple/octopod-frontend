"use client";

import { useState } from "react";

import { Loader2, Lock, Server } from "lucide-react";
import { toast } from "sonner";

import { connectSmtp } from "@/api/email-sequence";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Mailbox } from "@/types/email-sequence";

export function SmtpCredentials({
  onConnected,
}: {
  onConnected: (mb: Mailbox) => void;
}) {
  const [emailAddress, setEmailAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [useTls, setUseTls] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!emailAddress.trim() || !smtpHost.trim() || !smtpUsername.trim() || !smtpPassword) {
      toast.error("Email, host, username, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const mb = await connectSmtp({
        email_address: emailAddress.trim(),
        display_name: displayName.trim() || null,
        smtp_host: smtpHost.trim(),
        smtp_port: Number(smtpPort) || 587,
        smtp_username: smtpUsername.trim(),
        smtp_password: smtpPassword,
        smtp_use_tls: useTls,
      });
      toast.success("SMTP mailbox connected");
      onConnected(mb);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect SMTP");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-8">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Server className="size-5 text-slate-600 dark:text-slate-400" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">SMTP credentials</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Provide your SMTP server details. Credentials are encrypted at rest.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="s-email" className="text-xs">
              Email address *
            </Label>
            <Input
              id="s-email"
              type="email"
              placeholder="user@example.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="s-display" className="text-xs">
              Display name
            </Label>
            <Input
              id="s-display"
              placeholder="Jane Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-host" className="text-xs">
              SMTP host *
            </Label>
            <Input
              id="s-host"
              placeholder="smtp.gmail.com"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-port" className="text-xs">
              Port *
            </Label>
            <Input
              id="s-port"
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="s-username" className="text-xs">
              Username *
            </Label>
            <Input
              id="s-username"
              placeholder="user@example.com"
              value={smtpUsername}
              onChange={(e) => setSmtpUsername(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="s-password" className="text-xs">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="s-password"
                type="password"
                className="pl-9"
                placeholder="App password or SMTP password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              id="s-tls"
              checked={useTls}
              onCheckedChange={(c) => setUseTls(c === true)}
            />
            <Label htmlFor="s-tls" className="cursor-pointer text-xs">
              Use TLS / STARTTLS (recommended)
            </Label>
          </div>
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
          <Server className="mr-2 size-4" />
        )}
        Connect SMTP
      </Button>
    </div>
  );
}
