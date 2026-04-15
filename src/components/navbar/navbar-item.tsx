"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: "_blank";
};

export function NavBarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center rounded-md px-4 py-2 text-sm leading-[110%] text-inherit hover:bg-[#F5F5F5] hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800",
        (active || pathname?.includes(href)) &&
          "bg-gray-100 text-black dark:bg-neutral-800",
        className
      )}
      target={target}
    >
      {children}
    </Link>
  );
}
