"use client";

import Link from "next/link";
import { useState } from "react";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";

import Logo from "@/components/logo";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { cn } from "@/lib/utils";

export const MobileNavbar = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-full bg-white px-2.5 py-1.5 transition duration-200 dark:bg-neutral-900",
        showBackground &&
          "bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-neutral-900 dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <Logo />
      <Menu
        className="h-6 w-6 text-black dark:text-white"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col items-start justify-start space-y-10 bg-white pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800 dark:bg-black">
          <div className="flex w-full items-center justify-between px-5">
            <Logo />
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <X
                className="h-8 w-8 text-black dark:text-white"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                onClick={() => setOpen(false)}
                className="relative"
              >
                <span className="block text-sm text-black dark:text-white md:text-2xl">
                  {navItem.title}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex w-full flex-row items-start gap-2.5 px-8 py-4">
            <button
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black transition duration-200 hover:bg-primary/10 dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl md:text-sm"
              )}
            >
              Sign In
            </button>
            <button
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] transition duration-200 hover:bg-primary/90 md:text-sm"
              )}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
