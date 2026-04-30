"use client";

import { Clock, MapPin, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SearchResult } from "@/types/search";

import { formatCount, getInitials, scoreLabel } from "./utils";

export function DeveloperListItem({ result }: { result: SearchResult }) {
  const { profile, score } = result;
  const { label, className } = scoreLabel(score);

  return (
    <>
      <div className="grid grid-cols-[1fr_180px_1fr] items-start gap-6 rounded-lg px-4 py-4 transition-colors hover:bg-muted/50">
        {/* DEVELOPER column */}
        <div className="flex items-start gap-3">
          <Avatar className="size-11 shrink-0">
            <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold">
                {profile.display_name}
              </span>
              {profile.current_title && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {profile.current_title}
                </Badge>
              )}
            </div>

            {profile.company && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {profile.company}
              </p>
            )}

            {profile.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {profile.location}
              </p>
            )}

            {profile.years_of_experience > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {profile.years_of_experience}y experience
              </p>
            )}
          </div>
        </div>

        {/* STATS column */}
        <div className="space-y-1 pt-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Star className="size-3.5 text-yellow-500" />
            {formatCount(profile.total_stars)} total stars
          </p>
          <p className="text-xs">
            {formatCount(profile.total_followers)} followers
          </p>
        </div>

        {/* DETAILS column */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge className={`shrink-0 border-0 ${className}`}>{label}</Badge>
            {profile.headline && (
              <span className="truncate text-sm text-muted-foreground">
                {profile.headline}
              </span>
            )}
          </div>

          {profile.bio && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {profile.bio}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {profile.languages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-green-500" />
                {lang}
              </span>
            ))}
            {profile.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-green-500" />
                {skill}
              </span>
            ))}
            {profile.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}
