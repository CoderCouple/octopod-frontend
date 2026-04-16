"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  IconArrowRight,
  IconBrandGithub,
  IconCheck,
  IconDownload,
  IconGitFork,
  IconSearch,
  IconStar,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

type Signal = "Elite" | "Sharp" | "Capable" | "Rising";
type Tier = "A" | "B" | "C";

interface DetectionPill {
  label: string;
  keyword: string;
}

interface GitHubProfile {
  type: "github";
  name: string;
  username: string;
  avatarInitials: string;
  avatarColor: string;
  signal: Signal;
  tier: Tier;
  score: number;
  repo: {
    name: string;
    visibility: string;
    description: string;
    stars: number;
    forks: number;
  };
  activity: number[];
  languages: { name: string; percent: number; color: string }[];
}

interface HuggingFaceProfile {
  type: "huggingface";
  name: string;
  username: string;
  avatarInitials: string;
  avatarColor: string;
  signal: Signal;
  tier: Tier;
  score: number;
  model: {
    name: string;
    task: string;
    description: string;
    downloads: number;
    likes: number;
  };
  tags: string[];
}

type Profile = GitHubProfile | HuggingFaceProfile;

interface SearchScene {
  query: string;
  pills: DetectionPill[];
  profile: Profile;
}

const signalConfig: Record<
  Signal,
  { color: string; bg: string; darkBg: string }
> = {
  Elite: {
    color: "text-green-700",
    bg: "bg-green-100",
    darkBg: "dark:bg-green-900/40 dark:text-green-300",
  },
  Sharp: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    darkBg: "dark:bg-blue-900/40 dark:text-blue-300",
  },
  Capable: {
    color: "text-amber-700",
    bg: "bg-amber-100",
    darkBg: "dark:bg-amber-900/40 dark:text-amber-300",
  },
  Rising: {
    color: "text-purple-700",
    bg: "bg-purple-100",
    darkBg: "dark:bg-purple-900/40 dark:text-purple-300",
  },
};

const tierConfig: Record<Tier, { color: string; bg: string; darkBg: string }> =
  {
    A: {
      color: "text-green-700",
      bg: "bg-green-50",
      darkBg: "dark:bg-green-900/30 dark:text-green-300",
    },
    B: {
      color: "text-blue-700",
      bg: "bg-blue-50",
      darkBg: "dark:bg-blue-900/30 dark:text-blue-300",
    },
    C: {
      color: "text-amber-700",
      bg: "bg-amber-50",
      darkBg: "dark:bg-amber-900/30 dark:text-amber-300",
    },
  };

const scenes: SearchScene[] = [
  {
    query: "engineers who built real-time messaging systems",
    pills: [
      { label: "Role", keyword: "engineers" },
      { label: "Domain", keyword: "real-time" },
      { label: "Skills", keyword: "messaging systems" },
      { label: "Experience", keyword: "built" },
      { label: "Platform", keyword: "" },
    ],
    profile: {
      type: "github",
      name: "Bharath",
      username: "@bharathbuilds",
      avatarInitials: "B",
      avatarColor: "from-violet-500 to-purple-600",
      signal: "Elite",
      tier: "A",
      score: 94,
      repo: {
        name: "chatty.io",
        visibility: "Public",
        description:
          "Led an open-source chat app with streaming APIs that unifies multiple models for smooth, real-time conversations",
        stars: 1123,
        forks: 156,
      },
      activity: [
        2, 5, 3, 8, 6, 9, 4, 7, 10, 6, 8, 12, 5, 9, 7, 11, 4, 8, 6, 10, 13, 7,
        9, 5,
      ],
      languages: [
        { name: "TypeScript", percent: 52, color: "#3178c6" },
        { name: "Go", percent: 31, color: "#00ADD8" },
        { name: "Rust", percent: 17, color: "#dea584" },
      ],
    },
  },
  {
    query: "ML engineers with published HuggingFace models",
    pills: [
      { label: "Role", keyword: "ML engineers" },
      { label: "Platform", keyword: "HuggingFace" },
      { label: "Skills", keyword: "models" },
      { label: "Experience", keyword: "published" },
      { label: "Domain", keyword: "" },
    ],
    profile: {
      type: "huggingface",
      name: "Priya Sharma",
      username: "@priyaml",
      avatarInitials: "PS",
      avatarColor: "from-amber-500 to-orange-600",
      signal: "Sharp",
      tier: "A",
      score: 87,
      model: {
        name: "vision-transformer-lite",
        task: "image-classification",
        description:
          "Lightweight ViT optimized for edge devices — 3x faster inference with under 2% accuracy loss on ImageNet",
        downloads: 52400,
        likes: 312,
      },
      tags: ["PyTorch", "Transformers", "ONNX", "Edge AI"],
    },
  },
  {
    query: "full-stack developers who contribute to open source",
    pills: [
      { label: "Role", keyword: "full-stack developers" },
      { label: "Skills", keyword: "open source" },
      { label: "Experience", keyword: "contribute" },
      { label: "Domain", keyword: "" },
      { label: "Platform", keyword: "" },
    ],
    profile: {
      type: "github",
      name: "Maria Gonzalez",
      username: "@mariadev",
      avatarInitials: "MG",
      avatarColor: "from-orange-500 to-red-500",
      signal: "Sharp",
      tier: "B",
      score: 82,
      repo: {
        name: "react-flow-builder",
        visibility: "Public",
        description:
          "A drag-and-drop workflow builder for React with 200+ contributors and used by 5K+ projects",
        stars: 4210,
        forks: 589,
      },
      activity: [
        4, 7, 5, 3, 8, 6, 9, 11, 7, 5, 10, 8, 6, 12, 4, 7, 9, 5, 8, 6, 10, 3, 7,
        11,
      ],
      languages: [
        { name: "TypeScript", percent: 68, color: "#3178c6" },
        { name: "CSS", percent: 22, color: "#563d7c" },
        { name: "HTML", percent: 10, color: "#e34c26" },
      ],
    },
  },
  {
    query: "researchers building large language models for production",
    pills: [
      { label: "Role", keyword: "researchers" },
      { label: "Skills", keyword: "large language models" },
      { label: "Domain", keyword: "production" },
      { label: "Experience", keyword: "building" },
      { label: "Platform", keyword: "" },
    ],
    profile: {
      type: "huggingface",
      name: "Alex Chen",
      username: "@alexresearch",
      avatarInitials: "AC",
      avatarColor: "from-blue-500 to-cyan-600",
      signal: "Elite",
      tier: "A",
      score: 96,
      model: {
        name: "llm-distill-7b",
        task: "text-generation",
        description:
          "Distilled 7B parameter LLM that matches GPT-3.5 on MMLU while running on consumer GPUs",
        downloads: 184000,
        likes: 1847,
      },
      tags: ["LLM", "Distillation", "GGUF", "vLLM"],
    },
  },
];

function TypeWriter({
  text,
  onComplete,
  onProgress,
}: {
  text: string;
  onComplete: () => void;
  onProgress: (charIndex: number) => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
        onProgress(indexRef.current);
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 45);

    return () => clearInterval(interval);
  }, [text, onComplete, onProgress]);

  return (
    <>
      {displayed}
      <span className="inline-block h-5 w-[2px] animate-pulse bg-neutral-400" />
    </>
  );
}

function DetectionPills({
  pills,
  query,
  typedLength,
}: {
  pills: DetectionPill[];
  query: string;
  typedLength: number;
}) {
  const typedText = query.slice(0, typedLength).toLowerCase();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {pills.map((pill) => {
        const isDetected =
          pill.keyword !== "" && typedText.includes(pill.keyword.toLowerCase());

        return (
          <motion.span
            key={pill.label}
            animate={isDetected ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 ${
              isDetected
                ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "border-neutral-200 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-500"
            }`}
          >
            {isDetected ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <IconCheck className="h-3 w-3 opacity-30" />
            )}
            {pill.label}
          </motion.span>
        );
      })}
    </div>
  );
}

function ActivityChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  // Render as a GitHub-style contribution grid (5 rows)
  const rows = 5;
  const cols = Math.ceil(data.length / rows);
  const colors = [
    "bg-neutral-100 dark:bg-neutral-800",
    "bg-green-200 dark:bg-green-900/40",
    "bg-green-400 dark:bg-green-700/60",
    "bg-green-600 dark:bg-green-500",
  ];

  return (
    <div className="flex h-10 flex-col gap-[2px]">
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} className="flex flex-1 gap-[2px]">
          {Array.from({ length: cols }).map((_, ci) => {
            const idx = ci * rows + ri;
            const val = idx < data.length ? data[idx] : 0;
            const level = Math.min(3, Math.round((val / max) * 3));
            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: ri * 0.02 + ci * 0.015 }}
                className={`flex-1 rounded-[2px] ${colors[level]}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function LanguageBar({
  languages,
}: {
  languages: { name: string; percent: number; color: string }[];
}) {
  return (
    <div>
      <div className="mb-1.5 flex h-1.5 overflow-hidden rounded-full">
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            initial={{ width: 0 }}
            animate={{ width: `${lang.percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ backgroundColor: lang.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="flex items-center gap-1 text-[10px] text-neutral-500"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            {lang.name} {lang.percent}%
          </span>
        ))}
      </div>
    </div>
  );
}

function SignalBadge({ signal }: { signal: Signal }) {
  const config = signalConfig[signal];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.bg} ${config.color} ${config.darkBg}`}
    >
      Signal: {signal}
    </span>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const config = tierConfig[tier];
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.bg} ${config.color} ${config.darkBg}`}
    >
      Tier {tier}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
      TScore: {score}
    </span>
  );
}

function HuggingFaceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 95 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.2 0C26.3 0 9.4 16.9 9.4 37.8c0 4.5.8 8.8 2.2 12.8-7.5 3.2-12.6 10.5-12.6 19 0 11.5 9.3 20.8 20.8 20.8 4 0 7.8-1.1 11-3.1 5 .7 10.1 1.1 15.4 1.1s10.4-.4 15.4-1.1c3.2 2 7 3.1 11 3.1 11.5 0 20.8-9.3 20.8-20.8 0-8.5-5.1-15.8-12.6-19 1.4-4 2.2-8.3 2.2-12.8C83 16.9 66.1 0 47.2 0z"
        fill="currentColor"
      />
      <path
        d="M33.2 53.8c-1.2-3-4.2-5.1-7.6-5.1-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3c3.4 0 6.4-2.1 7.6-5.1"
        stroke="#000"
        strokeWidth="2"
        fill="#FFD21E"
      />
      <path
        d="M61.2 53.8c1.2-3 4.2-5.1 7.6-5.1 4.6 0 8.3 3.7 8.3 8.3s-3.7 8.3-8.3 8.3c-3.4 0-6.4-2.1-7.6-5.1"
        stroke="#000"
        strokeWidth="2"
        fill="#FFD21E"
      />
      <ellipse cx="36.2" cy="37.8" rx="5" ry="6.5" fill="#000" />
      <ellipse cx="58.2" cy="37.8" rx="5" ry="6.5" fill="#000" />
      <path
        d="M36.2 58.8c0 3 4.9 7 11 7s11-4 11-7"
        stroke="#000"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function GitHubCard({ profile }: { profile: GitHubProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${profile.avatarColor} text-sm font-bold text-white`}
          >
            {profile.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
              {profile.name}
            </p>
            <p className="text-xs text-neutral-500 sm:text-sm">
              {profile.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
          <IconBrandGithub className="h-5 w-5" />
          <span className="hidden text-xs font-medium sm:inline sm:text-sm">
            GitHub
          </span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-neutral-100 px-5 py-2.5 dark:border-neutral-800 sm:px-6">
        <SignalBadge signal={profile.signal} />
        <TierBadge tier={profile.tier} />
        <ScoreBadge score={profile.score} />
      </div>

      {/* Repo */}
      <div className="border-t border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {profile.repo.name}
          </span>
          <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
            {profile.repo.visibility}
          </span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
          {profile.repo.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-500 sm:text-sm">
          <span className="flex items-center gap-1">
            <IconStar className="h-3.5 w-3.5" />
            {profile.repo.stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <IconGitFork className="h-3.5 w-3.5" />
            {profile.repo.forks.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Activity + Languages */}
      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            Contribution Activity
          </p>
          <ActivityChart data={profile.activity} />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            Languages
          </p>
          <LanguageBar languages={profile.languages} />
        </div>
      </div>
    </motion.div>
  );
}

function HuggingFaceCard({ profile }: { profile: HuggingFaceProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${profile.avatarColor} text-sm font-bold text-white`}
          >
            {profile.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
              {profile.name}
            </p>
            <p className="text-xs text-neutral-500 sm:text-sm">
              {profile.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
          <HuggingFaceIcon className="h-5 w-5" />
          <span className="hidden text-xs font-medium sm:inline sm:text-sm">
            Hugging Face
          </span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-neutral-100 px-5 py-2.5 dark:border-neutral-800 sm:px-6">
        <SignalBadge signal={profile.signal} />
        <TierBadge tier={profile.tier} />
        <ScoreBadge score={profile.score} />
      </div>

      {/* Model */}
      <div className="border-t border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            {profile.model.name}
          </span>
          <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
            {profile.model.task}
          </span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
          {profile.model.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-500 sm:text-sm">
          <span className="flex items-center gap-1">
            <IconDownload className="h-3.5 w-3.5" />
            {profile.model.downloads.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <IconStar className="h-3.5 w-3.5" />
            {profile.model.likes.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="border-t border-neutral-100 px-5 py-3 dark:border-neutral-800 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  if (profile.type === "github") {
    return <GitHubCard profile={profile} />;
  }
  return <HuggingFaceCard profile={profile} />;
}

export const SearchDemo = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [phase, setPhase] = useState<"typing" | "showing" | "fading">("typing");

  const scene = scenes[sceneIndex];

  const handleTypingComplete = useCallback(() => {
    setShowProfile(true);
    setPhase("showing");
  }, []);

  const handleProgress = useCallback((charIndex: number) => {
    setTypedLength(charIndex);
  }, []);

  useEffect(() => {
    if (phase !== "showing") return;

    const timer = setTimeout(() => {
      setPhase("fading");
      setShowProfile(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;

    const timer = setTimeout(() => {
      setSceneIndex((prev) => (prev + 1) % scenes.length);
      setTypedLength(0);
      setPhase("typing");
    }, 500);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Container for search bar + profile card stacked */}
      <div className="relative flex w-full max-w-3xl flex-col items-center">
        {/* Detection pills */}
        <div className="relative z-10 mb-3 rounded-full bg-white/60 px-2 py-1 shadow-md shadow-neutral-200/50 backdrop-blur-sm dark:bg-neutral-900/60 dark:shadow-neutral-900/30">
          <DetectionPills
            key={sceneIndex}
            pills={scene.pills}
            query={scene.query}
            typedLength={typedLength}
          />
        </div>

        {/* Search bar — stays fixed */}
        <div className="relative z-10 flex w-full items-center gap-3 rounded-full border border-neutral-200 bg-neutral-100/80 px-5 py-3.5 shadow-lg shadow-neutral-200/60 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/80 dark:shadow-neutral-900/40 sm:px-7 sm:py-4">
          <IconSearch className="h-6 w-6 shrink-0 text-neutral-400 sm:h-7 sm:w-7" />
          <div className="min-w-0 flex-1 text-sm text-neutral-700 dark:text-neutral-300 sm:text-base md:text-lg">
            <TypeWriter
              key={sceneIndex}
              text={scene.query}
              onComplete={handleTypingComplete}
              onProgress={handleProgress}
            />
          </div>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:h-11 sm:w-11">
            <IconArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Profile card area — below search bar, slides top to bottom */}
        <div className="relative mt-4 h-[280px] w-full sm:h-[320px]">
          <AnimatePresence mode="wait">
            {showProfile && (
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <ProfileCard key={sceneIndex} profile={scene.profile} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
