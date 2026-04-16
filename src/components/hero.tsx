"use client";

import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";

import { SearchDemo } from "@/components/search-demo";

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
        className="relative z-10 mx-auto mt-4 max-w-6xl text-center text-4xl font-semibold md:mt-6 md:text-5xl lg:text-8xl"
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
