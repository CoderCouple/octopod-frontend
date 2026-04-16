"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

const traditional = [
  { text: "Manual LinkedIn sourcing", negative: true },
  { text: "Scattered data across platforms", negative: true },
  { text: "No objective ranking system", negative: true },
  { text: "Hours of manual screening", negative: true },
  { text: "1-3% outreach response rate", negative: true },
  { text: "Gut-feeling decisions", negative: true },
];

const octopod = [
  { text: "Unified profiles from 3 sources", negative: false },
  { text: "All data merged into one view", negative: false },
  { text: "AI-powered candidate ranking", negative: false },
  { text: "Instant semantic search", negative: false },
  { text: "Pre-qualified, high-signal candidates", negative: false },
  { text: "Data-driven hiring decisions", negative: false },
];

export const Comparison = () => {
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Traditional sourcing is broken</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Stop wasting hours on scattered data and guesswork. See the difference.
      </Subheading>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50 md:p-8"
        >
          <h3 className="mb-6 text-lg font-semibold text-neutral-500 dark:text-neutral-400">
            Traditional Hiring
          </h3>
          <ul className="space-y-4">
            {traditional.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-green-200 bg-green-50/50 p-6 dark:border-green-900/50 dark:bg-green-950/20 md:p-8"
        >
          <h3 className="mb-6 text-lg font-semibold text-green-700 dark:text-green-400">
            With Octopod
          </h3>
          <ul className="space-y-4">
            {octopod.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-neutral-800 dark:text-neutral-200">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
