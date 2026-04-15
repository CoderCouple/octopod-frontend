import { BreadcrumbHeader } from "@/components/breadcrumb-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Auth guard — uncomment when enabling login
// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.replace("/login");
  //   }
  // }, [user, loading, router]);

  // if (loading || !user) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex w-full items-center justify-between gap-2 px-4">
              <div className="flex items-center">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadcrumbHeader />
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </div>
          </header>
          <Separator />
          <div className="overflow-auto">
            <div className="container flex-1 py-4 text-accent-foreground">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
