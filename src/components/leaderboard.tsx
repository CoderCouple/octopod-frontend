"use client";

import { useRef, useState } from "react";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconRobot,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Send,
  User,
  X,
  Zap,
} from "lucide-react";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

type Source = "github" | "linkedin" | "huggingface";
type Tier = "A" | "B" | "C";
type Signal = "Elite" | "Sharp" | "Capable" | "Rising";

interface Candidate {
  name: string;
  location: string;
  email: string;
  tscore: number;
  tier: Tier;
  signal: Signal;
  skills: string[];
  sources: Source[];
  category: string;
  yoe: number;
  title: string;
}

const candidates: Candidate[] = [
  {
    name: "Akira Kimura",
    location: "San Francisco",
    email: "akira.k@gmail.com",
    tscore: 94,
    tier: "A",
    signal: "Elite",
    skills: ["TypeScript", "Python", "Rust"],
    sources: ["github", "linkedin", "huggingface"],
    category: "AI/ML",
    yoe: 8,
    title: "Staff ML Engineer",
  },
  {
    name: "Sarah Johnson",
    location: "New York",
    email: "sarah.j@outlook.com",
    tscore: 91,
    tier: "A",
    signal: "Elite",
    skills: ["Go", "Kubernetes", "React"],
    sources: ["github", "linkedin"],
    category: "Full-Stack",
    yoe: 10,
    title: "Principal Engineer",
  },
  {
    name: "Mike Zhang",
    location: "Seattle",
    email: "mike.zhang@proton.me",
    tscore: 87,
    tier: "A",
    signal: "Sharp",
    skills: ["Python", "TensorFlow", "CUDA"],
    sources: ["github", "huggingface"],
    category: "AI/ML",
    yoe: 7,
    title: "Senior ML Engineer",
  },
  {
    name: "Lisa Park",
    location: "Austin",
    email: "lisa.park@gmail.com",
    tscore: 84,
    tier: "B",
    signal: "Sharp",
    skills: ["TypeScript", "React", "Next.js"],
    sources: ["github", "linkedin"],
    category: "Full-Stack",
    yoe: 6,
    title: "Senior Frontend Engineer",
  },
  {
    name: "Raj Desai",
    location: "London",
    email: "raj.desai@gmail.com",
    tscore: 81,
    tier: "B",
    signal: "Capable",
    skills: ["Java", "Spring", "Kubernetes"],
    sources: ["github", "linkedin", "huggingface"],
    category: "Backend",
    yoe: 9,
    title: "Staff Backend Engineer",
  },
  {
    name: "Amy Wu",
    location: "Toronto",
    email: "amy.wu@outlook.com",
    tscore: 78,
    tier: "B",
    signal: "Capable",
    skills: ["Python", "Django", "AWS"],
    sources: ["github", "linkedin"],
    category: "Backend",
    yoe: 5,
    title: "Backend Engineer",
  },
  {
    name: "Carlos Rivera",
    location: "Berlin",
    email: "carlos.r@proton.me",
    tscore: 75,
    tier: "C",
    signal: "Rising",
    skills: ["Rust", "Go", "Docker"],
    sources: ["github"],
    category: "Backend",
    yoe: 3,
    title: "Systems Engineer",
  },
  {
    name: "Nina Petrov",
    location: "Singapore",
    email: "nina.petrov@gmail.com",
    tscore: 72,
    tier: "C",
    signal: "Rising",
    skills: ["Python", "PyTorch", "HuggingFace"],
    sources: ["github", "huggingface"],
    category: "AI/ML",
    yoe: 2,
    title: "ML Engineer",
  },
  {
    name: "James Okonkwo",
    location: "Lagos",
    email: "james.okonkwo@gmail.com",
    tscore: 69,
    tier: "C",
    signal: "Rising",
    skills: ["TypeScript", "Next.js", "PostgreSQL"],
    sources: ["github", "linkedin"],
    category: "Full-Stack",
    yoe: 4,
    title: "Full-Stack Engineer",
  },
  {
    name: "Elena Vasquez",
    location: "Barcelona",
    email: "elena.v@proton.me",
    tscore: 66,
    tier: "C",
    signal: "Rising",
    skills: ["Python", "LangChain", "RAG"],
    sources: ["github", "linkedin", "huggingface"],
    category: "AI/ML",
    yoe: 3,
    title: "AI Engineer",
  },
];

const filters = ["All", "AI/ML", "Backend", "Full-Stack"] as const;

const sourceIcon: Record<Source, React.ReactNode> = {
  github: <IconBrandGithub className="h-4 w-4" />,
  linkedin: <IconBrandLinkedin className="h-4 w-4" />,
  huggingface: <IconRobot className="h-4 w-4" />,
};

const tierColors: Record<Tier, string> = {
  A: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  B: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  C: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

const signalColors: Record<Signal, string> = {
  Elite: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Sharp: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Capable:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Rising:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
};

// ── Floating recruiter cursor ──
function FloatingRecruiterCursor({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ x: 200, y: 60 });

  useState(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(rect.width - 180, 200);
      const maxY = Math.max(rect.height - 60, 80);
      setPos({
        x: 60 + Math.random() * (maxX - 60),
        y: 30 + Math.random() * (maxY - 30),
      });
    }, 3500);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-md"
      >
        <path
          d="M5 3L19 12L12 13L9 20L5 3Z"
          fill="#16a34a"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="ml-4 mt-1 flex items-center gap-2 rounded-full border border-green-200 bg-white px-2.5 py-1 shadow-lg dark:border-green-800 dark:bg-neutral-900">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-[8px] font-bold text-white">
          R
        </div>
        <div className="pr-1">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
            Recruiter
          </p>
          <p className="whitespace-nowrap text-[8px] leading-tight text-neutral-500">
            Browsing talent
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Profile overlay with outreach actions ──
function CandidateOverlay({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [connectState, setConnectState] = useState<
    "idle" | "connecting" | "connected"
  >("idle");

  const handleStartSequence = () => {
    if (emailState !== "idle") return;
    setEmailState("sending");
    setTimeout(() => setEmailState("sent"), 1500);
  };

  const handleConnect = () => {
    if (connectState !== "idle") return;
    setConnectState("connecting");
    setTimeout(() => setConnectState("connected"), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      <motion.div
        initial={{ scale: 0.9, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-[26rem] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          {/* Header */}
          <div className="relative bg-neutral-900 px-5 py-4 dark:bg-neutral-800">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-md p-0.5 text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-bold text-neutral-900 ring-2 ring-neutral-600">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {candidate.name}
                </p>
                <p className="text-sm text-neutral-400">{candidate.title}</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Score row */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    TScore
                  </span>
                  <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {candidate.tscore}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.tscore}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full rounded-full bg-green-500"
                  />
                </div>
              </div>
              <span
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-bold",
                  tierColors[candidate.tier]
                )}
              >
                Tier {candidate.tier}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  signalColors[candidate.signal]
                )}
              >
                {candidate.signal}
              </span>
            </div>

            {/* Info */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{candidate.yoe}y exp</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                {candidate.sources.map((s) => (
                  <span key={s}>{sourceIcon[s]}</span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-neutral-500">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-5 border-t border-neutral-200 dark:border-neutral-700" />

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Start Email Sequence */}
              <button
                onClick={handleStartSequence}
                disabled={emailState === "sent"}
                className={cn(
                  "group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  emailState === "idle" &&
                    "bg-green-600 text-white hover:bg-green-700",
                  emailState === "sending" &&
                    "cursor-wait bg-green-600 text-white",
                  emailState === "sent" &&
                    "cursor-default bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                )}
              >
                {emailState === "idle" && (
                  <>
                    <Send className="h-4 w-4" />
                    Start Email Sequence
                  </>
                )}
                {emailState === "sending" && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending...
                  </>
                )}
                {emailState === "sent" && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    3-step sequence started
                  </motion.span>
                )}
              </button>

              {/* Connect */}
              <button
                onClick={handleConnect}
                disabled={connectState === "connected"}
                className={cn(
                  "group flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  connectState === "idle" &&
                    "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                  connectState === "connecting" &&
                    "cursor-wait border border-neutral-200 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800",
                  connectState === "connected" &&
                    "cursor-default border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                )}
              >
                {connectState === "idle" && (
                  <>
                    <Zap className="h-4 w-4" />
                    Connect Instantly
                  </>
                )}
                {connectState === "connecting" && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300"
                    />
                    Connecting...
                  </>
                )}
                {connectState === "connected" && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Connected
                  </motion.span>
                )}
              </button>
            </div>

            {/* Success message */}
            <AnimatePresence>
              {emailState === "sent" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="rounded-lg bg-green-50 px-4 py-3 dark:bg-green-950/20">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400">
                      Email sequence started for {candidate.name}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-[10px] text-green-600 dark:text-green-500">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Day 1: Intro
                      </span>
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Day 3: Follow-up
                      </span>
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Day 7: Final
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const Leaderboard = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const tableRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "All"
      ? candidates
      : candidates.filter((c) => c.category === activeFilter);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Talent leaderboard</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Top engineers ranked by real contributions across GitHub, Hugging Face,
        and LinkedIn.
      </Subheading>

      {/* Filter pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f
                ? "bg-green-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="relative mt-10 hidden md:block" ref={tableRef}>
        <FloatingRecruiterCursor containerRef={tableRef} />

        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="grid grid-cols-[3rem_1fr_6rem_4rem_5rem_1fr_6rem] gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
            <span>#</span>
            <span>Engineer</span>
            <span>TScore</span>
            <span>Tier</span>
            <span>Signal</span>
            <span>Skills</span>
            <span>Sources</span>
          </div>

          {/* Rows */}
          {filtered.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setSelectedCandidate(c)}
              className={cn(
                "grid cursor-pointer grid-cols-[3rem_1fr_6rem_4rem_5rem_1fr_6rem] items-center gap-4 border-b border-neutral-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-green-50/50 dark:border-neutral-800/50 dark:hover:bg-green-950/10",
                i < 3 && "bg-green-50/30 dark:bg-green-950/5"
              )}
            >
              {/* Rank */}
              <span className="text-sm font-medium text-neutral-400">
                {i + 1}
              </span>

              {/* Avatar + Name + Location */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white dark:bg-neutral-200 dark:text-neutral-900">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {c.name}
                  </p>
                  <p className="text-xs text-neutral-500">{c.location}</p>
                </div>
              </div>

              {/* TScore + bar */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {c.tscore}
                </span>
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${c.tscore}%` }}
                  />
                </div>
              </div>

              {/* Tier */}
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded px-2 py-0.5 text-xs font-semibold",
                  tierColors[c.tier]
                )}
              >
                {c.tier}
              </span>

              {/* Signal */}
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  signalColors[c.signal]
                )}
              >
                {c.signal}
              </span>

              {/* Skills */}
              <div className="flex flex-wrap gap-1">
                {c.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Sources */}
              <div className="flex gap-1.5 text-neutral-400">
                {c.sources.map((s) => (
                  <span key={s}>{sourceIcon[s]}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-10 space-y-3 md:hidden">
        {filtered.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => setSelectedCandidate(c)}
            className={cn(
              "cursor-pointer rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-green-50/50 dark:border-neutral-800 dark:hover:bg-green-950/10",
              i < 3 && "bg-green-50/30 dark:bg-green-950/5"
            )}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-400">
                  #{i + 1}
                </span>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white dark:bg-neutral-200 dark:text-neutral-900">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {c.name}
                  </p>
                  <p className="text-xs text-neutral-500">{c.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {c.tscore}
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${c.tscore}%` }}
              />
            </div>

            {/* Bottom row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-semibold",
                  tierColors[c.tier]
                )}
              >
                {c.tier}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  signalColors[c.signal]
                )}
              >
                {c.signal}
              </span>
              {c.skills.map((s) => (
                <span
                  key={s}
                  className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  {s}
                </span>
              ))}
              <div className="ml-auto flex gap-1.5 text-neutral-400">
                {c.sources.map((s) => (
                  <span key={s}>{sourceIcon[s]}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Candidate profile overlay */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateOverlay
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
