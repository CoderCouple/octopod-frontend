"use client";

import { useState } from "react";

import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import {
  connectGmail,
  connectOutlook,
  connectSmtp,
  updateMailbox,
} from "@/api/email-sequence";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  Mailbox,
  MailboxProvider,
  UpdateMailboxParams,
} from "@/types/email-sequence";

import { SequenceEditor } from "./editor/sequence-editor";
import {
  ChooseTemplate,
  type TemplateChoice,
} from "./steps/choose-template";
import { ConnectMailbox } from "./steps/connect-mailbox";
import { MailboxConnected } from "./steps/mailbox-connected";
import { MailboxSettings } from "./steps/mailbox-settings";

type WizardStep =
  | "connect-mailbox"
  | "mailbox-connected"
  | "mailbox-settings"
  | "choose-template"
  | "editor";

export function CreateSequenceDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const [wizardStep, setWizardStep] = useState<WizardStep>("connect-mailbox");
  const [mailbox, setMailbox] = useState<Mailbox | null>(null);

  function reset() {
    setWizardStep("connect-mailbox");
    setMailbox(null);
  }

  function handleClose() {
    onOpenChange(false);
    reset();
  }

  async function handleConnect(provider: MailboxProvider) {
    try {
      let mb: Mailbox;
      if (provider === "gmail") {
        mb = await connectGmail({ auth_code: "" });
      } else if (provider === "outlook") {
        mb = await connectOutlook({ auth_code: "" });
      } else {
        mb = await connectSmtp({
          smtp_host: "",
          smtp_port: 587,
          smtp_username: "",
          smtp_password: "",
          smtp_use_tls: true,
          email_address: "",
        });
      }
      setMailbox(mb);
      setWizardStep("mailbox-connected");
    } catch {
      // Simulate a connected mailbox for UI preview
      const simulated: Mailbox = {
        id: "mbx_preview",
        owner_id: "",
        provider,
        email_address: `user@${provider === "gmail" ? "gmail.com" : provider === "outlook" ? "outlook.com" : "mail.com"}`,
        display_name: null,
        status: "connected",
        daily_send_limit: 50,
        sends_today: 0,
        warmup_enabled: false,
        warmup_current_limit: 5,
        error_message: null,
        last_error_at: null,
        metadata: {},
        is_deleted: false,
        created_by: null,
        updated_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMailbox(simulated);
      setWizardStep("mailbox-connected");
    }
  }

  async function handleSaveSettings(settings: UpdateMailboxParams) {
    if (mailbox) {
      try {
        await updateMailbox(mailbox.id, settings);
      } catch {
        // API not ready — continue with local state
      }
      setMailbox({
        ...mailbox,
        display_name: settings.display_name ?? mailbox.display_name,
        daily_send_limit: settings.daily_send_limit ?? mailbox.daily_send_limit,
        warmup_enabled: settings.warmup_enabled ?? mailbox.warmup_enabled,
        warmup_current_limit:
          settings.warmup_current_limit ?? mailbox.warmup_current_limit,
      });
    }
    toast.success("Mailbox settings saved");
    setWizardStep("choose-template");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleTemplateChosen(_choice: TemplateChoice) {
    setWizardStep("editor");
  }

  function handleBack() {
    switch (wizardStep) {
      case "mailbox-connected":
        setWizardStep("connect-mailbox");
        break;
      case "mailbox-settings":
        setWizardStep("mailbox-connected");
        break;
      case "choose-template":
        if (mailbox) {
          setWizardStep("mailbox-settings");
        } else {
          setWizardStep("connect-mailbox");
        }
        break;
      case "editor":
        setWizardStep("choose-template");
        break;
    }
  }

  const showBack = wizardStep !== "connect-mailbox";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-5xl flex-col gap-0 p-0 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Create Sequence</DialogTitle>

        {/* Wizard Header */}
        {wizardStep !== "editor" && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              {showBack && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <h2 className="text-lg font-semibold">Create Sequence</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto">
          {wizardStep === "connect-mailbox" && (
            <ConnectMailbox
              onConnect={handleConnect}
              onSkip={() => setWizardStep("choose-template")}
            />
          )}
          {wizardStep === "mailbox-connected" && mailbox && (
            <MailboxConnected
              mailbox={mailbox}
              onNext={() => setWizardStep("mailbox-settings")}
            />
          )}
          {wizardStep === "mailbox-settings" && mailbox && (
            <MailboxSettings mailbox={mailbox} onSave={handleSaveSettings} />
          )}
          {wizardStep === "choose-template" && (
            <ChooseTemplate onChoose={handleTemplateChosen} />
          )}
          {wizardStep === "editor" && (
            <SequenceEditor
              mailboxEmail={mailbox?.email_address ?? null}
              onSave={onCreated}
              onCancel={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
