"use client";

import { useRef, useState } from "react";

import { ArrowUpRight, FileText, Paperclip, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Attachment {
  file: File;
  name: string;
}

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFileUpload?: (files: File[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  showAttach?: boolean;
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  onFileUpload,
  placeholder = "Search...",
  label = "Search",
  disabled = false,
  className,
  showAttach = true,
}: SearchBoxProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newAttachments = Array.from(files).map((file) => ({
      file,
      name: file.name,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    onFileUpload?.(Array.from(files));
    setMenuOpen(false);
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-muted/50 ring-1 ring-border transition-all focus-within:ring-2 focus-within:ring-green-500/40",
        className
      )}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="min-h-0 resize-none border-0 bg-transparent px-4 pb-2 pt-4 text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs ring-1 ring-border"
            >
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="max-w-[120px] truncate">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-1">
          {showAttach && (
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 z-50 mb-2 w-52 rounded-xl border bg-popover p-1 shadow-lg">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="size-4 text-muted-foreground" />
                      Add Files
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => {
                        onChange("Paste job description:\n\n");
                        setMenuOpen(false);
                      }}
                    >
                      <FileText className="size-4 text-muted-foreground" />
                      Paste Job Description
                    </button>
                  </div>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          )}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>

        <Button
          size="icon"
          className="size-8 rounded-full"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        >
          <ArrowUpRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
