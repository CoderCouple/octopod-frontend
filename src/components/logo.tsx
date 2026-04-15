"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

function Logo({
  fontSize = "text-2xl",
  iconSize = 28,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-2 text-2xl font-extrabold",
        fontSize
      )}
    >
      <Image
        src="/logo_svg/octopus_happy_light.svg"
        alt="Octopod"
        width={iconSize}
        height={iconSize}
        className="block dark:hidden"
      />
      <Image
        src="/logo_svg/octopus_happy_dark.svg"
        alt="Octopod"
        width={iconSize}
        height={iconSize}
        className="hidden dark:block"
      />
      <div>
        <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-2xl font-extrabold text-transparent">
          Octo
        </span>
        <span className="text-stone-700 dark:text-stone-300">pod</span>
      </div>
    </Link>
  );
}

export default Logo;
