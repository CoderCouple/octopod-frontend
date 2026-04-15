import Image from "next/image";
import { useMemo } from "react";

import { Heading } from "@/components/heading";
import { InViewDiv } from "@/components/in-view-div";
import { Subheading } from "@/components/subheading";
import { TestimonialColumnContainer } from "@/components/testimonial-column-container";
import { cn } from "@/lib/utils";

export const Testimonials = () => {
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Loved by hiring teams everywhere</Heading>
      <Subheading className="mx-auto max-w-lg text-center text-neutral-600 dark:text-neutral-300">
        Octopod is trusted by thousands of recruiters and hiring managers
        worldwide to find and hire top talent faster.
      </Subheading>
      <TestimonialGrid />
    </div>
  );
};

interface Testimonial {
  name: string;
  quote: string;
  src: string;
  designation?: string;
}

const testimonials = [
  {
    name: "Sarah Chen",
    quote:
      "Octopod completely transformed our hiring process. We reduced our time-to-hire by 60% and the quality of candidates has never been better.",
    src: "https://i.pravatar.cc/150?img=1",
    designation: "VP of People, TechCorp",
  },
  {
    name: "James Rodriguez",
    quote:
      "The AI-powered candidate matching is incredible. It surfaces talent we would have never found through traditional sourcing methods.",
    src: "https://i.pravatar.cc/150?img=2",
    designation: "Head of Talent Acquisition",
  },
  {
    name: "Emily Parker",
    quote:
      "We've been able to scale our hiring from 50 to 200 people per quarter without adding a single recruiter, all thanks to Octopod.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Chief People Officer",
  },
  {
    name: "Michael Torres",
    quote:
      "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions about our talent strategy.",
    src: "https://i.pravatar.cc/150?img=4",
    designation: "Director of HR Analytics",
  },
  {
    name: "Lisa Wang",
    quote:
      "Octopod's candidate experience features have significantly improved our employer brand. Candidates actually enjoy our hiring process now.",
    src: "https://i.pravatar.cc/150?img=5",
    designation: "Employer Brand Manager",
  },
  {
    name: "David Kim",
    quote:
      "The multi-team collaboration features are a game changer. Our engineering and product teams are finally aligned on hiring priorities.",
    src: "https://i.pravatar.cc/150?img=6",
    designation: "Engineering Manager",
  },
  {
    name: "Rachel Foster",
    quote:
      "We switched from three different tools to just Octopod. It handles everything from sourcing to onboarding seamlessly.",
    src: "https://i.pravatar.cc/150?img=7",
    designation: "HR Operations Lead",
  },
  {
    name: "Alex Thompson",
    quote:
      "The AI interview scheduling alone saves us 20 hours per week. The ROI was clear within the first month of using Octopod.",
    src: "https://i.pravatar.cc/150?img=8",
    designation: "Recruiting Coordinator",
  },
  {
    name: "Nina Patel",
    quote:
      "Octopod helped us build a diverse pipeline effortlessly. The bias-reduction features in the screening process are truly innovative.",
    src: "https://i.pravatar.cc/150?img=9",
    designation: "DEI Program Manager",
  },
  {
    name: "Chris Martinez",
    quote:
      "As a startup, every hire matters. Octopod gives us enterprise-level talent intelligence at a price we can actually afford.",
    src: "https://i.pravatar.cc/150?img=10",
    designation: "Startup Founder & CEO",
  },
  {
    name: "Amanda Hughes",
    quote:
      "The candidate relationship management features are outstanding. We nurture talent pools that convert into hires months later.",
    src: "https://i.pravatar.cc/150?img=11",
    designation: "Talent CRM Specialist",
  },
  {
    name: "Robert Chang",
    quote:
      "Integration with our existing HR stack was seamless. Octopod plays nicely with every tool we already use.",
    src: "https://i.pravatar.cc/150?img=12",
    designation: "HR Technology Manager",
  },
  {
    name: "Sophie Laurent",
    quote:
      "We hire across 12 countries and Octopod handles compliance and localization beautifully. It's truly built for global teams.",
    src: "https://i.pravatar.cc/150?img=13",
    designation: "Global Talent Director",
  },
  {
    name: "Marcus Johnson",
    quote:
      "The predictive analytics told us exactly where to focus our recruiting efforts. Our offer acceptance rate went up by 35%.",
    src: "https://i.pravatar.cc/150?img=14",
    designation: "Recruitment Strategy Lead",
  },
  {
    name: "Diana Ross",
    quote:
      "Octopod's reporting capabilities give our leadership team the visibility they need into our talent pipeline health.",
    src: "https://i.pravatar.cc/150?img=15",
    designation: "CHRO",
  },
  {
    name: "Kevin Wright",
    quote:
      "The automated reference checking feature alone is worth the investment. What used to take days now happens in hours.",
    src: "https://i.pravatar.cc/150?img=16",
    designation: "Senior Recruiter",
  },
  {
    name: "Jennifer Lee",
    quote:
      "Our hiring managers love the collaborative scorecards. Everyone is on the same page about what great looks like for each role.",
    src: "https://i.pravatar.cc/150?img=17",
    designation: "Talent Programs Manager",
  },
  {
    name: "Thomas Anderson",
    quote:
      "Octopod's skill assessment integrations have dramatically improved our technical hiring accuracy. Fewer bad hires, more great ones.",
    src: "https://i.pravatar.cc/150?img=18",
    designation: "Technical Recruiting Lead",
  },
  {
    name: "Maria Garcia",
    quote:
      "The candidate feedback surveys built into Octopod help us continuously improve our hiring process. It's a virtuous cycle.",
    src: "https://i.pravatar.cc/150?img=19",
    designation: "People Experience Manager",
  },
  {
    name: "Daniel Brown",
    quote:
      "Support team is phenomenal. Any time we have a question, they respond within minutes with thoughtful, helpful answers.",
    src: "https://i.pravatar.cc/150?img=20",
    designation: "HR Business Partner",
  },
  {
    name: "Olivia Taylor",
    quote:
      "We went from a chaotic spreadsheet-based process to a streamlined hiring machine. Octopod is the backbone of our talent strategy.",
    src: "https://i.pravatar.cc/150?img=21",
    designation: "Head of People Operations",
  },
  {
    name: "Ryan Mitchell",
    quote:
      "The market intelligence features help us stay competitive with compensation. We never lose candidates to lowball offers anymore.",
    src: "https://i.pravatar.cc/150?img=22",
    designation: "Compensation Analyst",
  },
];

function Testimonial({
  name,
  quote,
  src,
  designation,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"figure">, keyof Testimonial> &
  Testimonial) {
  const animationDelay = useMemo(() => {
    const possibleAnimationDelays = [
      "0s",
      "0.1s",
      "0.2s",
      "0.3s",
      "0.4s",
      "0.5s",
    ];
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ];
  }, []);

  return (
    <figure
      className={cn(
        "animate-fade-in rounded-3xl bg-transparent p-8 opacity-0 shadow-derek dark:bg-neutral-900",
        className
      )}
      style={{
        animationDelay,
      }}
      {...props}
    >
      <div className="flex flex-col items-start">
        <div className="flex gap-2">
          <Image
            src={src}
            width={150}
            height={150}
            className="h-10 w-10 rounded-full"
            alt={name}
          />
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
              {name}
            </h3>
            <p className="text-sm font-normal text-neutral-500 dark:text-neutral-300">
              {designation}
            </p>
          </div>
        </div>
        <p className="mt-4 text-base text-neutral-700 dark:text-neutral-200">
          {quote}
        </p>
      </div>
    </figure>
  );
}

function TestimonialColumn({
  testimonials,
  className,
  containerClassName,
  shift = 0,
}: {
  testimonials: Testimonial[];
  className?: string;
  containerClassName?: (reviewIndex: number) => string;
  shift?: number;
}) {
  return (
    <TestimonialColumnContainer className={cn(className)} shift={shift}>
      {testimonials
        .concat(testimonials)
        .map((testimonial, testimonialIndex) => (
          <Testimonial
            name={testimonial.name}
            quote={testimonial.quote}
            src={testimonial.src}
            designation={testimonial.designation}
            key={testimonialIndex}
            className={containerClassName?.(
              testimonialIndex % testimonials.length
            )}
          />
        ))}
    </TestimonialColumnContainer>
  );
}

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
}

function TestimonialGrid() {
  const columns = splitArray(testimonials, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);
  return (
    <InViewDiv className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
      <TestimonialColumn
        testimonials={[...column1, ...column3.flat(), ...column2]}
        containerClassName={(tIndex) =>
          cn(
            tIndex >= column1.length + column3[0].length && "md:hidden",
            tIndex >= column1.length && "lg:hidden"
          )
        }
        shift={10}
      />
      <TestimonialColumn
        testimonials={[...column2, ...column3[1]]}
        className="hidden md:block"
        containerClassName={(tIndex) =>
          tIndex >= column2.length ? "lg:hidden" : ""
        }
        shift={15}
      />
      <TestimonialColumn
        testimonials={column3.flat()}
        className="hidden lg:block"
        shift={10}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black" />
    </InViewDiv>
  );
}
