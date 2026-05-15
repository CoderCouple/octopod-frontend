"use client";

import { useState } from "react";

import { Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

import { addCampaignStep, createCampaign } from "@/api/email-sequence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CampaignStep } from "@/types/email-sequence";

import { StepEditorPanel } from "./step-editor-panel";
import { StepListSidebar } from "./step-list-sidebar";

function makeDefaultStep(order: number): CampaignStep {
  return {
    id: `cstp_local_${Date.now()}_${order}`,
    campaign_id: "",
    template_id: null,
    step_order: order,
    step_type: "email",
    delay_days: order === 1 ? 0 : 2,
    delay_hours: 0,
    subject_override: "",
    body_override: "",
    condition_field: null,
    condition_op: null,
    condition_value: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function SequenceEditor({
  mailboxId,
  mailboxEmail,
  onSave,
  onCancel,
}: {
  mailboxId: string | null;
  mailboxEmail: string | null;
  onSave: (campaignId: string) => void;
  onCancel: () => void;
}) {
  const [sequenceName, setSequenceName] = useState("Untitled Sequence");
  const [steps, setSteps] = useState<CampaignStep[]>([makeDefaultStep(1)]);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const selectedStep = steps[selectedStepIndex] ?? steps[0];

  function handleAddStep() {
    const newStep = makeDefaultStep(steps.length + 1);
    setSteps([...steps, newStep]);
    setSelectedStepIndex(steps.length);
    setDirty(true);
  }

  function handleUpdateStep(updates: Partial<CampaignStep>) {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === selectedStepIndex ? { ...s, ...updates } : s
      )
    );
    setDirty(true);
  }

  function handleDeleteStep() {
    if (steps.length <= 1) {
      toast.error("Campaign must have at least one step");
      return;
    }
    setSteps((prev) => prev.filter((_, i) => i !== selectedStepIndex));
    setSelectedStepIndex(Math.max(0, selectedStepIndex - 1));
    setDirty(true);
  }

  async function handleSave() {
    if (!mailboxId) {
      toast.error("Connect a mailbox before saving the sequence");
      return;
    }
    if (!sequenceName.trim()) {
      toast.error("Sequence name is required");
      return;
    }

    setSaving(true);
    try {
      // 1. Create the campaign (status: draft)
      const campaign = await createCampaign({
        name: sequenceName.trim(),
        mailbox_id: mailboxId,
        track_opens: true,
        track_clicks: true,
        stop_on_reply: true,
      });

      // 2. Persist each step in order. Don't fail the whole save if one
      //    step errors — surface the count and let the user retry.
      let stepsSaved = 0;
      for (const step of steps) {
        try {
          await addCampaignStep(campaign.id, {
            template_id: step.template_id ?? null,
            step_type: step.step_type,
            delay_days: step.delay_days,
            delay_hours: step.delay_hours,
            subject_override: step.subject_override || null,
            body_override: step.body_override || null,
            condition_field: step.condition_field,
            condition_op: step.condition_op,
            condition_value: step.condition_value,
          });
          stepsSaved += 1;
        } catch (err) {
          console.error("Failed to save step", step.step_order, err);
        }
      }

      setDirty(false);
      if (stepsSaved === steps.length) {
        toast.success(`Campaign saved (${stepsSaved} step${stepsSaved !== 1 ? "s" : ""})`);
      } else {
        toast.warning(
          `Campaign created but only ${stepsSaved}/${steps.length} steps saved`
        );
      }
      onSave(campaign.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Input
            value={sequenceName}
            onChange={(e) => {
              setSequenceName(e.target.value);
              setDirty(true);
            }}
            className="h-8 w-64 border-transparent bg-transparent text-lg font-semibold hover:border-border focus:border-border"
          />
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-8">
            <Settings className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={saving || !dirty}
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
          >
            {saving && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid flex-1 grid-cols-[320px_1fr] overflow-hidden">
        <StepListSidebar
          steps={steps}
          selectedIndex={selectedStepIndex}
          mailboxEmail={mailboxEmail}
          onSelect={setSelectedStepIndex}
          onAddStep={handleAddStep}
        />
        {selectedStep && (
          <StepEditorPanel
            step={selectedStep}
            stepIndex={selectedStepIndex}
            mailboxEmail={mailboxEmail}
            onUpdate={handleUpdateStep}
            onDelete={handleDeleteStep}
          />
        )}
      </div>
    </div>
  );
}
