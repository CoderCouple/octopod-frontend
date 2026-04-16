"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Balancer from "react-wrap-balancer";

import { SearchDemo } from "@/components/search-demo";
import { Button } from "@/components/ui/button";

export const Hero = () => {
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
        className="relative z-10 mx-auto mt-12 max-w-6xl text-center text-4xl font-semibold md:mt-16 md:text-5xl lg:text-8xl"
      >
        <Balancer>
          Top AI talent{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            isn&apos;t
          </span>{" "}
          on LinkedIn.
        </Balancer>
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
          Octopod finds them on GitHub, LinkedIn, and Hugging Face — then merges
          their profiles and ranks them so you don&apos;t have to.
        </Balancer>
      </motion.p>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.4,
        }}
        className="relative z-10 mt-6 flex items-center justify-center gap-4"
      >
        <Button className="rounded-full">Get Started Free</Button>
        <Link
          href="/contact"
          className="group flex items-center space-x-2 text-sm font-medium text-neutral-800 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
        >
          <span>Book a Demo</span>
          <ArrowRight className="h-3 w-3 stroke-[1px] transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.6, delay: 0.6 }}
        className="relative mt-12 w-full md:mt-16"
      >
        <SearchDemo />
      </motion.div>
    </div>
  );
};
