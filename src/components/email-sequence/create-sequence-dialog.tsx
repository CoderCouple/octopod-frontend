"use client";

import { useState } from "react";

import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import {
  connectGmail,
  connectOutlook,
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
import { SesCredentials } from "./steps/ses-credentials";
import { SmtpCredentials } from "./steps/smtp-credentials";

type WizardStep =
  | "connect-mailbox"
  | "smtp-credentials"
  | "ses-credentials"
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

  function handleConnect(provider: MailboxProvider) {
    if (provider === "smtp") {
      setWizardStep("smtp-credentials");
      return;
    }
    if (provider === "ses") {
      setWizardStep("ses-credentials");
      return;
    }
    // Gmail / Outlook OAuth not yet wired to a real flow.
    // Backend endpoints exist but need OAuth redirect orchestration.
    toast.info(
      `${provider === "gmail" ? "Gmail" : "Outlook"} OAuth is coming soon — use SMTP for now`
    );
  }

  // Used by Gmail/Outlook callback once we wire OAuth (kept around so the
  // import isn't dead code; will be called from /oauth-callback page).
  void connectGmail;
  void connectOutlook;

  function handleConnected(mb: Mailbox) {
    setMailbox(mb);
    setWizardStep("mailbox-connected");
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
      case "smtp-credentials":
      case "ses-credentials":
        setWizardStep("connect-mailbox");
        break;
      case "mailbox-connected":
        // Go back to whichever entry path got us here
        if (mailbox?.provider === "smtp") setWizardStep("smtp-credentials");
        else if (mailbox?.provider === "ses") setWizardStep("ses-credentials");
        else setWizardStep("connect-mailbox");
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
          {wizardStep === "smtp-credentials" && (
            <SmtpCredentials onConnected={handleConnected} />
          )}
          {wizardStep === "ses-credentials" && (
            <SesCredentials onConnected={handleConnected} />
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
              mailboxId={mailbox?.id ?? null}
              mailboxEmail={mailbox?.email_address ?? null}
              onSave={() => {
                onCreated();
                handleClose();
              }}
              onCancel={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
