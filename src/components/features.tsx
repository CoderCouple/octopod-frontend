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
      title: "Candidate sourcing at scale",
      description:
        "Source top talent from multiple channels simultaneously. Our AI scans millions of profiles to find the perfect match for your roles.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 md:col-span-4 border-b border-r dark:border-neutral-800",
    },
    {
      title: "Smart candidate engagement",
      description:
        "Engage candidates with personalized outreach powered by AI. Automate follow-ups and track every interaction in one place.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 md:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Configurable hiring pipelines",
      description:
        "Customize your hiring pipeline stages, scoring criteria, and team permissions to match your unique workflow.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 md:col-span-3 border-r dark:border-neutral-800",
    },
    {
      title: "Global talent analytics",
      description:
        "Gain deep insights into talent markets worldwide. Understand compensation trends, skill availability, and hiring competition.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 md:col-span-3",
    },
  ];
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Packed with powerful features</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        From candidate sourcing to offer management, Octopod has everything you
        need to build world-class teams.
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
