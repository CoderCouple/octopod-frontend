"use client";

import { useState } from "react";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Mailbox, UpdateMailboxParams } from "@/types/email-sequence";

export function MailboxSettings({
  mailbox,
  onSave,
}: {
  mailbox: Mailbox;
  onSave: (settings: UpdateMailboxParams) => void;
}) {
  const [displayName, setDisplayName] = useState(mailbox.display_name ?? "");
  const [dailySendLimit, setDailySendLimit] = useState(
    mailbox.daily_send_limit
  );
  const [warmupEnabled, setWarmupEnabled] = useState(mailbox.warmup_enabled);
  const [warmupLimit, setWarmupLimit] = useState(mailbox.warmup_current_limit);

  function handleSave() {
    onSave({
      display_name: displayName || null,
      daily_send_limit: dailySendLimit,
      warmup_enabled: warmupEnabled,
      warmup_current_limit: warmupLimit,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Mailbox Settings
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure sending preferences for {mailbox.email_address}
          </p>
        </div>

        <div className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Daily Send Limit */}
          <div className="space-y-2">
            <Label>Daily Send Limit</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                onClick={() =>
                  setDailySendLimit(Math.max(1, dailySendLimit - 5))
                }
              >
                <Minus className="size-4" />
              </Button>
              <Input
                type="number"
                value={dailySendLimit}
                onChange={(e) =>
                  setDailySendLimit(
                    Math.min(500, Math.max(1, Number(e.target.value)))
                  )
                }
                className="w-24 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                onClick={() =>
                  setDailySendLimit(Math.min(500, dailySendLimit + 5))
                }
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum 500 emails per day
            </p>
          </div>

          {/* Warmup */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="warmup-enabled"
                checked={warmupEnabled}
                onCheckedChange={(checked) =>
                  setWarmupEnabled(checked === true)
                }
              />
              <Label htmlFor="warmup-enabled" className="font-normal">
                Enable email warmup
              </Label>
            </div>
            {warmupEnabled && (
              <div className="space-y-2 pl-6">
                <Label className="text-xs text-muted-foreground">
                  Warmup Limit (emails/day during warmup)
                </Label>
                <Input
                  type="number"
                  value={warmupLimit}
                  onChange={(e) =>
                    setWarmupLimit(
                      Math.min(100, Math.max(1, Number(e.target.value)))
                    )
                  }
                  className="h-9 w-24"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/20 hover:from-green-700 hover:to-emerald-600"
        >
          Save and continue
        </Button>
      </div>
    </div>
  );
}
