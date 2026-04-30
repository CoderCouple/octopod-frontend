"use client";

import { useEffect, useRef, useState } from "react";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconExternalLink,
  IconFlame,
  IconGitCommit,
  IconGitFork,
  IconMapPin,
  IconStar,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

// ── Types ──

interface Project {
  name: string;
  stars: number;
  forks: number;
  description: string;
  languages: string[];
  highlighted?: boolean;
}

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Profile {
  name: string;
  username: string;
  location: string;
  title: string;
  badge: string;
  badgeColor: string;
  tscore: number;
  tier: string;
  tierColor: string;
  contributions: number;
  heatmap: number[][];
  stats: Stat[];
  projects: Project[];
  languages: string[];
  linkedinHeadline: string;
  followers: number;
}

// ── Generate a mock heatmap ──

function generateHeatmap(seed: number): number[][] {
  const rows = 7;
  const cols = 52;
  const grid: number[][] = [];
  let s = seed;
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const weekFactor = c > 15 && c < 45 ? 1.5 : 0.8;
      const dayFactor = r >= 1 && r <= 5 ? 1.3 : 0.6;
      const raw = ((s % 100) / 100) * weekFactor * dayFactor;
      if (raw < 0.25) row.push(0);
      else if (raw < 0.45) row.push(1);
      else if (raw < 0.65) row.push(2);
      else if (raw < 0.82) row.push(3);
      else row.push(4);
    }
    grid.push(row);
  }
  return grid;
}

const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

// ── Mock data ──

const profiles: Profile[] = [
  {
    name: "AKIRA KIMURA",
    username: "@akiracodes",
    location: "San Francisco, CA",
    title: "Staff ML Engineer at Scale AI",
    badge: "ELITE",
    badgeColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    tscore: 94,
    tier: "Tier A",
    tierColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    contributions: 3513,
    heatmap: generateHeatmap(42),
    followers: 2840,
    linkedinHeadline: "Staff ML Engineer | Ex-Google Brain | NeurIPS Published",
    stats: [
      { icon: IconStar, label: "Stars earned", value: "4,230" },
      { icon: IconGitCommit, label: "Commits (1yr)", value: "1,847" },
      { icon: IconGitFork, label: "Forks", value: "312" },
      { icon: IconFlame, label: "HF Models", value: "12" },
      { icon: IconUsers, label: "Followers", value: "2,840" },
      { icon: IconTrophy, label: "Top lang", value: "Python" },
    ],
    projects: [
      {
        name: "Neural Search",
        stars: 892,
        forks: 124,
        description:
          "Semantic search engine using transformer embeddings — handles 10M+ vectors with sub-50ms latency. Used in production by 3 YC companies.",
        languages: ["Python", "Rust", "TypeScript"],
        highlighted: true,
      },
    ],
    languages: ["Python", "TypeScript", "Rust", "Go", "C++", "Julia", "SQL"],
  },
  {
    name: "SARAH JOHNSON",
    username: "@sarahdev",
    location: "New York City, NY",
    title: "Principal Engineer at Datadog",
    badge: "ELITE",
    badgeColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    tscore: 91,
    tier: "Tier A",
    tierColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    contributions: 2847,
    heatmap: generateHeatmap(77),
    followers: 1920,
    linkedinHeadline:
      "Principal Engineer | Building observability at scale | Ex-AWS",
    stats: [
      { icon: IconStar, label: "Stars earned", value: "3,180" },
      { icon: IconGitCommit, label: "Commits (1yr)", value: "2,103" },
      { icon: IconGitFork, label: "Forks", value: "487" },
      { icon: IconFlame, label: "HF Models", value: "3" },
      { icon: IconUsers, label: "Followers", value: "1,920" },
      { icon: IconTrophy, label: "Top lang", value: "Go" },
    ],
    projects: [
      {
        name: "K8s Dashboard",
        stars: 1243,
        forks: 287,
        description:
          "Real-time Kubernetes cluster monitoring with auto-scaling recommendations, cost analysis, and Slack alerting.",
        languages: ["Go", "React", "TypeScript"],
        highlighted: true,
      },
    ],
    languages: [
      "Go",
      "TypeScript",
      "React",
      "Python",
      "Terraform",
      "SQL",
      "Rust",
    ],
  },
  {
    name: "MIKE ZHANG",
    username: "@mikezhang",
    location: "Seattle, WA",
    title: "Senior ML Engineer at NVIDIA",
    badge: "SHARP",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    tscore: 87,
    tier: "Tier A",
    tierColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    contributions: 4102,
    heatmap: generateHeatmap(123),
    followers: 3610,
    linkedinHeadline:
      "Senior ML Engineer @ NVIDIA | CUDA Optimization | PyTorch Core Contrib",
    stats: [
      { icon: IconStar, label: "Stars earned", value: "2,890" },
      { icon: IconGitCommit, label: "Commits (1yr)", value: "3,241" },
      { icon: IconGitFork, label: "Forks", value: "198" },
      { icon: IconFlame, label: "HF Models", value: "27" },
      { icon: IconUsers, label: "Followers", value: "3,610" },
      { icon: IconTrophy, label: "Top lang", value: "Python" },
    ],
    projects: [
      {
        name: "LLM Toolkit",
        stars: 567,
        forks: 143,
        description:
          "Fine-tuning framework for LLMs — supports LoRA, QLoRA, and full fine-tuning on consumer GPUs. 27 pretrained adapters on HuggingFace.",
        languages: ["Python", "CUDA", "C++"],
        highlighted: true,
      },
    ],
    languages: ["Python", "CUDA", "C++", "TypeScript", "Rust", "Bash", "Go"],
  },
];

const heatmapColors = [
  "bg-neutral-100 dark:bg-neutral-800",
  "bg-green-200 dark:bg-green-900/50",
  "bg-green-400 dark:bg-green-700/70",
  "bg-green-500 dark:bg-green-600",
  "bg-green-700 dark:bg-green-500",
];

// ── TScore gauge ──

function ScoreGauge({ score, tier }: { score: number; tier: string }) {
  const circumference = 2 * Math.PI * 40;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-neutral-200 dark:text-neutral-700"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
          />
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            {score}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
        {tier}
      </span>
    </div>
  );
}

// ── Contribution heatmap ──

function ContributionHeatmap({
  heatmap,
  contributions,
}: {
  heatmap: number[][];
  contributions: number;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
        {contributions.toLocaleString()} contributions this year
      </p>

      <div className="mb-1 flex pl-8">
        {months.map((m, i) => (
          <span key={i} className="flex-1 text-[9px] text-neutral-400">
            {m}
          </span>
        ))}
      </div>

      <div className="flex gap-px">
        <div className="flex w-7 shrink-0 flex-col justify-between py-px text-[9px] text-neutral-400">
          <span></span>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>

        <div className="flex flex-1 gap-[2px] overflow-hidden">
          {Array.from({ length: 52 }).map((_, col) => (
            <div key={col} className="flex flex-1 flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, row) => (
                <div
                  key={row}
                  className={cn(
                    "aspect-square w-full rounded-[2px]",
                    heatmapColors[heatmap[row]?.[col] ?? 0]
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Profile card ──

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="w-full shrink-0 px-4">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="px-8 pb-5 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-xl font-bold text-white dark:bg-neutral-200 dark:text-neutral-900">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-wide text-neutral-900 dark:text-white">
                    {profile.name}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      profile.badgeColor
                    )}
                  >
                    {profile.badge}
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {profile.username}
                </p>
                <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                  {profile.title}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <IconMapPin className="h-3 w-3" />
                  {profile.location}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              {/* TScore */}
              <ScoreGauge score={profile.tscore} tier={profile.tier} />

              {/* Links */}
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  <IconExternalLink className="h-3.5 w-3.5" />
                  Website
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  <IconBrandGithub className="h-3.5 w-3.5" />
                  Github
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  <IconBrandLinkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </span>
              </div>
            </div>
          </div>

          {/* LinkedIn headline */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50/60 px-3 py-2 dark:bg-blue-950/20">
            <IconBrandLinkedin className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {profile.linkedinHeadline}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-b border-t border-neutral-100 bg-neutral-50/50 px-8 py-3 dark:border-neutral-800 dark:bg-neutral-800/30">
          <div className="grid grid-cols-6 gap-4">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-1 h-4 w-4 text-neutral-400" />
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[9px] text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution heatmap */}
        <div className="px-8 py-5">
          <ContributionHeatmap
            heatmap={profile.heatmap}
            contributions={profile.contributions}
          />
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800" />

        {/* Projects */}
        <div className="px-8 py-5">
          <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
            Projects
          </p>
          <div className="space-y-3">
            {profile.projects.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-lg border p-4",
                  p.highlighted
                    ? "border-green-300 bg-green-50/30 dark:border-green-800/50 dark:bg-green-950/10"
                    : "border-neutral-200 dark:border-neutral-800"
                )}
              >
                <div className="mb-1.5 flex items-center gap-3">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {p.name}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    <IconStar className="h-3 w-3" />
                    {p.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    <IconGitFork className="h-3 w-3" />
                    {p.forks}
                  </span>
                  {p.highlighted && (
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                      * Similar to your search
                    </span>
                  )}
                </div>
                <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {p.description}
                </p>
                <div className="flex gap-2">
                  {p.languages.map((l) => (
                    <span
                      key={l}
                      className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800" />

        {/* Languages */}
        <div className="px-8 py-4">
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Coding Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((l) => (
              <span
                key={l}
                className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component with auto-scrolling carousel ──

export const ProfilePreview = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const advance = () => {
      setCurrent((prev) => (prev + 1) % profiles.length);
    };
    timeoutRef.current = setInterval(advance, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">One unified profile, zero guesswork</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Octopod&apos;s proprietary algorithm analyzes commits, repos,
        open-source impact, and professional activity across GitHub, LinkedIn,
        and Hugging Face — so you see exactly who&apos;s shipping real code
        before you ever reach out.
      </Subheading>

      {/* Carousel */}
      <div className="mx-auto mt-12 max-w-5xl overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${current * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {profiles.map((profile) => (
            <ProfileCard key={profile.username} profile={profile} />
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {profiles.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              if (timeoutRef.current) clearInterval(timeoutRef.current);
              timeoutRef.current = setInterval(() => {
                setCurrent((prev) => (prev + 1) % profiles.length);
              }, 5000);
            }}
            className={cn(
              "h-2 rounded-full transition-all",
              current === i
                ? "w-6 bg-green-600"
                : "w-2 bg-neutral-300 dark:bg-neutral-600"
            )}
          />
        ))}
      </div>
    </div>
  );
};
