"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { connectGmail } from "@/api/email-sequence";

function decodeState(state: string | null): { return_to?: string } {
  if (!state) return {};
  try {
    const padded = state + "=".repeat((4 - (state.length % 4)) % 4);
    const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function GoogleOauthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const errorParam = params.get("error");
  const state = params.get("state");
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState<string>("Connecting your Gmail account…");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (errorParam) {
        setStatus("error");
        setMessage(`Google returned: ${errorParam}`);
        return;
      }
      if (!code) {
        setStatus("error");
        setMessage("Missing authorization code. Please try connecting again.");
        return;
      }
      try {
        const mailbox = await connectGmail({ auth_code: code });
        if (cancelled) return;
        setStatus("ok");
        setMessage(`Connected ${mailbox.email_address}. Redirecting…`);
        const { return_to } = decodeState(state);
        setTimeout(() => {
          router.replace(return_to || "/email-sequence/mailboxes");
        }, 1000);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          e instanceof Error ? e.message : "Failed to connect Gmail mailbox"
        );
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [code, errorParam, state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        {status === "working" && (
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        )}
        {status === "ok" && <CheckCircle2 className="size-8 text-green-500" />}
        {status === "error" && <XCircle className="size-8 text-red-500" />}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
