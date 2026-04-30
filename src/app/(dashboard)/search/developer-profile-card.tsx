"use client";

import {
  ExternalLink,
  GitFork,
  Github,
  Globe,
  Plus,
  Star,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchResult } from "@/types/search";

import { formatCount, getInitials, scoreLabel } from "./utils";

function RankingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-36 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="h-2 flex-1 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-muted-foreground">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

export function DeveloperProfileCard({ result }: { result: SearchResult }) {
  const { profile, score, ranking } = result;
  const { label, className } = scoreLabel(score);

  const hasHfStats =
    profile.total_hf_models > 0 ||
    profile.total_hf_datasets > 0 ||
    profile.total_hf_downloads > 0;

  const levelLabel =
    profile.years_of_experience >= 8
      ? "SENIOR LEVEL"
      : profile.years_of_experience >= 4
        ? "MID LEVEL"
        : profile.years_of_experience > 0
          ? "JUNIOR LEVEL"
          : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* Left column — avatar & stats */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <Avatar className="size-20">
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.display_name}
              />
              <AvatarFallback className="text-xl">
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-center text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <Users className="size-3" />
                {formatCount(profile.total_followers)} followers
              </p>
              <p className="flex items-center gap-1">
                <Star className="size-3 text-yellow-500" />
                {formatCount(profile.total_stars)} stars
              </p>
            </div>
          </div>

          {/* Right column — details */}
          <div className="min-w-0 flex-1">
            {/* Row 1: name, level, social icons */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold leading-tight">
                  {profile.display_name}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  {profile.location && <span>{profile.location}</span>}
                  {profile.location && levelLabel && (
                    <span className="text-muted-foreground/40">·</span>
                  )}
                  {levelLabel && (
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {levelLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {profile.website && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    asChild
                  >
                    <a
                      href={
                        profile.website.startsWith("http")
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="size-3.5" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  asChild
                >
                  <a
                    href={`https://github.com/${profile.display_name.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Row 2: score badge + headline */}
            <div className="mt-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Badge className={`shrink-0 border-0 ${className}`}>
                  {label}
                </Badge>
                {profile.headline && (
                  <span className="truncate text-sm font-medium">
                    {profile.headline}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Row 3: stats bar */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {formatCount(profile.total_followers)} followers
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5" />
                {formatCount(profile.total_stars)} stars
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-1">
                <GitFork className="size-3.5" />
                {formatCount(profile.total_repos)} repos
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>
                {formatCount(profile.total_contributions)} contributions
              </span>
            </div>

            {/* Row 4: badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
              {profile.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="border-green-200 bg-green-50 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  {skill}
                </Badge>
              ))}
              {profile.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>

            {/* Hugging Face stats */}
            {hasHfStats && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Hugging Face:
                </span>
                {profile.total_hf_models > 0 && (
                  <span>{profile.total_hf_models} models</span>
                )}
                {profile.total_hf_datasets > 0 && (
                  <span>{profile.total_hf_datasets} datasets</span>
                )}
                {profile.total_hf_downloads > 0 && (
                  <span>
                    <ExternalLink className="mr-1 inline size-3" />
                    {formatCount(profile.total_hf_downloads)} downloads
                  </span>
                )}
              </div>
            )}

            {/* Ranking breakdown */}
            {ranking && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Ranking Breakdown
                </p>
                <RankingBar
                  label="GitHub Activity"
                  value={ranking.github_activity_score}
                />
                <RankingBar
                  label="Technical Influence"
                  value={ranking.technical_influence_score}
                />
                <RankingBar
                  label="OSS Contribution"
                  value={ranking.oss_contribution_score}
                />
                <RankingBar
                  label="Experience"
                  value={ranking.experience_score}
                />
              </div>
            )}

            {/* Add to Sequence button */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <Plus className="mr-1.5 size-3.5" />
                Add to Sequence
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
