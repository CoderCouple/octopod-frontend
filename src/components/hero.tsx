"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Balancer from "react-wrap-balancer";

import { Badge } from "@/components/badge";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const [subtitle, setSubtitle] = useState(
    "AI-Powered Talent Intelligence Platform"
  );

  useEffect(() => {
    const subtitles = [
      "AI-Powered Talent Intelligence Platform",
      "Smarter Hiring Starts Here",
    ];
    setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)]);
  }, []);
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden pt-20 md:pt-40">
      <motion.div
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
          duration: 1.0,
        }}
        className="mb-10 flex justify-center"
      >
        <Badge className="cursor-pointer bg-gradient-to-r from-green-600 to-green-500 text-white transition-all hover:scale-105">
          Talent Intelligence Platform
        </Badge>
      </motion.div>
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
        className="relative z-10 mx-auto mt-6 max-w-6xl text-center text-4xl font-semibold md:text-5xl lg:text-8xl"
      >
        <Balancer>
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            {" "}
            Discover{" "}
          </span>{" "}
          <span className="text-neutral-200 dark:text-neutral-800">| </span>
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            {" "}
            Analyze{" "}
          </span>{" "}
          <span className="text-neutral-200 dark:text-neutral-800">| </span>
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            {" "}
            Hire{" "}
          </span>
        </Balancer>
        <div className="mt-6 overflow-visible whitespace-nowrap text-xl md:mt-8 md:text-3xl lg:mt-10 lg:text-6xl">
          {subtitle}
        </div>
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
        className="relative z-10 mx-auto mt-7 max-w-6xl text-justify text-base text-muted-foreground text-neutral-800 dark:text-white/80 md:text-xl"
      >
        Octopod is an AI-powered talent intelligence platform that helps you
        discover top candidates, analyze skills and cultural fit, and streamline
        your entire hiring pipeline — from sourcing to offer.
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
        <Button className="rounded-full">Get Started</Button>
        <Link
          href="/contact"
          className="group flex items-center space-x-2 text-sm font-medium text-neutral-800 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
        >
          <span>Contact us</span>
          <ArrowRight className="h-3 w-3 stroke-[1px] transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </motion.div>
      <div className="relative mt-20 rounded-[32px] border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full scale-[1.1] bg-gradient-to-b from-transparent via-white to-white dark:via-black/50 dark:to-black" />
        <div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
          <Image
            src="/header.png"
            alt="header"
            width={1920}
            height={1080}
            className="rounded-[20px]"
          />
        </div>
      </div>
    </div>
  );
};
