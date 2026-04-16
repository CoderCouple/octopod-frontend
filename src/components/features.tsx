import React from "react";

import { GridLineHorizontal, GridLineVertical } from "@/components/grid-lines";
import { Heading } from "@/components/heading";
import { SkeletonOne } from "@/components/skeletons/first";
import { SkeletonFour } from "@/components/skeletons/fourth";
import { SkeletonTwo } from "@/components/skeletons/second";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

import { SkeletonThree } from "./skeletons/third";

export const Features = () => {
  const features = [
    {
      title: "Multi-source profile merging",
      description:
        "Pull candidate data from GitHub, LinkedIn, and Hugging Face into one unified view. No more switching between tabs.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 md:col-span-4 border-b border-r dark:border-neutral-800",
    },
    {
      title: "AI-powered candidate ranking",
      description:
        "Automatically score and rank candidates based on real contributions, not just keywords on a resume.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 md:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Semantic search",
      description:
        "Find candidates by describing what you need in plain English. No boolean strings, no filters — just ask.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 md:col-span-3 border-r dark:border-neutral-800",
    },
    {
      title: "Real-time insights",
      description:
        "Track your hiring pipeline, source coverage, and talent market trends with a live analytics dashboard.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 md:col-span-3",
    },
  ];
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Built for how you actually hire</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Every feature is designed around one goal: find the right engineer,
        faster.
      </Subheading>

      <div className="relative">
        <div className="mt-12 grid grid-cols-1 md:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
        <GridLineHorizontal
          style={{
            top: 0,
            left: "-10%",
            width: "120%",
          }}
        />

        <GridLineHorizontal
          style={{
            bottom: 0,
            left: "-10%",
            width: "120%",
          }}
        />

        <GridLineVertical
          style={{
            top: "-10%",
            right: 0,
            height: "120%",
          }}
        />
        <GridLineVertical
          style={{
            top: "-10%",
            left: 0,
            height: "120%",
          }}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden p-4 sm:p-8", className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Heading as="h3" size="sm" className="text-left">
      {children}
    </Heading>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Subheading className="mx-0 my-2 max-w-sm text-left text-neutral-600 dark:text-neutral-300 md:text-sm">
      {children}
    </Subheading>
  );
};
