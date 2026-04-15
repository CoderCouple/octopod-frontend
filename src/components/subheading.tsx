import React from "react";

import { MotionProps } from "framer-motion";
import Balancer from "react-wrap-balancer";

import { cn } from "@/lib/utils";

export const Subheading = ({
  className,
  as: Tag = "h2",
  children,
}: {
  className?: string;
  as?: any;
  children: any;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <Tag
      className={cn(
        "mx-auto my-4 max-w-4xl text-left text-sm md:text-base",
        "text-center font-normal text-muted-foreground",
        className
      )}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
