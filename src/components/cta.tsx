"use client";

import { useEffect, useState } from "react";

import { IconBrandGithub } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Balancer from "react-wrap-balancer";

import { Button } from "@/components/ui/button";

const platforms = [
  {
    icon: <IconBrandGithub className="inline h-7 w-7 md:h-10 md:w-10" />,
    name: "GitHub",
  },
  {
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo_svg/huggingface-brand.svg"
        alt="Hugging Face"
        className="inline h-7 w-7 md:h-10 md:w-10"
      />
    ),
    name: "Hugging Face",
  },
];

export const CTA = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % platforms.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative z-30 w-full overflow-hidden py-60">
      <div className="bg-white dark:bg-black">
        <div className="relative z-20 mx-auto w-full bg-gradient-to-br from-slate-800 to-gray-900 dark:from-neutral-900 sm:max-w-[40rem] sm:rounded-2xl md:max-w-[48rem] lg:max-w-[64rem] xl:max-w-[80rem]">
          <div className="relative -mx-6 overflow-hidden px-6 sm:mx-0 sm:rounded-2xl md:px-8">
            <div
              className="bg-noise fade-vignette absolute inset-0 h-full w-full opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
              style={{
                backgroundImage: "url(/noise.webp)",
                backgroundSize: "30%",
              }}
            ></div>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 select-none overflow-hidden rounded-2xl"
              style={{
                mask: "radial-gradient(33.875rem 33.875rem at calc(100% - 8.9375rem) 0, white 3%, transparent 70%)",
              }}
            ></div>

            <div className="relative px-6 pb-14 pt-20 sm:px-10 sm:pb-20 lg:px-[4.5rem]">
              <h2 className="mx-auto whitespace-nowrap text-center text-3xl font-semibold tracking-[-0.015em] text-white md:text-5xl">
                Your next great hire is already on{" "}
                <span className="relative inline-flex h-[1.8em] w-[14rem] overflow-hidden align-[-1.5rem] md:w-[26rem]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-x-0 bottom-[0.25em] inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {platforms[index].icon}
                      {platforms[index].name}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-[26rem] text-center text-base/6 text-neutral-200">
                <Balancer>
                  Stop searching. Start finding. Get instant access to Octopod
                  AI and discover top engineering talent today.
                </Balancer>
              </p>

              <div className="relative z-10 mx-auto mt-6 flex justify-center">
                <Button>Get Started Free</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
