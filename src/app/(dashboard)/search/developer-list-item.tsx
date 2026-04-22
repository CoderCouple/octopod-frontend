"use client";

import { MapPin, Star, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

export function DeveloperListItem({ result }: { result: SearchResult }) {
  const { profile, score } = result;

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <Avatar className="size-12 shrink-0">
        <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
        <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{profile.display_name}</span>
          {profile.current_title && (
            <span className="truncate text-sm text-muted-foreground">
              {profile.current_title}
            </span>
          )}
          {profile.location && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {profile.location}
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
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
          {profile.skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="border-green-200 bg-green-50 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {profile.total_followers.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5" />
            {profile.total_stars.toLocaleString()}
          </span>
        </div>

        <Badge className={`${scoreColor(score)} border-0`}>
          {Math.round(score * 100)}%
        </Badge>
      </div>
    </div>
  );
}
