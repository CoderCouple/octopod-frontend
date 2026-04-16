"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFlame,
  IconGitCommit,
  IconMapPin,
  IconStar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

const skills = [
  "TypeScript",
  "Python",
  "React",
  "Node.js",
  "PyTorch",
  "Kubernetes",
  "Rust",
  "GraphQL",
];

const contributions = [
  { icon: IconStar, label: "GitHub Stars", value: "2,340" },
  { icon: IconGitCommit, label: "Commits (1yr)", value: "1,847" },
  { icon: IconFlame, label: "HF Models", value: "12" },
];

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const filled = (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-neutral-200 dark:text-neutral-700"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          {score}
        </span>
        <span className="text-xs text-neutral-500">/100</span>
      </div>
    </div>
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

export const ProfilePreview = () => {
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">See every candidate in one place</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Octopod merges GitHub, LinkedIn, and Hugging Face into a single
        candidate profile with an AI-generated score.
      </Subheading>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-12 max-w-2xl"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          {/* Header */}
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-xl font-bold text-white">
                  AK
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Akira Kimura
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-neutral-500">
                    <IconMapPin className="h-3.5 w-3.5" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>
              <ScoreGauge score={87} />
            </div>
          </div>

          {/* Source badges */}
          <div className="border-b border-neutral-100 px-6 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">
                Sources:
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <IconBrandGithub className="h-3 w-3" />
                GitHub
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <IconBrandLinkedin className="h-3 w-3" />
                LinkedIn
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                <HuggingFaceIcon className="h-3 w-3" />
                Hugging Face
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
            <p className="mb-2 text-xs font-medium text-neutral-500">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contributions */}
          <div className="px-6 py-4">
            <p className="mb-3 text-xs font-medium text-neutral-500">
              Highlights
            </p>
            <div className="grid grid-cols-3 gap-4">
              {contributions.map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="mx-auto mb-1 h-5 w-5 text-neutral-400" />
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-neutral-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
