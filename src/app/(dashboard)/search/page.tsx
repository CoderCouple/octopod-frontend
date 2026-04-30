"use client";

import { useState } from "react";

import {
  Code,
  FileText,
  FolderOpen,
  List,
  Plus,
  SearchIcon,
  SquareUser,
  User,
} from "lucide-react";

import { searchDevelopers } from "@/api/search";
import { SearchBox } from "@/components/search-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SearchResult } from "@/types/search";

import { DeveloperListItem } from "./developer-list-item";
import { DeveloperProfileCard } from "./developer-profile-card";
import { type FilterCategory, FilterPills } from "./filter-pills";

const quickPills = [
  { label: "Skills", icon: Code, template: "Developer skilled in " },
  { label: "Username", icon: User, template: "GitHub user " },
  { label: "Project", icon: FolderOpen, template: "Developer who works on " },
  {
    label: "Job Description",
    icon: FileText,
    template: "Developer matching job description: ",
  },
];

function ResultSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-72" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "profile">("list");
  const [activeFilters, setActiveFilters] = useState<FilterCategory[]>([]);

  async function handleSearch(searchQuery?: string) {
    const q = searchQuery ?? query;
    if (!q.trim()) return;

    setSearching(true);
    try {
      const data = await searchDevelopers({ query: q.trim() });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleNewSearch() {
    setQuery("");
    setResults(null);
    setActiveFilters([]);
  }

  function toggleFilter(filter: FilterCategory) {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }

  // Hero state
  if (results === null && !searching) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_svg/octopus_happy_light.svg"
          alt="Octopod"
          className="mb-6 size-24 dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_svg/octopus_happy_white.svg"
          alt="Octopod"
          className="mb-6 hidden size-24 dark:block"
        />
        <h1 className="text-center text-3xl font-bold tracking-tight">
          Search Developers on Github
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          What kind of developer are you looking for?
        </p>

        <SearchBox
          value={query}
          onChange={setQuery}
          onSubmit={() => handleSearch()}
          placeholder='Try "ML engineer with Python and TensorFlow experience"...'
          label="Search Github"
          className="mt-8 w-full max-w-xl"
        />

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {quickPills.map((pill) => (
            <Button
              key={pill.label}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setQuery(pill.template)}
            >
              <pill.icon className="mr-1.5 size-3.5" />
              {pill.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Results state
  return (
    <div className="space-y-4">
      {/* Search bar row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search developers..."
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button
          variant="outline"
          className="shrink-0 text-green-600 hover:text-green-700 dark:text-green-400"
          onClick={handleNewSearch}
        >
          <Plus className="mr-1.5 size-4" />
          New Search
        </Button>
      </div>

      {/* Filter pills */}
      <FilterPills activeFilters={activeFilters} onToggle={toggleFilter} />

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "list" | "profile")}
        >
          <TabsList>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="size-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <SquareUser className="size-4" />
              Profile View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Sort by Most Relevant
          </span>
          {results && (
            <span className="text-sm font-medium">
              {results.length} result{results.length !== 1 && "s"}
            </span>
          )}
        </div>
      </div>

      {/* Results area */}
      {searching ? (
        <ResultSkeleton />
      ) : results && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchIcon className="mb-4 size-12 text-muted-foreground/30" />
          <p className="text-lg font-medium">No developers found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or filters
          </p>
        </div>
      ) : results && viewMode === "list" ? (
        <div className="rounded-lg border">
          {results.map((result, i) => (
            <DeveloperListItem key={i} result={result} />
          ))}
        </div>
      ) : results ? (
        <div className="space-y-4">
          {results.map((result, i) => (
            <DeveloperProfileCard key={i} result={result} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
