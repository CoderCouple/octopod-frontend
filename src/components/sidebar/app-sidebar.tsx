"use client";

import Image from "next/image";

import {
  Download,
  LayoutDashboard,
  Mail,
  Search,
  Settings2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
    isActive: true,
    items: [{ title: "Developers", url: "/search" }],
  },
  {
    title: "Email Sequence",
    url: "/email-sequence",
    icon: Mail,
    items: [
      { title: "Campaigns", url: "/email-sequence" },
      { title: "Templates", url: "/email-sequence/templates" },
    ],
  },
  {
    title: "Ingestor",
    url: "/ingestor",
    icon: Download,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth();

  const userData = {
    name: user?.name || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="!p-1.5">
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image
                    src="/logo_svg/octopus_happy_light.svg"
                    alt="Octopod"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                  />
                  <Image
                    src="/logo_svg/octopus_happy_dark.svg"
                    alt="Octopod"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="text-lg font-semibold">
                    <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text font-extrabold text-transparent">
                      Octo
                    </span>
                    <span className="text-stone-700 dark:text-stone-300">
                      pod
                    </span>
                    <span className="ml-1 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text font-extrabold text-transparent">
                      AI
                    </span>
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onSignOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
