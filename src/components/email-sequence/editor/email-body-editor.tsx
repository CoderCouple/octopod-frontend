"use client";

import type { RefObject } from "react";

import { Bold, Italic, Link, List, Underline } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function EmailBodyEditor({
  textareaRef,
  body,
  onBodyChange,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  onBodyChange: (body: string) => void;
}) {
  return (
    <div className="space-y-0 rounded-lg border">
      {/* Decorative Toolbar (non-functional V1) */}
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
        <Button variant="ghost" size="icon" className="size-7" disabled>
          <Bold className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7" disabled>
          <Italic className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7" disabled>
          <Underline className="size-3.5" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button variant="ghost" size="icon" className="size-7" disabled>
          <List className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7" disabled>
          <Link className="size-3.5" />
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        placeholder="Write your email body here... Use variable chips above to insert personalized content."
        className="min-h-[200px] resize-y rounded-none border-0 focus-visible:ring-0"
        rows={10}
      />
    </div>
  );
}
