import { Background } from "@/components/background";
import { Companies } from "@/components/companies";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { Hero } from "@/components/hero";
import { Leaderboard } from "@/components/leaderboard";
import { OrgChart } from "@/components/org-chart";
import { ProfilePreview } from "@/components/profile-preview";
import { StatsShowcase } from "@/components/stats-showcase";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero with activity grid background */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 top-16 overflow-hidden">
          <Background />
        </div>
        <Container>
          <Hero />
        </Container>
      </div>
      <Container className="flex flex-col items-center justify-between">
        <Companies />
        <StatsShowcase />
        <ProfilePreview />
        <Leaderboard />
      </Container>
      <div className="mx-auto w-full max-w-[100vw] overflow-x-auto px-4">
        <OrgChart />
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}
