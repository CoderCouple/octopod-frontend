"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
  IconCode,
  IconGitCommit,
  IconMapPin,
  IconStar,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useInView } from "framer-motion";


function HuggingFaceIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo_svg/huggingface-brand.svg"
      alt="HF"
      className={className}
    />
  );
}

/* ── Source Cards ── */

function GitHubSourceCard({
  active,
  delay,
}: {
  active: boolean;
  delay: number;
}) {
  const bars = [4, 7, 3, 9, 6, 11, 5, 8, 10, 7, 12, 6, 9, 4, 8];
  const max = Math.max(...bars);

  return (
    <motion.div
      initial={{ opacity: 0.3, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
      transition={{ duration: 0.5, delay: active ? delay : 0 }}
      className={`w-full overflow-hidden rounded-2xl border transition-all ${
        active
          ? "border-neutral-300 bg-white shadow-md dark:border-neutral-600 dark:bg-neutral-900"
          : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
          <IconBrandGithub className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            GitHub
          </p>
          <p className="text-[10px] text-neutral-500">@akirakimura</p>
        </div>
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5L4.5 7.5L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-neutral-500">
            <IconGitCommit className="h-3 w-3" />
            1,847 commits
          </span>
          <span className="flex items-center gap-1 text-[10px] text-neutral-500">
            <IconStar className="h-3 w-3" />
            2.3K stars
          </span>
        </div>
        <div className="flex h-6 items-end gap-[2px]">
          {bars.map((val, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={
                active
                  ? { height: `${(val / max) * 100}%` }
                  : { height: 0 }
              }
              transition={{ duration: 0.4, delay: delay + i * 0.03 }}
              className="flex-1 rounded-sm bg-green-500"
              style={{ opacity: 0.4 + (val / max) * 0.6 }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 border-t border-neutral-100 px-4 py-2 dark:border-neutral-800">
        {["TypeScript", "Python", "Rust"].map((lang) => (
          <span
            key={lang}
            className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          >
            {lang}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function LinkedInSourceCard({
  active,
  delay,
}: {
  active: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.3, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
      transition={{ duration: 0.5, delay: active ? delay : 0 }}
      className={`w-full overflow-hidden rounded-2xl border transition-all ${
        active
          ? "border-blue-200 bg-white shadow-md dark:border-blue-900/50 dark:bg-neutral-900"
          : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <IconBrandLinkedin className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            LinkedIn
          </p>
          <p className="text-[10px] text-neutral-500">Akira Kimura</p>
        </div>
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5L4.5 7.5L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="space-y-2 border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <IconBriefcase className="h-3 w-3 shrink-0 text-neutral-400" />
          <span className="text-[10px] text-neutral-700 dark:text-neutral-300">
            Staff Engineer · 8 yrs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconMapPin className="h-3 w-3 shrink-0 text-neutral-400" />
          <span className="text-[10px] text-neutral-700 dark:text-neutral-300">
            San Francisco, CA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconCode className="h-3 w-3 shrink-0 text-neutral-400" />
          <span className="text-[10px] text-neutral-700 dark:text-neutral-300">
            Ex-Stripe, Ex-Datadog
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function HuggingFaceSourceCard({
  active,
  delay,
}: {
  active: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.3, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
      transition={{ duration: 0.5, delay: active ? delay : 0 }}
      className={`w-full overflow-hidden rounded-2xl border transition-all ${
        active
          ? "border-yellow-200 bg-white shadow-md dark:border-yellow-900/50 dark:bg-neutral-900"
          : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-neutral-900">
          <HuggingFaceIcon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            Hugging Face
          </p>
          <p className="text-[10px] text-neutral-500">@akirakimura</p>
        </div>
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5L4.5 7.5L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              12
            </p>
            <p className="text-[9px] text-neutral-500">Models</p>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              50K
            </p>
            <p className="text-[9px] text-neutral-500">Downloads</p>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              3
            </p>
            <p className="text-[9px] text-neutral-500">Datasets</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 border-t border-neutral-100 px-4 py-2 dark:border-neutral-800">
        {["PyTorch", "ViT", "ONNX"].map((tag) => (
          <span
            key={tag}
            className="rounded bg-yellow-50 px-1.5 py-0.5 text-[9px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Octopus Engine ── */

function OctopusEngine({ active }: { active: boolean }) {
  return (
    <motion.div
      animate={
        active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
      }
      transition={{ duration: 0.5, type: "spring" }}
      className="relative flex h-48 w-48 shrink-0 items-center justify-center self-center xl:h-64 xl:w-64"
    >
      {/* Outer spinning dashed ring */}
      <motion.div
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-green-300 dark:border-green-700"
      />

      {/* Inner spinning ring */}
      <motion.div
        animate={active ? { rotate: -360 } : {}}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-green-200 dark:border-green-800"
      />

      {/* Pulsing green glow background */}
      <motion.div
        animate={
          active
            ? { scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ duration: 2, repeat: active ? Infinity : 0 }}
        className="absolute inset-3 rounded-full bg-green-500/15 dark:bg-green-500/10"
      />

      {/* Solid circle background */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-inner dark:from-green-950/50 dark:to-green-900/30" />

      {/* Octopus logo from SVG files */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo_svg/octopus_waiting_light_color.svg"
        alt="Octopod"
        className="relative z-10 h-28 w-28 dark:hidden xl:h-36 xl:w-36"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo_svg/octopus_waiting_dark_color.svg"
        alt="Octopod"
        className="relative z-10 hidden h-28 w-28 dark:block xl:h-36 xl:w-36"
      />

      {/* Orbiting dots */}
      {active &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1,
            }}
            className="absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
          </motion.div>
        ))}

      {/* Label — styled like logo */}
      <motion.div
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute -top-8 whitespace-nowrap text-lg font-extrabold xl:-top-10 xl:text-2xl"
      >
        <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Octo
        </span>
        <span className="text-neutral-700 dark:text-neutral-300">pod</span>
        <span className="ml-0.5 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          AI
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ── Signal Lines ── */

function SignalLine({ active, delay }: { active: boolean; delay: number }) {
  return (
    <div
      className="signal-line"
      style={{
        opacity: active ? 1 : 0.1,
        transition: `opacity 0.5s ease ${delay}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/**
 * MergeConnector — SVG that draws 3 paths from the left (top, middle, bottom)
 * converging into a single point on the right. Each path has a sweep animation.
 *
 * Layout: stretches to fill parent height. The 3 source points are at
 * 1/6, 3/6, 5/6 of the height (centering on 3 equal rows).
 * They merge to the right-center (midpoint).
 */
function MergeConnector({ active }: { active: boolean }) {
  // Path definitions using percentages — SVG viewBox is 100x100 and we use
  // preserveAspectRatio="none" to stretch it to the container dimensions.
  // Source Y positions: ~16.67%, 50%, 83.33% (center of 3 equal rows)
  // Merge point: right-center at (100, 50)
  const paths = [
    // Top card → merge point (curve down)
    "M 0 16.67 C 50 16.67, 50 50, 100 50",
    // Middle card → merge point (straight)
    "M 0 50 L 100 50",
    // Bottom card → merge point (curve up)
    "M 0 83.33 C 50 83.33, 50 50, 100 50",
  ];

  const delays = [0, 0.15, 0.3];

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {paths.map((d, i) => (
        <React.Fragment key={i}>
          {/* Base path (faint track line) */}
          <path
            d={d}
            stroke="currentColor"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            className="text-green-300/30 dark:text-green-700/30"
            style={{
              opacity: active ? 1 : 0.1,
              transition: `opacity 0.5s ease ${delays[i]}s`,
            }}
          />
          {/* Animated sweep path */}
          <path
            d={d}
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            className="text-green-400"
            pathLength="1"
            style={{
              strokeDasharray: "0.15 0.85",
              strokeDashoffset: 1,
              opacity: active ? 1 : 0,
              transition: `opacity 0.4s ease ${delays[i]}s`,
              animation: active
                ? `stroke-sweep 2s ease-in-out ${delays[i]}s infinite`
                : "none",
            }}
          />
        </React.Fragment>
      ))}
    </svg>
  );
}

/** Single line from merge point to octopus */
function OutputConnector({ active }: { active: boolean }) {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Base track */}
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        className="text-green-300/30 dark:text-green-700/30"
        style={{
          opacity: active ? 1 : 0.1,
          transition: "opacity 0.5s ease",
        }}
      />
      {/* Sweep */}
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        className="text-green-400"
        pathLength="1"
        style={{
          strokeDasharray: "0.2 0.8",
          strokeDashoffset: 1,
          opacity: active ? 1 : 0,
          transition: "opacity 0.5s ease",
          animation: active
            ? "stroke-sweep 2s ease-in-out 0.3s infinite"
            : "none",
        }}
      />
    </svg>
  );
}

/* ── Building Output Card (items appear one at a time) ── */

function BuildingOutputCard({ buildStep }: { buildStep: number }) {
  const skills = ["TypeScript", "Python", "Rust", "PyTorch", "K8s"];
  // GitHub-style contribution grid (7 rows x 12 cols = 84 cells)
  const activityGrid = [
    [0, 1, 0, 2, 1, 3, 2, 1, 0, 3, 2, 1],
    [1, 2, 1, 0, 3, 2, 1, 3, 2, 1, 0, 2],
    [0, 3, 2, 1, 2, 1, 3, 2, 0, 2, 3, 1],
    [2, 1, 3, 2, 0, 3, 2, 1, 3, 0, 1, 3],
    [1, 0, 2, 3, 1, 2, 0, 3, 1, 2, 3, 2],
    [3, 2, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0],
    [0, 1, 3, 2, 1, 0, 2, 1, 3, 1, 2, 3],
  ];

  return (
    <div className="flex h-full w-56 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900 xl:w-64">
      {/* Step 1: Avatar + Name */}
      {buildStep >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-bold text-white shadow-md shadow-green-500/20">
            AK
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              Akira Kimura
            </p>
            <p className="text-xs text-neutral-500">San Francisco, CA</p>
          </div>
        </motion.div>
      )}

      {/* Step 2: Source Badges */}
      {buildStep >= 2 && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 border-t border-neutral-100 px-5 py-2 dark:border-neutral-800"
        >
          <span className="text-[9px] text-neutral-400">Sources:</span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0 }}
            className="flex items-center gap-0.5 rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          >
            <IconBrandGithub className="h-2.5 w-2.5" /> GH
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <IconBrandLinkedin className="h-2.5 w-2.5" /> LI
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-0.5 rounded bg-yellow-50 px-1.5 py-0.5 text-[9px] font-medium text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            <HuggingFaceIcon className="h-2.5 w-2.5" /> HF
          </motion.span>
        </motion.div>
      )}

      {/* Step 3: TScore */}
      {buildStep >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-neutral-100 px-5 py-3 dark:border-neutral-800"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              TScore
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-lg font-bold text-green-600"
            >
              94
            </motion.span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-green-600 via-green-500 to-green-400"
            />
          </div>
        </motion.div>
      )}

      {/* Step 4: Signal / Tier badges */}
      {buildStep >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-1.5 border-t border-neutral-100 px-5 py-2.5 dark:border-neutral-800"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.05 }}
            className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700 dark:bg-green-900/40 dark:text-green-300"
          >
            Signal: Elite
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            Tier A
          </motion.span>
        </motion.div>
      )}

      {/* Spacer when activity isn't shown yet */}
      {buildStep < 5 && <div className="flex-1" />}

      {/* Step 5: Activity grid (GitHub-style) — grows to fill remaining space */}
      {buildStep >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 flex-col border-t border-neutral-100 px-5 py-3 dark:border-neutral-800"
        >
          <p className="mb-2 text-[9px] font-medium uppercase tracking-wider text-neutral-400">
            Activity
          </p>
          <div className="flex flex-1 flex-col gap-[3px]">
            {activityGrid.map((row, ri) => (
              <div key={ri} className="flex flex-1 gap-[3px]">
                {row.map((level, ci) => {
                  const colors = [
                    "bg-neutral-100 dark:bg-neutral-800",
                    "bg-green-200 dark:bg-green-900/40",
                    "bg-green-400 dark:bg-green-700/60",
                    "bg-green-600 dark:bg-green-500",
                  ];
                  return (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.15,
                        delay: ri * 0.03 + ci * 0.02,
                      }}
                      className={`flex-1 rounded-[2px] ${colors[level]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 6: Skills */}
      {buildStep >= 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-neutral-100 px-5 py-2.5 dark:border-neutral-800"
        >
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="rounded bg-green-50 px-1.5 py-0.5 text-[9px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Mobile Flow ── */

function MobileFlow({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-4 lg:hidden">
      <div className="flex w-full max-w-xs flex-col gap-3">
        <GitHubSourceCard active={step >= 1} delay={0} />
        <LinkedInSourceCard active={step >= 1} delay={0.15} />
        <HuggingFaceSourceCard active={step >= 1} delay={0.3} />
      </div>

      {/* Vertical pulse + octopus */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Pulse line down */}
            <div className="relative h-8 w-px bg-gradient-to-b from-transparent via-green-400 to-green-500">
              <motion.div
                className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-400 shadow-md shadow-green-400/50"
                animate={{ top: ["-4px", "calc(100% + 4px)"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              />
            </div>
            <OctopusEngine active />
            {/* Pulse line down */}
            <div className="relative h-8 w-px bg-gradient-to-b from-green-500 via-green-400 to-transparent">
              <motion.div
                className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-green-400 shadow-md shadow-green-400/50"
                animate={{ top: ["-4px", "calc(100% + 4px)"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output card */}
      <AnimatePresence>
        {step >= 3 && <BuildingOutputCard buildStep={step - 2} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Pipeline ── */

function PipelineFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setStep(1), 400), // source cards light up
      setTimeout(() => setStep(2), 1200), // pulses + octopus
      setTimeout(() => setStep(3), 2200), // output card + name
      setTimeout(() => setStep(4), 2800), // source badges
      setTimeout(() => setStep(5), 3300), // TScore
      setTimeout(() => setStep(6), 3800), // Signal/Tier
      setTimeout(() => setStep(7), 4300), // Activity chart
      setTimeout(() => setStep(8), 4800), // Skills
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="relative mt-16 lg:mt-20">
      {/* Mobile */}
      <MobileFlow step={step} />

      {/* Desktop */}
      <div className="hidden items-stretch justify-center lg:flex">
        {/* Source cards */}
        <div className="flex w-52 flex-col gap-3 xl:w-64">
          <GitHubSourceCard active={step >= 1} delay={0} />
          <LinkedInSourceCard active={step >= 1} delay={0.15} />
          <HuggingFaceSourceCard active={step >= 1} delay={0.3} />
        </div>

        {/* Merge connector: 3 lines converge into 1 */}
        <div className="w-20 xl:w-28">
          <MergeConnector active={step >= 2} />
        </div>

        {/* Octopus engine */}
        <div className="flex shrink-0 items-center justify-center">
          <OctopusEngine active={step >= 2} />
        </div>

        {/* Output connector: single line to output card */}
        <div className="w-20 xl:w-28">
          <OutputConnector active={step >= 3} />
        </div>

        {/* Building output card */}
        <motion.div
          animate={
            step >= 3
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: 30, scale: 0.95 }
          }
          transition={{ duration: 0.5, type: "spring" }}
          className="flex"
        >
          <BuildingOutputCard buildStep={step - 2} />
        </motion.div>
      </div>
    </div>
  );
}

export const Companies = () => {
  return (
    <div className="relative z-20 py-10 md:py-40">
      <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
        How Octopod builds a profile
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-base text-neutral-600 dark:text-neutral-300 md:text-lg">
        Data from GitHub, LinkedIn, and Hugging Face flows through our AI engine
        to create scored, unified candidate profiles.
      </p>
      <PipelineFlow />
    </div>
  );
};
