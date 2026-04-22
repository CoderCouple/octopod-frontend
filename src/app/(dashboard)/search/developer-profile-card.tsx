"use client";

import { ExternalLink, GitFork, Star, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SearchResult } from "@/types/search";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function scoreColor(score: number) {
  if (score >= 0.8)
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (score >= 0.6)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
}

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

  const hasHfStats =
    profile.total_hf_models > 0 ||
    profile.total_hf_datasets > 0 ||
    profile.total_hf_downloads > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="size-16 shrink-0">
            <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            <AvatarFallback className="text-lg">
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-lg font-semibold">
                {profile.display_name}
              </h3>
              <Badge className={`${scoreColor(score)} shrink-0 border-0`}>
                {Math.round(score * 100)}%
              </Badge>
            </div>

            {profile.headline && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {profile.headline}
              </p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              {profile.location && <span>{profile.location}</span>}
              {profile.location && profile.company && <span>·</span>}
              {profile.company && <span>{profile.company}</span>}
              {profile.website && (
                <>
                  <span>·</span>
                  <a
                    href={
                      profile.website.startsWith("http")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    Website
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {profile.total_followers.toLocaleString()} followers
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5" />
            {profile.total_stars.toLocaleString()} stars
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <GitFork className="size-3.5" />
            {profile.total_repos.toLocaleString()} repos
          </span>
          <span>·</span>
          <span>
            {profile.total_contributions.toLocaleString()} contributions
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.languages.map((lang) => (
            <Badge key={lang} variant="secondary">
              {lang}
            </Badge>
          ))}
          {profile.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              {skill}
            </Badge>
          ))}
          {profile.topics.map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>

        {hasHfStats && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Hugging Face:</span>
            {profile.total_hf_models > 0 && (
              <span>{profile.total_hf_models} models</span>
            )}
            {profile.total_hf_datasets > 0 && (
              <span>{profile.total_hf_datasets} datasets</span>
            )}
            {profile.total_hf_downloads > 0 && (
              <span>
                {profile.total_hf_downloads.toLocaleString()} downloads
              </span>
            )}
          </div>
        )}

        {ranking && (
          <div className="space-y-2 pt-2">
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
            <RankingBar label="Experience" value={ranking.experience_score} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
