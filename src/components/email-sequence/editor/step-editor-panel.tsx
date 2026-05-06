"use client";

import { useRef } from "react";

import { Eye, Mail, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { CampaignStep } from "@/types/email-sequence";

import { EmailBodyEditor } from "./email-body-editor";
import { VariableChips } from "./variable-chips";

export function StepEditorPanel({
  step,
  stepIndex,
  mailboxEmail,
  onUpdate,
  onDelete,
}: {
  step: CampaignStep;
  stepIndex: number;
  mailboxEmail: string | null;
  onUpdate: (updates: Partial<CampaignStep>) => void;
  onDelete: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isFirst = stepIndex === 0;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Timing Bar */}
      <div className="border-b bg-muted/30 px-6 py-3">
        {isFirst ? (
          <Badge variant="secondary">Start immediately</Badge>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Wait</span>
            <Input
              type="number"
              min={0}
              value={step.delay_days}
              onChange={(e) =>
                onUpdate({ delay_days: Math.max(0, Number(e.target.value)) })
              }
              className="h-8 w-16 text-center"
            />
            <span className="text-muted-foreground">days</span>
            <Input
              type="number"
              min={0}
              max={23}
              value={step.delay_hours}
              onChange={(e) =>
                onUpdate({
                  delay_hours: Math.min(23, Math.max(0, Number(e.target.value))),
                })
              }
              className="h-8 w-16 text-center"
            />
            <span className="text-muted-foreground">hours</span>
          </div>
        )}
      </div>

      {/* Step Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-bold">
            Step {stepIndex + 1}
          </Badge>
          <Select
            value={step.step_type}
            onValueChange={(v) =>
              onUpdate({ step_type: v as CampaignStep["step_type"] })
            }
          >
            <SelectTrigger className="h-8 w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3" /> Email
                </span>
              </SelectItem>
              <SelectItem value="wait">Wait</SelectItem>
              <SelectItem value="condition">Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Eye className="size-3.5" />
            Preview and test
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 space-y-5 p-6">
        {step.step_type === "email" && (
          <>
            {/* From / Subject */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  value={mailboxEmail ?? ""}
                  disabled
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Subject {!isFirst && "(override)"}
                </Label>
                <Input
                  value={step.subject_override ?? ""}
                  onChange={(e) =>
                    onUpdate({ subject_override: e.target.value })
                  }
                  className="h-9"
                  placeholder={
                    isFirst
                      ? "Enter subject line..."
                      : "Leave blank to use template subject"
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Variable Chips */}
            <VariableChips
              textareaRef={textareaRef}
              body={step.body_override ?? ""}
              onBodyChange={(body) => onUpdate({ body_override: body })}
            />

            {/* Email Body Editor */}
            <EmailBodyEditor
              textareaRef={textareaRef}
              body={step.body_override ?? ""}
              onBodyChange={(body) => onUpdate({ body_override: body })}
            />
          </>
        )}

        {step.step_type === "wait" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              This step will wait for the configured delay before proceeding
              to the next step.
            </p>
          </div>
        )}

        {step.step_type === "condition" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Condition Field
              </Label>
              <Input
                value={step.condition_field ?? ""}
                onChange={(e) =>
                  onUpdate({ condition_field: e.target.value || null })
                }
                className="h-9"
                placeholder="e.g. opened, clicked, replied"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Operator
                </Label>
                <Input
                  value={step.condition_op ?? ""}
                  onChange={(e) =>
                    onUpdate({ condition_op: e.target.value || null })
                  }
                  className="h-9"
                  placeholder="e.g. eq, gt, lt"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Value</Label>
                <Input
                  value={step.condition_value ?? ""}
                  onChange={(e) =>
                    onUpdate({ condition_value: e.target.value || null })
                  }
                  className="h-9"
                  placeholder="e.g. true, 1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
