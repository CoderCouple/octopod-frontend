"use client";

import { usePathname } from "next/navigation";

import { type LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const activeRoute =
    items.find((item) => item.url.length > 0 && pathname.includes(item.url)) ||
    items[0];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a
                href={item.url}
                className={buttonVariants({
                  variant:
                    item.url === activeRoute.url
                      ? "activeSidebarItem"
                      : "sidebarItem",
                })}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
