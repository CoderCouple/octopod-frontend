"use client";

import { useState } from "react";

import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchFilters } from "@/types/search";

interface SearchFiltersSheetProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

function parseList(input: string): string[] | undefined {
  const items = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function parseInt(input: string): number | undefined {
  const n = Number(input);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function listToString(list?: string[]): string {
  return list?.join(", ") ?? "";
}

function intToString(n?: number): string {
  return n != null ? String(n) : "";
}

function activeCount(f: SearchFilters): number {
  let n = 0;
  if (f.languages?.length) n++;
  if (f.skills?.length) n++;
  if (f.topics?.length) n++;
  if (f.location) n++;
  if (f.company) n++;
  if (f.min_stars != null) n++;
  if (f.min_followers != null) n++;
  if (f.min_contributions != null) n++;
  if (f.min_experience_years != null) n++;
  return n;
}

export function SearchFiltersSheet({ filters, onChange }: SearchFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  // local draft state — only commit on Apply
  const [draft, setDraft] = useState<{
    languages: string;
    skills: string;
    topics: string;
    location: string;
    company: string;
    min_stars: string;
    min_followers: string;
    min_contributions: string;
    min_experience_years: string;
  }>({
    languages: listToString(filters.languages),
    skills: listToString(filters.skills),
    topics: listToString(filters.topics),
    location: filters.location ?? "",
    company: filters.company ?? "",
    min_stars: intToString(filters.min_stars),
    min_followers: intToString(filters.min_followers),
    min_contributions: intToString(filters.min_contributions),
    min_experience_years: intToString(filters.min_experience_years),
  });

  const count = activeCount(filters);

  function handleApply() {
    const next: SearchFilters = {
      languages: parseList(draft.languages),
      skills: parseList(draft.skills),
      topics: parseList(draft.topics),
      location: draft.location.trim() || undefined,
      company: draft.company.trim() || undefined,
      min_stars: parseInt(draft.min_stars),
      min_followers: parseInt(draft.min_followers),
      min_contributions: parseInt(draft.min_contributions),
      min_experience_years: parseInt(draft.min_experience_years),
    };
    onChange(next);
    setOpen(false);
  }

  function handleClear() {
    setDraft({
      languages: "",
      skills: "",
      topics: "",
      location: "",
      company: "",
      min_stars: "",
      min_followers: "",
      min_contributions: "",
      min_experience_years: "",
    });
    onChange({});
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="shrink-0">
          <Filter className="mr-1.5 size-4" />
          Filters
          {count > 0 && (
            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-semibold text-white">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow your developer search by skills, location, activity, and more.
          </SheetDescription>
        </SheetHeader>

        <div className="my-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="f-skills" className="text-xs text-muted-foreground">
              Skills (comma-separated)
            </Label>
            <Input
              id="f-skills"
              placeholder="pytorch, transformers, llm"
              value={draft.skills}
              onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-languages" className="text-xs text-muted-foreground">
              Languages (comma-separated)
            </Label>
            <Input
              id="f-languages"
              placeholder="python, rust, typescript"
              value={draft.languages}
              onChange={(e) => setDraft({ ...draft, languages: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-topics" className="text-xs text-muted-foreground">
              Topics (comma-separated)
            </Label>
            <Input
              id="f-topics"
              placeholder="machine-learning, computer-vision"
              value={draft.topics}
              onChange={(e) => setDraft({ ...draft, topics: e.target.value })}
            />
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="f-location" className="text-xs text-muted-foreground">
              Location
            </Label>
            <Input
              id="f-location"
              placeholder="San Francisco"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-company" className="text-xs text-muted-foreground">
              Company
            </Label>
            <Input
              id="f-company"
              placeholder="Hugging Face"
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="f-stars" className="text-xs text-muted-foreground">
                Min stars
              </Label>
              <Input
                id="f-stars"
                type="number"
                placeholder="100"
                value={draft.min_stars}
                onChange={(e) => setDraft({ ...draft, min_stars: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-followers" className="text-xs text-muted-foreground">
                Min followers
              </Label>
              <Input
                id="f-followers"
                type="number"
                placeholder="50"
                value={draft.min_followers}
                onChange={(e) => setDraft({ ...draft, min_followers: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-contribs" className="text-xs text-muted-foreground">
                Min contributions
              </Label>
              <Input
                id="f-contribs"
                type="number"
                placeholder="500"
                value={draft.min_contributions}
                onChange={(e) =>
                  setDraft({ ...draft, min_contributions: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-experience" className="text-xs text-muted-foreground">
                Min experience (years)
              </Label>
              <Input
                id="f-experience"
                type="number"
                placeholder="3"
                value={draft.min_experience_years}
                onChange={(e) =>
                  setDraft({ ...draft, min_experience_years: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={handleClear} className="text-muted-foreground">
            <X className="mr-1.5 size-4" />
            Clear all
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
          >
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
