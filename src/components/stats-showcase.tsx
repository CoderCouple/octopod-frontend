"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

// ── Animated counter ──
function AnimatedNumber({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const end = start + duration * 1000;
    const step = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));
      if (now < end) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  const formatted = count.toLocaleString();
  const finalFormatted = target.toLocaleString();

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      {/* Invisible placeholder to reserve final width */}
      <span className="invisible">{finalFormatted}</span>
      <span className="absolute inset-0 text-right">{formatted}</span>
    </span>
  );
}

// ── Network graph SVG ──
function NetworkGraph() {
  // Circle of dots with connecting lines and green accent nodes
  const nodeCount = 20;
  const cx = 60;
  const cy = 60;
  const r = 44;
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  // Inner nodes
  const inner = [
    { x: 45, y: 40 },
    { x: 75, y: 35 },
    { x: 55, y: 65 },
    { x: 70, y: 70 },
    { x: 60, y: 50 },
  ];
  // Green accent indices (outer ring)
  const greenOuter = [2, 7, 13, 18];
  // Green accent indices (inner)
  const greenInner = [1, 3];
  // Connections between inner nodes and some outer nodes
  const connections = [
    [inner[0], nodes[3]],
    [inner[0], nodes[5]],
    [inner[0], inner[4]],
    [inner[1], nodes[7]],
    [inner[1], nodes[9]],
    [inner[1], inner[4]],
    [inner[2], nodes[13]],
    [inner[2], nodes[15]],
    [inner[2], inner[4]],
    [inner[3], nodes[17]],
    [inner[3], nodes[19]],
    [inner[3], inner[4]],
    [inner[4], nodes[0]],
    [inner[4], nodes[10]],
    [inner[0], inner[1]],
    [inner[1], inner[3]],
    [inner[2], inner[3]],
    [inner[0], inner[2]],
  ];

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-32 md:w-32">
      {/* Connections */}
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="currentColor"
          strokeWidth="0.7"
          className="text-neutral-400 dark:text-neutral-600"
        />
      ))}
      {/* Outer ring dots */}
      {nodes.map((n, i) => (
        <circle
          key={`o-${i}`}
          cx={n.x}
          cy={n.y}
          r={greenOuter.includes(i) ? 3 : 2.5}
          fill={greenOuter.includes(i) ? "#16a34a" : "currentColor"}
          className={greenOuter.includes(i) ? "" : "text-neutral-800 dark:text-neutral-300"}
        />
      ))}
      {/* Inner dots */}
      {inner.map((n, i) => (
        <circle
          key={`i-${i}`}
          cx={n.x}
          cy={n.y}
          r={greenInner.includes(i) ? 3.5 : 3}
          fill={greenInner.includes(i) ? "#16a34a" : "currentColor"}
          className={greenInner.includes(i) ? "" : "text-neutral-800 dark:text-neutral-300"}
        />
      ))}
    </svg>
  );
}

const platforms = [
  {
    name: "GitHub",
    count: 58000909,
    label: "GitHub profiles tracked",
    pillBg: "bg-neutral-900 dark:bg-neutral-100",
    pillText: "text-white dark:text-neutral-900",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Hugging Face",
    count: 2847312,
    label: "Hugging Face profiles tracked",
    pillBg: "bg-yellow-400 dark:bg-yellow-400",
    pillText: "text-neutral-900 dark:text-neutral-900",
    icon: (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_svg/huggingface-brand.svg" alt="Hugging Face" className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
    ),
  },
  {
    name: "LinkedIn",
    count: 12540187,
    label: "LinkedIn profiles tracked",
    pillBg: "bg-[#0A66C2] dark:bg-[#0A66C2]",
    pillText: "text-white dark:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export const StatsShowcase = () => {
  return (
    <div className="relative z-20 py-10 md:py-20">
      <Heading as="h2">Profiles Tracked</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        We continuously crawl three of the world&apos;s largest developer
        platforms, scoring every meaningful signal so the right candidate is
        always one search away.
      </Subheading>

      <div className="mt-10" />

      {/* Platform pills */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3 md:gap-4">
        {platforms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-full px-6 py-2.5 shadow-lg sm:px-10 sm:py-3",
                p.pillBg
              )}
            >
              <span className={p.pillText}>{p.icon}</span>
              <span
                className={cn(
                  "text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl",
                  p.pillText
                )}
              >
                <AnimatedNumber target={p.count} duration={2 + i * 0.3} />
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
              {p.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Per-platform stats */}
      <div className="mx-auto mt-10 max-w-5xl space-y-4 md:mt-14 md:space-y-5">
        {/* GitHub stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-neutral-900 dark:text-white" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-sm font-bold tracking-wide uppercase text-neutral-900 dark:text-white">GitHub</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">90M+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Repositories tracked</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">2.1B+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Commits analyzed</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">150K+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">New activities <span className="font-extrabold text-neutral-900 dark:text-white">daily</span></p>
            </div>
          </div>
        </motion.div>

        {/* Hugging Face stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 shadow-sm dark:border-yellow-900/40 dark:bg-yellow-950/10 sm:p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo_svg/huggingface-brand.svg" alt="Hugging Face" className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide uppercase text-yellow-700 dark:text-yellow-400">Hugging Face</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">800K+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Models &amp; datasets tracked</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">45K+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Spaces analyzed</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">12K+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">New uploads <span className="font-extrabold text-neutral-900 dark:text-white">daily</span></p>
            </div>
          </div>
        </motion.div>

        {/* LinkedIn stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/10 sm:p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#0A66C2]" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-sm font-bold tracking-wide uppercase text-[#0A66C2]">LinkedIn</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">12.5M+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Engineer profiles indexed</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">5.8M+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Skills &amp; endorsements mapped</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">38K+</span>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Profile updates <span className="font-extrabold text-neutral-900 dark:text-white">daily</span></p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
