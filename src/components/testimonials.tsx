"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

const steps = [
  {
    number: "01",
    title: "Connect your sources",
    description:
      "Link GitHub, LinkedIn, and Hugging Face. Octopod automatically starts indexing candidate data across all three platforms.",
  },
  {
    number: "02",
    title: "Profiles merge & rank",
    description:
      "Our AI merges scattered data into unified profiles and assigns each candidate a score based on real contributions.",
  },
  {
    number: "03",
    title: "Search & hire",
    description:
      "Describe your ideal candidate in plain English. Review ranked results, share with your team, and make your hire.",
  },
];

export const Testimonials = () => {
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">How it works</Heading>
      <Subheading className="mx-auto max-w-lg text-center text-neutral-600 dark:text-neutral-300">
        Go from scattered data to your next great hire in three simple steps.
      </Subheading>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
              <div className="mb-4 inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-4xl font-bold text-transparent">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {step.description}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden items-center justify-center py-0 md:absolute md:-right-4 md:top-1/2 md:flex md:-translate-y-1/2">
                <IconArrowRight className="h-5 w-5 text-green-500" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
