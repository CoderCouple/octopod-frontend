"use client";

import type { RefObject } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AI_COMMANDS = [
  { key: "ai_personalize", label: "AI Personalize" },
  { key: "ai_icebreaker", label: "AI Icebreaker" },
];

const SNIPPETS = [
  { key: "first_name", label: "First Name" },
  { key: "current_company", label: "Current Company" },
  { key: "job_title", label: "Job Title" },
  { key: "education", label: "Education" },
  { key: "sender_first_name", label: "Sender First Name" },
  { key: "sender_company", label: "Sender Company" },
];

function insertVariable(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  variableKey: string,
  body: string,
  onBodyChange: (body: string) => void
) {
  const el = textareaRef.current;
  if (!el) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const token = `{{${variableKey}}}`;
  const newBody = body.slice(0, start) + token + body.slice(end);
  onBodyChange(newBody);

  // Restore cursor position after React re-render
  const cursorPos = start + token.length;
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(cursorPos, cursorPos);
  });
}

export function VariableChips({
  textareaRef,
  body,
  onBodyChange,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  onBodyChange: (body: string) => void;
}) {
  return (
    <Tabs defaultValue="snippets" className="w-full">
      <TabsList className="h-8">
        <TabsTrigger value="ai" className="text-xs">
          AI Command
        </TabsTrigger>
        <TabsTrigger value="snippets" className="text-xs">
          Snippets
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ai" className="mt-2">
        <div className="flex flex-wrap gap-1.5">
          {AI_COMMANDS.map((v) => (
            <button
              key={v.key}
              type="button"
              className="rounded-full border bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
              onClick={() =>
                insertVariable(textareaRef, v.key, body, onBodyChange)
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="snippets" className="mt-2">
        <div className="flex flex-wrap gap-1.5">
          {SNIPPETS.map((v) => (
            <button
              key={v.key}
              type="button"
              className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted/80"
              onClick={() =>
                insertVariable(textareaRef, v.key, body, onBodyChange)
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
