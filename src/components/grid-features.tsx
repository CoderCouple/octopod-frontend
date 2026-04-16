import {
  IconAdjustmentsBolt,
  IconBrain,
  IconBrandGithub,
  IconBrandLinkedin,
  IconSearch,
  IconShieldCheck,
  IconTimeline,
  IconUsers,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export const GridFeatures = () => {
  const features = [
    {
      title: "GitHub deep analysis",
      description:
        "Repos, stars, commits, and language proficiency — understand what engineers actually build.",
      icon: <IconBrandGithub />,
    },
    {
      title: "LinkedIn integration",
      description:
        "Experience, education, and endorsements pulled directly into a unified candidate view.",
      icon: <IconBrandLinkedin />,
    },
    {
      title: "HuggingFace insights",
      description:
        "ML models, datasets, and spaces — find AI/ML talent based on real published work.",
      icon: <IconBrain />,
    },
    {
      title: "Smart ranking",
      description:
        "Weighted scoring across all sources so the best candidates rise to the top automatically.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Semantic search",
      description:
        "Describe your ideal candidate in plain English. Octopod finds them instantly.",
      icon: <IconSearch />,
    },
    {
      title: "Bias reduction",
      description:
        "Data-driven decisions based on real contributions, not resumes or gut feelings.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Pipeline management",
      description:
        "Track candidates through every hiring stage with a clear, visual pipeline.",
      icon: <IconTimeline />,
    },
    {
      title: "Team collaboration",
      description:
        "Share profiles, scorecards, and notes with your team — stay aligned on every hire.",
      icon: <IconUsers />,
    },
  ];
  return (
    <div className="relative z-10 grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col py-10 dark:border-neutral-800 lg:border-r",
        (index === 0 || index === 4) && "dark:border-neutral-800 lg:border-l",
        index < 4 && "dark:border-neutral-800 lg:border-b"
      )}
    >
      {index < 4 && (
        <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800" />
      )}
      {index >= 4 && (
        <div className="group pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 dark:from-neutral-800" />
      )}
      <div className="relative z-10 mb-4 px-10">{icon}</div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 rounded-br-full rounded-tr-full bg-neutral-300 transition duration-200 group-hover:bg-primary dark:bg-neutral-700" />
        <span className="inline-block transition duration-200 group-hover:translate-x-2">
          {title}
        </span>
      </div>
      <p className="relative z-10 mx-auto max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
};
