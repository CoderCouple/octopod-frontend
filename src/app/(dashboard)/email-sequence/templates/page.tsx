"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteEmailTemplate,
  listEmailTemplates,
} from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EmailTemplate } from "@/types/email-sequence";

import { TemplateDialog } from "./template-dialog";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await listEmailTemplates();
      setTemplates(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load templates");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  async function handleDelete(tpl: EmailTemplate) {
    if (!confirm(`Delete template "${tpl.name}"?`)) return;
    setDeletingId(tpl.id);
    try {
      await deleteEmailTemplate(tpl.id);
      toast.success("Template deleted");
      fetchTemplates();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <FileText className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
              <p className="text-sm text-muted-foreground">
                Reusable email templates for your campaigns.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
        >
          <Plus className="mr-2 size-4" />
          New template
        </Button>
      </div>

      {/* Template Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <FileText className="size-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No templates yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;New template&quot; to create your first reusable email.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              className="group transition-colors hover:border-green-300 hover:shadow-md dark:hover:border-green-700"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{tpl.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 opacity-0 group-hover:opacity-100"
                        disabled={deletingId === tpl.id}
                      >
                        {deletingId === tpl.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="size-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => setPreviewing(tpl)}>
                        <Eye className="mr-2 size-3.5" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditing(tpl)}>
                        <Pencil className="mr-2 size-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(tpl)}
                        className="text-red-600 focus:text-red-700"
                      >
                        <Trash2 className="mr-2 size-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {tpl.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  {tpl.category && (
                    <Badge variant="secondary" className="gap-1">
                      <Tag className="size-3" />
                      {tpl.category}
                    </Badge>
                  )}
                  {tpl.variables.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {tpl.variables.length} variable
                      {tpl.variables.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateDialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        template={editing}
        onSaved={fetchTemplates}
      />

      {/* Preview dialog */}
      <Dialog open={previewing !== null} onOpenChange={(o) => !o && setPreviewing(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewing?.name}</DialogTitle>
            <DialogDescription>{previewing?.subject}</DialogDescription>
          </DialogHeader>
          {previewing && (
            <div className="space-y-3">
              {previewing.variables.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {previewing.variables.map((v) => (
                    <Badge key={v} variant="outline" className="text-xs">
                      {`{{ ${v} }}`}
                    </Badge>
                  ))}
                </div>
              )}
              <div
                className="prose prose-sm max-w-none rounded-lg border bg-muted/30 p-4 dark:prose-invert"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: previewing.body_html }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
