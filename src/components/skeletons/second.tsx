"use client";

import React, { useState } from "react";

import { stagger, useAnimate } from "framer-motion";

export const SkeletonTwo = () => {
  const [scope, animate] = useAnimate();
  const [animating, setAnimating] = useState(false);

  const handleAnimation = async () => {
    if (animating) return;

    setAnimating(true);
    await animate(
      ".message",
      {
        opacity: [0, 1],
        y: [20, 0],
      },
      {
        delay: stagger(0.5),
      }
    );
    setAnimating(false);
  };
  return (
    <div className="relative mt-4 h-full w-full">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
      <div className="z-20 h-full rounded-[32px] border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="h-full rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
          <div className="mx-auto h-6 w-20 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80" />
          <div
            onMouseEnter={handleAnimation}
            ref={scope}
            className="content mx-auto mt-4 w-[90%]"
          >
            <UserMessage>
              Hello chat! Give me all the links from this website -
              https://ui.aceternity.com
            </UserMessage>
            <AIMessage>Why don&apos;t you do it yourself?</AIMessage>
            <UserMessage>
              Umm.. Because I&apos;m paying $20/mo for your services?
            </UserMessage>
            <AIMessage>You think I work for the money?</AIMessage>
            <UserMessage>Who do you think you are?</UserMessage>
            <AIMessage>I&apos; batman.</AIMessage>
            <AIMessage>
              Now Playing <br />{" "}
              <span className="italic">Something in the way - Nirvana</span>
            </AIMessage>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="message my-4 rounded-md bg-neutral-100 p-2 text-[10px] text-black dark:bg-neutral-800 dark:text-white sm:p-4 sm:text-xs">
      {children}
    </div>
  );
};
const AIMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="message my-4 rounded-md bg-black p-2 text-[10px] text-white dark:bg-white dark:text-black sm:p-4 sm:text-xs">
      {children}
    </div>
  );
};
