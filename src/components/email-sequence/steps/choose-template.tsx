"use client";

import { Clock, Copy, Layers, Plus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type TemplateChoice =
  | { type: "ai" }
  | { type: "scratch" }
  | { type: "clone" }
  | { type: "preset"; templateId: string };

const PRESET_TEMPLATES = [
  {
    id: "tpl-focused",
    name: "Focused Outreach",
    steps: 3,
    days: 6,
  },
  {
    id: "tpl-multichannel",
    name: "Multi-channel Outreach",
    steps: 4,
    days: 8,
  },
];

export function ChooseTemplate({
  onChoose,
}: {
  onChoose: (choice: TemplateChoice) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            How do you want to start?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a starting point for your sequence.
          </p>
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            className="h-16 justify-start gap-3 text-left"
            onClick={() => onChoose({ type: "ai" })}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
              <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Generate with AI</div>
              <div className="text-xs text-muted-foreground">
                Describe your goal and let AI create the sequence
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start gap-3 text-left"
            onClick={() => onChoose({ type: "scratch" })}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
              <Plus className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Start from scratch</div>
              <div className="text-xs text-muted-foreground">
                Build your sequence step by step
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start gap-3 text-left"
            onClick={() => onChoose({ type: "clone" })}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
              <Copy className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Clone existing</div>
              <div className="text-xs text-muted-foreground">
                Duplicate an existing sequence and modify it
              </div>
            </div>
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Templates
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESET_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                className="rounded-lg border p-4 text-left transition-colors hover:border-green-300 hover:bg-muted/50 dark:hover:border-green-700"
                onClick={() =>
                  onChoose({ type: "preset", templateId: tpl.id })
                }
              >
                <div className="text-sm font-medium">{tpl.name}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Layers className="size-3" />
                    {tpl.steps} steps
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Clock className="size-3" />
                    {tpl.days} days
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
