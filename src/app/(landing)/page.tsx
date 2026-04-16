import { Background } from "@/components/background";
import { Companies } from "@/components/companies";
import { Comparison } from "@/components/comparison";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { GridFeatures } from "@/components/grid-features";
import { Hero } from "@/components/hero";
import { ProfilePreview } from "@/components/profile-preview";
import { StatsBanner } from "@/components/stats-banner";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero with activity grid background */}
      <div className="relative">
        <div className="absolute inset-x-0 top-16 bottom-0 overflow-hidden">
          <Background />
        </div>
        <Container>
          <Hero />
        </Container>
      </div>
      <Container className="flex flex-col items-center justify-between">
        <Companies />
        <StatsBanner />
        <ProfilePreview />
        <Features />
        <Comparison />
        <GridFeatures />
        <Testimonials />
      </Container>
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}
