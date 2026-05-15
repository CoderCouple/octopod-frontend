"use client";

import { useEffect, useState } from "react";

import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createEmailTemplate,
  updateEmailTemplate,
} from "@/api/email-sequence";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmailTemplate } from "@/types/email-sequence";

export function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null; // null = create mode
  onSaved: () => void;
}) {
  const isEdit = template !== null;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(template?.name ?? "");
      setCategory(template?.category ?? "");
      setSubject(template?.subject ?? "");
      setBodyHtml(template?.body_html ?? "");
    }
  }, [open, template]);

  async function handleSave() {
    if (!name.trim() || !subject.trim() || !bodyHtml.trim()) {
      toast.error("Name, subject, and body are required");
      return;
    }
    setSaving(true);
    try {
      if (template) {
        await updateEmailTemplate(template.id, {
          name: name.trim(),
          category: category.trim() || null,
          subject: subject.trim(),
          body_html: bodyHtml,
        });
        toast.success("Template updated");
      } else {
        await createEmailTemplate({
          name: name.trim(),
          category: category.trim() || null,
          subject: subject.trim(),
          body_html: bodyHtml,
        });
        toast.success("Template created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit template" : "New template"}</DialogTitle>
          <DialogDescription>
            Use {`{{ first_name }}, {{ company }}, {{ email }}`} etc. for
            variable substitution at send time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="t-name" className="text-xs">
                Template name *
              </Label>
              <Input
                id="t-name"
                placeholder="Cold Outreach v1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-category" className="text-xs">
                Category
              </Label>
              <Input
                id="t-category"
                placeholder="outreach"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-subject" className="text-xs">
              Subject *
            </Label>
            <Input
              id="t-subject"
              placeholder="Hi {{ first_name }}, quick question"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-body" className="text-xs">
              Body (HTML) *
            </Label>
            <Textarea
              id="t-body"
              placeholder={
                "<p>Hi {{ first_name }},</p>\n<p>I noticed you're at {{ company }}...</p>"
              }
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={10}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
          >
            {saving ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Save className="mr-2 size-3.5" />
            )}
            {isEdit ? "Save changes" : "Create template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
