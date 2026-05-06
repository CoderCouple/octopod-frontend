"use client";

import { GripVertical, Mail, Plus, Reply } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CampaignStep } from "@/types/email-sequence";

export function StepListSidebar({
  steps,
  selectedIndex,
  mailboxEmail,
  onSelect,
  onAddStep,
}: {
  steps: CampaignStep[];
  selectedIndex: number;
  mailboxEmail: string | null;
  onSelect: (index: number) => void;
  onAddStep: () => void;
}) {
  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Steps</h3>
        <p className="text-xs text-muted-foreground">
          {steps.length} step{steps.length !== 1 ? "s" : ""} in sequence
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isSelected = index === selectedIndex;

          return (
            <button
              key={step.id}
              className={cn(
                "flex w-full items-start gap-2 rounded-lg p-3 text-left transition-colors",
                isSelected
                  ? "bg-green-50 ring-1 ring-green-200 dark:bg-green-950 dark:ring-green-800"
                  : "hover:bg-muted/50"
              )}
              onClick={() => onSelect(index)}
            >
              <GripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] font-bold"
                  >
                    {index + 1}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs font-medium">
                    {isFirst ? (
                      <>
                        <Mail className="size-3" /> Email
                      </>
                    ) : (
                      <>
                        <Reply className="size-3" /> Follow-up
                      </>
                    )}
                  </span>
                </div>
                {mailboxEmail && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {mailboxEmail}
                  </p>
                )}
                {!isFirst && (step.delay_days > 0 || step.delay_hours > 0) && (
                  <p className="text-[11px] text-muted-foreground">
                    Wait{" "}
                    {step.delay_days > 0
                      ? `${step.delay_days} day${step.delay_days !== 1 ? "s" : ""}`
                      : ""}
                    {step.delay_days > 0 && step.delay_hours > 0 ? " " : ""}
                    {step.delay_hours > 0
                      ? `${step.delay_hours} hr${step.delay_hours !== 1 ? "s" : ""}`
                      : ""}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={onAddStep}
        >
          <Plus className="size-3.5" />
          Add step
        </Button>
      </div>
    </div>
  );
}
