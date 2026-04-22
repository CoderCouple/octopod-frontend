"use client";

import { useState } from "react";

import { Github, List, Loader2, SearchIcon, SquareUser } from "lucide-react";

import { searchDevelopers } from "@/api/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { SearchResult } from "@/types/search";

import { DeveloperListItem } from "./developer-list-item";
import { DeveloperProfileCard } from "./developer-profile-card";

const quickPills = [
  { label: "Skills", template: "Developer skilled in " },
  { label: "Username", template: "GitHub user " },
  { label: "Location", template: "Developer based in " },
  { label: "Language", template: "Developer who writes " },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "profile">("list");

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
  }

  // Hero state
  if (results === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Github className="mb-6 size-16 text-muted-foreground/40" />
        <h1 className="text-3xl font-bold tracking-tight">Search Developers</h1>
        <p className="mt-2 text-muted-foreground">
          What kind of developer are you looking for?
        </p>

        <div className="mt-8 w-full max-w-xl">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for "ML engineer with Python and TensorFlow"...'
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSearch()}
              disabled={searching || !query.trim()}
            >
              {searching ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 size-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {quickPills.map((pill) => (
            <Button
              key={pill.label}
              variant="outline"
              size="sm"
              onClick={() => setQuery(pill.template)}
            >
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
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers..."
          className="max-w-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button onClick={() => handleSearch()} disabled={searching}>
          {searching ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <SearchIcon className="mr-2 size-4" />
          )}
          Search
        </Button>
        <Button variant="outline" onClick={handleNewSearch}>
          New Search
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "list" | "profile")}
        >
          <TabsList>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="size-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <SquareUser className="size-4" />
              Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 && "s"}
        </span>
      </div>

      {searching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">No developers found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No developers found matching your query
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {results.map((result, i) => (
            <DeveloperListItem key={i} result={result} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, i) => (
            <DeveloperProfileCard key={i} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
