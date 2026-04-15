"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Candidates", url: "/candidates", icon: Users },
  { title: "Jobs", url: "/jobs", icon: BriefcaseBusiness },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const navSecondary = [
  { title: "Settings", url: "#", icon: Settings },
  { title: "Help", url: "#", icon: HelpCircle },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth();

  const userData = {
    name: user?.displayName || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    avatar: user?.photoURL || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="!p-1.5">
              <a href="/dashboard">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                  O
                </div>
                <span className="text-base font-semibold">Octopod</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onSignOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
