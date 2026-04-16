"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

function AnimatedNumber({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 10,
    suffix: "M+",
    label: "GitHub profiles analyzed",
  },
  {
    value: 50,
    suffix: "K+",
    label: "Candidate profiles merged",
  },
  {
    value: 3,
    suffix: "",
    label: "Platforms unified",
  },
  {
    value: 60,
    suffix: "%",
    label: "Faster time-to-hire",
  },
];

export const StatsBanner = () => {
  return (
    <div className="relative z-20 py-10 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-neutral-900 px-6 py-12 dark:bg-neutral-800/50 md:px-12 md:py-16"
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <p className="mt-2 text-sm text-neutral-400 md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
