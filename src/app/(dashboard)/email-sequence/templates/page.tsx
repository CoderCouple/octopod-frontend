"use client";

import { useCallback, useEffect, useState } from "react";

import { FileText, Loader2, Tag } from "lucide-react";

import { listEmailTemplates } from "@/api/email-sequence";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmailTemplate } from "@/types/email-sequence";

const FALLBACK_TEMPLATES: EmailTemplate[] = [
  {
    id: "etpl_1",
    owner_id: "",
    name: "Cold Outreach v1",
    category: "outreach",
    subject: "Hi {{first_name}}, quick question",
    body_html: "<p>Hi {{first_name}},</p><p>I noticed you're at {{company}}...</p>",
    body_text: null,
    variables: ["first_name", "company"],
    metadata: {},
    is_deleted: false,
    created_by: null,
    updated_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "etpl_2",
    owner_id: "",
    name: "Follow-up Nudge",
    category: "follow-up",
    subject: "Re: {{first_name}}, circling back",
    body_html: "<p>Hi {{first_name}},</p><p>Just wanted to follow up on my previous email...</p>",
    body_text: null,
    variables: ["first_name"],
    metadata: {},
    is_deleted: false,
    created_by: null,
    updated_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "etpl_3",
    owner_id: "",
    name: "Event Invite",
    category: "events",
    subject: "{{first_name}}, you're invited",
    body_html: "<p>Hi {{first_name}},</p><p>We'd love to have you at our upcoming event...</p>",
    body_text: null,
    variables: ["first_name", "company"],
    metadata: {},
    is_deleted: false,
    created_by: null,
    updated_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await listEmailTemplates();
      setTemplates(data.items);
    } catch {
      setTemplates(FALLBACK_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Template Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              className="group cursor-pointer transition-colors hover:border-green-300 hover:shadow-md dark:hover:border-green-700"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{tpl.name}</CardTitle>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                    <FileText className="size-4 text-green-600 dark:text-green-400" />
                  </div>
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
    </div>
  );
}
