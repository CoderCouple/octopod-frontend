"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const FILTER_CATEGORIES = [
  "Role",
  "Skills",
  "Experience",
  "Location",
  "Domain",
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];

interface FilterPillsProps {
  activeFilters: FilterCategory[];
  onToggle: (filter: FilterCategory) => void;
}

export function FilterPills({ activeFilters, onToggle }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_CATEGORIES.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <Button
            key={filter}
            variant="outline"
            size="sm"
            onClick={() => onToggle(filter)}
            className={`rounded-full ${
              isActive
                ? "border-green-500 text-green-600 hover:border-green-600 hover:text-green-700 dark:border-green-500 dark:text-green-400 dark:hover:border-green-400"
                : ""
            }`}
          >
            {isActive && <Check className="mr-1.5 size-3.5" />}
            {filter}
          </Button>
        );
      })}
    </div>
  );
}
