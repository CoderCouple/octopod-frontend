"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Balancer from "react-wrap-balancer";

import { SearchDemo } from "@/components/search-demo";

const rotatingWords = ["LinkedIn", "Leetcode", "Job Boards"];

export const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden pt-16 md:pt-20">
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="relative z-10 mx-auto mt-4 max-w-6xl text-center text-4xl font-semibold md:mt-6 md:text-5xl lg:text-8xl"
      >
        <span className="block">
          Top AI talent{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            isn&apos;t
          </span>{" "}
          on
        </span>
        <span className="relative block h-[1.2em] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingWords[wordIndex]}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-x-0 inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
            >
              {rotatingWords[wordIndex]}.
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.h1>
      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative z-10 mx-auto mt-5 max-w-3xl text-center text-base text-muted-foreground text-neutral-800 dark:text-white/80 md:text-xl"
      >
        <Balancer>
          Octopod AI finds them on GitHub, Hugging Face and LinkedIn — then
          merges their profiles and ranks them so you don&apos;t have to.
        </Balancer>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.6, delay: 0.6 }}
        className="relative mt-3 w-full md:mt-4"
      >
        <SearchDemo />
      </motion.div>
    </div>
  );
};
