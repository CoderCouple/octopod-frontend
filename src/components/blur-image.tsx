"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface IBlurImage {
  height?: number;
  width?: number;
  src: string;
  className?: string;
  alt?: string;
  layout?: "fixed" | "fill" | "responsive" | "intrinsic";
  [key: string]: any;
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  layout,
  ...rest
}: IBlurImage) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transform transition duration-300",
        isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={src}
      layout={layout}
      alt={alt ? alt : "Avatar"}
      {...rest}
    />
  );
};
