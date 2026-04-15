import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Octopod — AI-Powered Talent Intelligence",
  description:
    "Discover, analyze, and hire top talent with Octopod — the AI-powered talent intelligence platform.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
