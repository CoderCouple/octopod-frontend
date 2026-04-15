import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export const GridFeatures = () => {
  const features = [
    {
      title: "Built for recruiters",
      description:
        "Built for talent teams, recruiters, and hiring managers who demand the best.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Effortless onboarding",
      description:
        "Get your team up and running in minutes. No complex setup or training required.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Transparent pricing",
      description:
        "Simple, predictable pricing. No hidden fees, no per-seat charges, no surprises.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "99.9% uptime guarantee",
      description: "Enterprise-grade reliability so your hiring never stops.",
      icon: <IconCloud />,
    },
    {
      title: "Multi-team collaboration",
      description:
        "Collaborate across departments with role-based access and shared candidate pools.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 customer support",
      description:
        "Our team is always available to help you get the most out of Octopod.",
      icon: <IconHelp />,
    },
    {
      title: "Data-driven decisions",
      description:
        "Make smarter hiring decisions with AI-powered analytics and insights.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Candidate experience",
      description:
        "Deliver a world-class candidate experience that reflects your employer brand.",
      icon: <IconHeart />,
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
