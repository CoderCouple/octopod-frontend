"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  MapPin,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconRobot,
} from "@tabler/icons-react";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

interface OrgNode {
  id: string;
  name: string;
  title: string;
  level: string;
  tscore: number;
  tier: "A" | "B" | "C";
  location: string;
  skills: string[];
  sources: ("github" | "linkedin" | "huggingface")[];
  yoe: number;
  children?: OrgNode[];
}

interface CandidateProfile {
  name: string;
  tscore: number;
  tier: "A" | "B" | "C";
  title: string;
  fitLevel: string;
}

const candidateProfiles: CandidateProfile[] = [
  {
    name: "You (Senior Eng)",
    tscore: 86,
    tier: "A",
    title: "Senior Engineer",
    fitLevel: "L4 — Senior Engineer",
  },
  {
    name: "Junior Dev",
    tscore: 62,
    tier: "C",
    title: "Software Engineer",
    fitLevel: "L5 — Engineer",
  },
  {
    name: "Staff Candidate",
    tscore: 91,
    tier: "A",
    title: "Staff Engineer",
    fitLevel: "L3 — Staff Engineer",
  },
];

// ── Org data (5 levels each) ──

const orgData: Record<string, OrgNode> = {
  Google: {
    id: "g1",
    name: "Sundar P.",
    title: "CEO",
    level: "L1 — Executive",
    tscore: 96,
    tier: "A",
    location: "Mountain View, CA",
    skills: ["Leadership", "Strategy", "Product"],
    sources: ["linkedin"],
    yoe: 22,
    children: [
      {
        id: "g2",
        name: "James K.",
        title: "SVP Engineering",
        level: "L2 — SVP",
        tscore: 93,
        tier: "A",
        location: "Mountain View, CA",
        skills: ["Systems Design", "Go", "Distributed Systems"],
        sources: ["github", "linkedin"],
        yoe: 18,
        children: [
          {
            id: "g5",
            name: "David L.",
            title: "VP Backend",
            level: "L2 — VP",
            tscore: 90,
            tier: "A",
            location: "Seattle, WA",
            skills: ["Java", "Kubernetes", "gRPC"],
            sources: ["github", "linkedin"],
            yoe: 15,
            children: [
              {
                id: "g10",
                name: "Priya S.",
                title: "Dir Backend",
                level: "L3 — Director",
                tscore: 87,
                tier: "A",
                location: "Sunnyvale, CA",
                skills: ["Python", "Spanner", "Microservices"],
                sources: ["github", "linkedin"],
                yoe: 12,
                children: [
                  {
                    id: "g16",
                    name: "Tom W.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 84,
                    tier: "B",
                    location: "NYC, NY",
                    skills: ["Go", "Bigtable", "Pub/Sub"],
                    sources: ["github", "linkedin"],
                    yoe: 9,
                    children: [
                      {
                        id: "g23",
                        name: "Kevin L.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 68,
                        tier: "C",
                        location: "NYC, NY",
                        skills: ["Go", "SQL", "gRPC"],
                        sources: ["github"],
                        yoe: 2,
                      },
                      {
                        id: "g24",
                        name: "Dina M.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 64,
                        tier: "C",
                        location: "Seattle, WA",
                        skills: ["Python", "BigQuery", "Dataflow"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                  {
                    id: "g17",
                    name: "Nina R.",
                    title: "Senior Engineer",
                    level: "L4 — Senior Engineer",
                    tscore: 79,
                    tier: "B",
                    location: "Austin, TX",
                    skills: ["Java", "Cloud SQL", "Terraform"],
                    sources: ["github"],
                    yoe: 6,
                    children: [
                      {
                        id: "g25",
                        name: "Ryan T.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 61,
                        tier: "C",
                        location: "Austin, TX",
                        skills: ["Java", "Spring", "MySQL"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "g6",
            name: "Maria C.",
            title: "VP Frontend",
            level: "L2 — VP",
            tscore: 89,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["TypeScript", "Angular", "Web Perf"],
            sources: ["github", "linkedin"],
            yoe: 14,
            children: [
              {
                id: "g11",
                name: "Raj P.",
                title: "Dir Frontend",
                level: "L3 — Director",
                tscore: 85,
                tier: "B",
                location: "Mountain View, CA",
                skills: ["React", "TypeScript", "WebAssembly"],
                sources: ["github", "linkedin"],
                yoe: 11,
                children: [
                  {
                    id: "g18",
                    name: "Amy Z.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 82,
                    tier: "B",
                    location: "Seattle, WA",
                    skills: ["React", "Next.js", "GraphQL"],
                    sources: ["github"],
                    yoe: 8,
                    children: [
                      {
                        id: "g26",
                        name: "Zara H.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 65,
                        tier: "C",
                        location: "Mountain View, CA",
                        skills: ["TypeScript", "React", "CSS"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "g3",
        name: "Jeff D.",
        title: "SVP AI/ML",
        level: "L2 — SVP",
        tscore: 95,
        tier: "A",
        location: "Mountain View, CA",
        skills: ["ML", "TensorFlow", "Research"],
        sources: ["github", "linkedin", "huggingface"],
        yoe: 20,
        children: [
          {
            id: "g7",
            name: "Yuki T.",
            title: "VP ML Research",
            level: "L2 — VP",
            tscore: 92,
            tier: "A",
            location: "Mountain View, CA",
            skills: ["PyTorch", "Transformers", "CUDA"],
            sources: ["github", "huggingface"],
            yoe: 16,
            children: [
              {
                id: "g12",
                name: "Alex C.",
                title: "Dir ML Eng",
                level: "L3 — Director",
                tscore: 88,
                tier: "A",
                location: "NYC, NY",
                skills: ["Python", "JAX", "TPU"],
                sources: ["github", "huggingface"],
                yoe: 13,
                children: [
                  {
                    id: "g19",
                    name: "Sana K.",
                    title: "Staff ML Eng",
                    level: "L3 — Staff Engineer",
                    tscore: 85,
                    tier: "B",
                    location: "Seattle, WA",
                    skills: ["Python", "TensorFlow", "Vertex AI"],
                    sources: ["github", "huggingface"],
                    yoe: 8,
                    children: [
                      {
                        id: "g27",
                        name: "Chris N.",
                        title: "ML Engineer",
                        level: "L5 — Engineer",
                        tscore: 66,
                        tier: "C",
                        location: "Seattle, WA",
                        skills: ["Python", "Keras", "NumPy"],
                        sources: ["github"],
                        yoe: 2,
                      },
                    ],
                  },
                  {
                    id: "g20",
                    name: "Erik B.",
                    title: "Senior ML Eng",
                    level: "L4 — Senior Engineer",
                    tscore: 80,
                    tier: "B",
                    location: "Zurich",
                    skills: ["Python", "PyTorch", "ONNX"],
                    sources: ["github"],
                    yoe: 5,
                    children: [
                      {
                        id: "g28",
                        name: "Jana S.",
                        title: "ML Engineer",
                        level: "L5 — Engineer",
                        tscore: 60,
                        tier: "C",
                        location: "Zurich",
                        skills: ["Python", "Pandas", "scikit-learn"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "g4",
        name: "Sarah M.",
        title: "SVP Infra",
        level: "L2 — SVP",
        tscore: 91,
        tier: "A",
        location: "Mountain View, CA",
        skills: ["SRE", "Networking", "Borg"],
        sources: ["linkedin"],
        yoe: 19,
        children: [
          {
            id: "g8",
            name: "Ben R.",
            title: "VP SRE",
            level: "L2 — VP",
            tscore: 88,
            tier: "A",
            location: "Seattle, WA",
            skills: ["Kubernetes", "Terraform", "Monitoring"],
            sources: ["github", "linkedin"],
            yoe: 14,
            children: [
              {
                id: "g13",
                name: "Rosa F.",
                title: "Dir SRE",
                level: "L3 — Director",
                tscore: 84,
                tier: "B",
                location: "Austin, TX",
                skills: ["Go", "Prometheus", "Envoy"],
                sources: ["github"],
                yoe: 11,
                children: [
                  {
                    id: "g21",
                    name: "Leo N.",
                    title: "Staff SRE",
                    level: "L3 — Staff Engineer",
                    tscore: 80,
                    tier: "B",
                    location: "Portland, OR",
                    skills: ["Python", "Docker", "GKE"],
                    sources: ["github"],
                    yoe: 7,
                    children: [
                      {
                        id: "g29",
                        name: "Max P.",
                        title: "SRE",
                        level: "L5 — Engineer",
                        tscore: 63,
                        tier: "C",
                        location: "Portland, OR",
                        skills: ["Bash", "Linux", "Docker"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                  {
                    id: "g22",
                    name: "Mia J.",
                    title: "Senior SRE",
                    level: "L4 — Senior Engineer",
                    tscore: 76,
                    tier: "C",
                    location: "London, UK",
                    skills: ["Bash", "Ansible", "CloudRun"],
                    sources: ["github"],
                    yoe: 5,
                    children: [
                      {
                        id: "g30",
                        name: "Ella W.",
                        title: "SRE",
                        level: "L5 — Engineer",
                        tscore: 58,
                        tier: "C",
                        location: "London, UK",
                        skills: ["Python", "Terraform", "GCP"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  Meta: {
    id: "m1",
    name: "Mark Z.",
    title: "CEO",
    level: "L1 — Executive",
    tscore: 95,
    tier: "A",
    location: "Menlo Park, CA",
    skills: ["Product", "Leadership", "VR/AR"],
    sources: ["linkedin"],
    yoe: 20,
    children: [
      {
        id: "m2",
        name: "Andrew B.",
        title: "CTO",
        level: "L2 — SVP",
        tscore: 94,
        tier: "A",
        location: "Menlo Park, CA",
        skills: ["Systems Design", "Infra", "Networking"],
        sources: ["github", "linkedin"],
        yoe: 18,
        children: [
          {
            id: "m5",
            name: "Jen L.",
            title: "VP Infra",
            level: "L2 — VP",
            tscore: 90,
            tier: "A",
            location: "Seattle, WA",
            skills: ["C++", "Thrift", "HHVM"],
            sources: ["github", "linkedin"],
            yoe: 15,
            children: [
              {
                id: "m10",
                name: "Carlos M.",
                title: "Dir Platform",
                level: "L3 — Director",
                tscore: 86,
                tier: "B",
                location: "NYC, NY",
                skills: ["Rust", "React Native", "GraphQL"],
                sources: ["github", "linkedin"],
                yoe: 12,
                children: [
                  {
                    id: "m14",
                    name: "Hana Y.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 83,
                    tier: "B",
                    location: "Menlo Park, CA",
                    skills: ["Hack", "MySQL", "Memcached"],
                    sources: ["github"],
                    yoe: 8,
                    children: [
                      {
                        id: "m19",
                        name: "Ivan K.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 65,
                        tier: "C",
                        location: "Menlo Park, CA",
                        skills: ["Hack", "PHP", "MySQL"],
                        sources: ["github"],
                        yoe: 2,
                      },
                    ],
                  },
                  {
                    id: "m15",
                    name: "Victor S.",
                    title: "Senior Engineer",
                    level: "L4 — Senior Engineer",
                    tscore: 78,
                    tier: "B",
                    location: "London, UK",
                    skills: ["Python", "PyTorch", "FAISS"],
                    sources: ["github"],
                    yoe: 5,
                    children: [
                      {
                        id: "m20",
                        name: "Nora B.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 59,
                        tier: "C",
                        location: "London, UK",
                        skills: ["Python", "NumPy", "Jupyter"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "m3",
        name: "Chris C.",
        title: "VP AI",
        level: "L2 — SVP",
        tscore: 94,
        tier: "A",
        location: "Menlo Park, CA",
        skills: ["PyTorch", "LLMs", "Computer Vision"],
        sources: ["github", "linkedin", "huggingface"],
        yoe: 17,
        children: [
          {
            id: "m6",
            name: "Aisha K.",
            title: "VP Research",
            level: "L2 — VP",
            tscore: 91,
            tier: "A",
            location: "NYC, NY",
            skills: ["Python", "PyTorch", "Diffusion Models"],
            sources: ["github", "huggingface"],
            yoe: 14,
            children: [
              {
                id: "m11",
                name: "Dan P.",
                title: "Dir ML Eng",
                level: "L3 — Director",
                tscore: 88,
                tier: "A",
                location: "Menlo Park, CA",
                skills: ["CUDA", "Triton", "LLaMA"],
                sources: ["github", "huggingface"],
                yoe: 11,
                children: [
                  {
                    id: "m16",
                    name: "Mei W.",
                    title: "Staff ML Eng",
                    level: "L3 — Staff Engineer",
                    tscore: 85,
                    tier: "B",
                    location: "Seattle, WA",
                    skills: ["Python", "JAX", "Transformers"],
                    sources: ["github", "huggingface"],
                    yoe: 7,
                    children: [
                      {
                        id: "m21",
                        name: "Luca R.",
                        title: "ML Engineer",
                        level: "L5 — Engineer",
                        tscore: 62,
                        tier: "C",
                        location: "Menlo Park, CA",
                        skills: ["Python", "PyTorch", "Pandas"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "m4",
        name: "Katie H.",
        title: "VP Product",
        level: "L2 — SVP",
        tscore: 88,
        tier: "A",
        location: "Menlo Park, CA",
        skills: ["Product Strategy", "UX", "Growth"],
        sources: ["linkedin"],
        yoe: 16,
        children: [
          {
            id: "m7",
            name: "Oscar R.",
            title: "Dir Product Eng",
            level: "L2 — VP",
            tscore: 85,
            tier: "B",
            location: "NYC, NY",
            skills: ["React", "Relay", "GraphQL"],
            sources: ["github", "linkedin"],
            yoe: 13,
            children: [
              {
                id: "m12",
                name: "Luna T.",
                title: "Dir Frontend",
                level: "L3 — Director",
                tscore: 82,
                tier: "B",
                location: "Menlo Park, CA",
                skills: ["TypeScript", "React", "Flow"],
                sources: ["github"],
                yoe: 10,
                children: [
                  {
                    id: "m17",
                    name: "Jay P.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 79,
                    tier: "B",
                    location: "Austin, TX",
                    skills: ["React", "TypeScript", "Jest"],
                    sources: ["github"],
                    yoe: 7,
                    children: [
                      {
                        id: "m22",
                        name: "Tina G.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 60,
                        tier: "C",
                        location: "Austin, TX",
                        skills: ["React", "JavaScript", "HTML"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                  {
                    id: "m18",
                    name: "Zoe F.",
                    title: "Senior Engineer",
                    level: "L4 — Senior Engineer",
                    tscore: 74,
                    tier: "C",
                    location: "London, UK",
                    skills: ["JavaScript", "CSS", "Webpack"],
                    sources: ["github"],
                    yoe: 4,
                    children: [
                      {
                        id: "m23",
                        name: "Sam D.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 55,
                        tier: "C",
                        location: "London, UK",
                        skills: ["HTML", "CSS", "JavaScript"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  Stripe: {
    id: "s1",
    name: "Patrick C.",
    title: "CEO",
    level: "L1 — Executive",
    tscore: 96,
    tier: "A",
    location: "San Francisco, CA",
    skills: ["Payments", "Product", "Leadership"],
    sources: ["linkedin"],
    yoe: 15,
    children: [
      {
        id: "s2",
        name: "David S.",
        title: "CTO",
        level: "L2 — SVP",
        tscore: 95,
        tier: "A",
        location: "San Francisco, CA",
        skills: ["Ruby", "Distributed Systems", "API Design"],
        sources: ["github", "linkedin"],
        yoe: 16,
        children: [
          {
            id: "s5",
            name: "Emily Z.",
            title: "VP Platform",
            level: "L2 — VP",
            tscore: 91,
            tier: "A",
            location: "Seattle, WA",
            skills: ["Go", "gRPC", "Payment Rails"],
            sources: ["github", "linkedin"],
            yoe: 13,
            children: [
              {
                id: "s9",
                name: "Nathan R.",
                title: "Dir Platform",
                level: "L3 — Director",
                tscore: 87,
                tier: "A",
                location: "San Francisco, CA",
                skills: ["Ruby", "Sorbet", "MySQL"],
                sources: ["github", "linkedin"],
                yoe: 10,
                children: [
                  {
                    id: "s13",
                    name: "Sara K.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 84,
                    tier: "B",
                    location: "NYC, NY",
                    skills: ["Go", "Kafka", "Redis"],
                    sources: ["github"],
                    yoe: 7,
                    children: [
                      {
                        id: "s18",
                        name: "Ben A.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 64,
                        tier: "C",
                        location: "NYC, NY",
                        skills: ["Ruby", "Go", "SQL"],
                        sources: ["github"],
                        yoe: 2,
                      },
                    ],
                  },
                  {
                    id: "s14",
                    name: "Owen B.",
                    title: "Senior Engineer",
                    level: "L4 — Senior Engineer",
                    tscore: 78,
                    tier: "B",
                    location: "Dublin, IE",
                    skills: ["TypeScript", "React", "Stripe.js"],
                    sources: ["github"],
                    yoe: 5,
                    children: [
                      {
                        id: "s19",
                        name: "Aoife C.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 58,
                        tier: "C",
                        location: "Dublin, IE",
                        skills: ["TypeScript", "React", "Node.js"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "s3",
        name: "Will G.",
        title: "VP Engineering",
        level: "L2 — SVP",
        tscore: 92,
        tier: "A",
        location: "San Francisco, CA",
        skills: ["Infrastructure", "Reliability", "Payments"],
        sources: ["github", "linkedin"],
        yoe: 14,
        children: [
          {
            id: "s6",
            name: "Olivia P.",
            title: "VP Payments",
            level: "L2 — VP",
            tscore: 89,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["Java", "Payments", "Compliance"],
            sources: ["github", "linkedin"],
            yoe: 12,
            children: [
              {
                id: "s10",
                name: "Jake M.",
                title: "Dir Payments Eng",
                level: "L3 — Director",
                tscore: 85,
                tier: "B",
                location: "Seattle, WA",
                skills: ["Go", "PostgreSQL", "PCI"],
                sources: ["github"],
                yoe: 9,
                children: [
                  {
                    id: "s15",
                    name: "Lily H.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 81,
                    tier: "B",
                    location: "San Francisco, CA",
                    skills: ["Ruby", "Sidekiq", "DynamoDB"],
                    sources: ["github"],
                    yoe: 7,
                    children: [
                      {
                        id: "s20",
                        name: "Marco V.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 61,
                        tier: "C",
                        location: "San Francisco, CA",
                        skills: ["Ruby", "Redis", "PostgreSQL"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "s7",
            name: "Ian W.",
            title: "VP Infra",
            level: "L2 — VP",
            tscore: 88,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["AWS", "Terraform", "Kubernetes"],
            sources: ["github", "linkedin"],
            yoe: 13,
            children: [
              {
                id: "s11",
                name: "Tara D.",
                title: "Dir SRE",
                level: "L3 — Director",
                tscore: 84,
                tier: "B",
                location: "NYC, NY",
                skills: ["Go", "Prometheus", "Envoy"],
                sources: ["github"],
                yoe: 10,
                children: [
                  {
                    id: "s16",
                    name: "Finn O.",
                    title: "Staff SRE",
                    level: "L3 — Staff Engineer",
                    tscore: 80,
                    tier: "B",
                    location: "Dublin, IE",
                    skills: ["Python", "Docker", "Datadog"],
                    sources: ["github"],
                    yoe: 6,
                    children: [
                      {
                        id: "s21",
                        name: "Rory M.",
                        title: "SRE",
                        level: "L5 — Engineer",
                        tscore: 57,
                        tier: "C",
                        location: "Dublin, IE",
                        skills: ["Bash", "Docker", "Linux"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                  {
                    id: "s17",
                    name: "Ava C.",
                    title: "Senior SRE",
                    level: "L4 — Senior Engineer",
                    tscore: 75,
                    tier: "C",
                    location: "Singapore",
                    skills: ["Bash", "Ansible", "AWS"],
                    sources: ["github"],
                    yoe: 4,
                    children: [
                      {
                        id: "s22",
                        name: "Wei T.",
                        title: "SRE",
                        level: "L5 — Engineer",
                        tscore: 54,
                        tier: "C",
                        location: "Singapore",
                        skills: ["Python", "AWS", "Terraform"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  OpenAI: {
    id: "o1",
    name: "Sam A.",
    title: "CEO",
    level: "L1 — Executive",
    tscore: 96,
    tier: "A",
    location: "San Francisco, CA",
    skills: ["Strategy", "AI Safety", "Product"],
    sources: ["linkedin"],
    yoe: 17,
    children: [
      {
        id: "o2",
        name: "Mira M.",
        title: "CTO",
        level: "L2 — SVP",
        tscore: 95,
        tier: "A",
        location: "San Francisco, CA",
        skills: ["ML Systems", "Scaling", "Research"],
        sources: ["github", "linkedin", "huggingface"],
        yoe: 16,
        children: [
          {
            id: "o5",
            name: "Ilya S.",
            title: "VP Research",
            level: "L2 — VP",
            tscore: 97,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["Deep Learning", "NLP", "Alignment"],
            sources: ["github", "huggingface"],
            yoe: 15,
            children: [
              {
                id: "o9",
                name: "Liam T.",
                title: "Dir Research",
                level: "L3 — Director",
                tscore: 90,
                tier: "A",
                location: "San Francisco, CA",
                skills: ["Python", "JAX", "RLHF"],
                sources: ["github", "huggingface"],
                yoe: 11,
                children: [
                  {
                    id: "o13",
                    name: "Sophie L.",
                    title: "Staff Researcher",
                    level: "L3 — Staff Engineer",
                    tscore: 87,
                    tier: "A",
                    location: "San Francisco, CA",
                    skills: ["PyTorch", "Transformers", "CUDA"],
                    sources: ["github", "huggingface"],
                    yoe: 7,
                    children: [
                      {
                        id: "o18",
                        name: "Kai N.",
                        title: "Researcher",
                        level: "L5 — Engineer",
                        tscore: 67,
                        tier: "C",
                        location: "San Francisco, CA",
                        skills: ["Python", "PyTorch", "Weights&Biases"],
                        sources: ["github", "huggingface"],
                        yoe: 2,
                      },
                    ],
                  },
                  {
                    id: "o14",
                    name: "Wei C.",
                    title: "Senior Researcher",
                    level: "L4 — Senior Engineer",
                    tscore: 83,
                    tier: "B",
                    location: "NYC, NY",
                    skills: ["Python", "TensorFlow", "TPU"],
                    sources: ["github", "huggingface"],
                    yoe: 5,
                    children: [
                      {
                        id: "o19",
                        name: "Mila S.",
                        title: "Researcher",
                        level: "L5 — Engineer",
                        tscore: 63,
                        tier: "C",
                        location: "NYC, NY",
                        skills: ["Python", "NumPy", "HuggingFace"],
                        sources: ["github", "huggingface"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "o6",
            name: "Mark C.",
            title: "VP Eng",
            level: "L2 — VP",
            tscore: 91,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["Infra", "Kubernetes", "Scaling"],
            sources: ["github", "linkedin"],
            yoe: 14,
            children: [
              {
                id: "o10",
                name: "Ravi P.",
                title: "Dir Platform",
                level: "L3 — Director",
                tscore: 88,
                tier: "A",
                location: "San Francisco, CA",
                skills: ["Go", "Ray", "Azure"],
                sources: ["github", "linkedin"],
                yoe: 10,
                children: [
                  {
                    id: "o15",
                    name: "Ana G.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 84,
                    tier: "B",
                    location: "Seattle, WA",
                    skills: ["Rust", "CUDA", "Triton"],
                    sources: ["github"],
                    yoe: 7,
                    children: [
                      {
                        id: "o20",
                        name: "Oscar H.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 62,
                        tier: "C",
                        location: "Seattle, WA",
                        skills: ["Go", "Docker", "Kubernetes"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "o3",
        name: "Brad L.",
        title: "VP Product",
        level: "L2 — SVP",
        tscore: 92,
        tier: "A",
        location: "San Francisco, CA",
        skills: ["ChatGPT", "API", "Product"],
        sources: ["linkedin"],
        yoe: 15,
        children: [
          {
            id: "o7",
            name: "Ella N.",
            title: "VP Product Eng",
            level: "L2 — VP",
            tscore: 89,
            tier: "A",
            location: "San Francisco, CA",
            skills: ["TypeScript", "React", "Next.js"],
            sources: ["github", "linkedin"],
            yoe: 12,
            children: [
              {
                id: "o11",
                name: "Derek F.",
                title: "Dir Product Eng",
                level: "L3 — Director",
                tscore: 86,
                tier: "B",
                location: "NYC, NY",
                skills: ["TypeScript", "Python", "Tailwind"],
                sources: ["github"],
                yoe: 9,
                children: [
                  {
                    id: "o16",
                    name: "Yara M.",
                    title: "Staff Engineer",
                    level: "L3 — Staff Engineer",
                    tscore: 82,
                    tier: "B",
                    location: "San Francisco, CA",
                    skills: ["React", "Node.js", "PostgreSQL"],
                    sources: ["github"],
                    yoe: 6,
                    children: [
                      {
                        id: "o21",
                        name: "Jade L.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 59,
                        tier: "C",
                        location: "San Francisco, CA",
                        skills: ["React", "TypeScript", "Tailwind"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                  {
                    id: "o17",
                    name: "Kian J.",
                    title: "Senior Engineer",
                    level: "L4 — Senior Engineer",
                    tscore: 77,
                    tier: "B",
                    location: "London, UK",
                    skills: ["TypeScript", "React", "Redis"],
                    sources: ["github"],
                    yoe: 4,
                    children: [
                      {
                        id: "o22",
                        name: "Amir D.",
                        title: "Engineer",
                        level: "L5 — Engineer",
                        tscore: 56,
                        tier: "C",
                        location: "London, UK",
                        skills: ["JavaScript", "Node.js", "Express"],
                        sources: ["github"],
                        yoe: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const companies = Object.keys(orgData);

const sourceIcons: Record<string, React.ReactNode> = {
  github: <IconBrandGithub className="h-4 w-4" />,
  linkedin: <IconBrandLinkedin className="h-4 w-4" />,
  huggingface: <IconRobot className="h-4 w-4" />,
};

const tierColors: Record<string, string> = {
  A: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  B: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  C: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

function collectLevelsAtDepth(
  node: OrgNode,
  targetLevel: string,
  results: string[] = []
): string[] {
  if (node.level === targetLevel) results.push(node.id);
  if (node.children) {
    for (const child of node.children) {
      collectLevelsAtDepth(child, targetLevel, results);
    }
  }
  return results;
}

// ── Animated cursor + recruiter badge that floats around the tree ──
function FloatingRecruiterCursor({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ x: 120, y: 80 });

  // Animate cursor to random positions within the tree
  useState(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(rect.width - 160, 200);
      const maxY = Math.max(rect.height - 80, 100);
      setPos({
        x: 80 + Math.random() * (maxX - 80),
        y: 40 + Math.random() * (maxY - 40),
      });
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-md"
      >
        <path
          d="M5 3L19 12L12 13L9 20L5 3Z"
          fill="#16a34a"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* Recruiter badge */}
      <div className="ml-4 mt-1 flex items-center gap-2 rounded-full border border-green-200 bg-white px-2.5 py-1 shadow-lg dark:border-green-800 dark:bg-neutral-900">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-[8px] font-bold text-white">
          R
        </div>
        <div className="pr-1">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
            Recruiter
          </p>
          <p className="whitespace-nowrap text-[8px] leading-tight text-neutral-500">
            Viewing profile
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Fixed profile overlay (renders at viewport level so it never clips) ──
function ProfileOverlay({
  node,
  onClose,
}: {
  node: OrgNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-80 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          {/* Header */}
          <div className="relative bg-neutral-900 px-5 py-4 dark:bg-neutral-800">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-md p-0.5 text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-900 ring-2 ring-neutral-600">
                {node.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-white">{node.name}</p>
                <p className="text-xs text-neutral-400">{node.title}</p>
              </div>
              {/* Source icons */}
              <div className="ml-auto flex gap-1.5 text-neutral-400">
                {node.sources.map((s) => (
                  <span key={s} className="[&_svg]:h-4 [&_svg]:w-4">
                    {sourceIcons[s]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* TScore + Tier row */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    TScore
                  </span>
                  <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {node.tscore}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${node.tscore}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full rounded-full bg-green-500"
                  />
                </div>
              </div>
              <span
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-bold",
                  tierColors[node.tier]
                )}
              >
                Tier {node.tier}
              </span>
            </div>

            {/* Info grid */}
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{node.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{node.yoe} years experience</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span>{node.level}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-500">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {node.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Node card ──
function NodeCard({
  node,
  depth = 0,
  selectedId,
  onSelect,
  fitNodeIds,
  candidateName,
}: {
  node: OrgNode;
  depth?: number;
  selectedId: string | null;
  onSelect: (node: OrgNode | null) => void;
  fitNodeIds: string[];
  candidateName: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isFitLevel = fitNodeIds.includes(node.id);

  return (
    <div className="flex flex-col items-center p-1">
      {/* Candidate fit indicator — rendered outside relative container to avoid clipping */}
      {isFitLevel && (
        <div className="flex justify-center pb-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 whitespace-nowrap rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-md"
          >
            <Sparkles className="h-3 w-3" />
            {candidateName} fits here
          </motion.div>
        </div>
      )}

      {/* Node card */}
      <div className="relative">
        <motion.button
          layout
          onClick={(e) => {
            e.stopPropagation();
            onSelect(isSelected ? null : node);
          }}
          className={cn(
            "relative flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-left shadow-sm transition-all dark:border-neutral-700",
            isSelected
              ? "ring-2 ring-neutral-400 bg-neutral-50 dark:bg-neutral-800 dark:ring-neutral-500"
              : "bg-white dark:bg-neutral-900",
            isFitLevel &&
              !isSelected &&
              "border-2 border-green-400",
            "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
          )}
        >
          {/* Avatar */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-bold text-white dark:bg-neutral-200 dark:text-neutral-900">
            {node.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
              {node.name}
            </p>
            <p className="truncate text-[10px] text-neutral-500">
              {node.title}
            </p>
          </div>

          {/* TScore badge */}
          <span className="ml-1 shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {node.tscore}
          </span>

          {/* Expand indicator */}
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-neutral-400 transition-transform",
                expanded && "rotate-180"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            />
          )}
        </motion.button>

        {/* Profile overlay (fixed position — no clipping) */}
        <AnimatePresence>
          {isSelected && (
            <ProfileOverlay
              node={node}
              onClose={() => onSelect(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Vertical connector */}
            <div className="mx-auto h-6 w-px bg-neutral-300 dark:bg-neutral-600" />

            {/* Horizontal connector + children */}
            <div className="relative flex items-start gap-6">
              {node.children!.length > 1 && (
                <div
                  className="absolute top-0 h-px bg-neutral-300 dark:bg-neutral-600"
                  style={{
                    left: `calc(50% / ${node.children!.length})`,
                    right: `calc(50% / ${node.children!.length})`,
                  }}
                />
              )}

              {node.children!.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  {node.children!.length > 1 && (
                    <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-600" />
                  )}
                  <NodeCard
                    node={child}
                    depth={depth + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    fitNodeIds={fitNodeIds}
                    candidateName={candidateName}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ──
export const OrgChart = () => {
  const [activeCompany, setActiveCompany] = useState("Google");
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState(
    candidateProfiles[0]
  );
  const treeRef = useRef<HTMLDivElement>(null);

  const tree = orgData[activeCompany];

  // Find all nodes matching the candidate's fit level
  const fitNodeIds = collectLevelsAtDepth(tree, selectedCandidate.fitLevel);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Explore company org structures</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        See how top companies organize their engineering teams — and where
        candidate profile would fit in.
      </Subheading>

      {/* Company tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {companies.map((company) => (
          <button
            key={company}
            onClick={() => {
              setActiveCompany(company);
              setSelectedNode(null);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCompany === company
                ? "bg-green-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            )}
          >
            {company}
          </button>
        ))}
      </div>

      {/* Candidate selector */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-xs font-medium text-neutral-500">
          Show fit for:
        </span>
        <select
          value={selectedCandidate.name}
          onChange={(e) => {
            const cp = candidateProfiles.find((c) => c.name === e.target.value);
            if (cp) setSelectedCandidate(cp);
          }}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
        >
          {candidateProfiles.map((cp) => (
            <option key={cp.name} value={cp.name}>
              {cp.name} — TScore {cp.tscore}
            </option>
          ))}
        </select>
        <span
          className={cn(
            "rounded px-2 py-0.5 text-xs font-bold",
            tierColors[selectedCandidate.tier]
          )}
        >
          {selectedCandidate.fitLevel}
        </span>
      </div>

      {/* Org tree */}
      <motion.div
        key={activeCompany}
        ref={treeRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mt-10 overflow-x-auto"
        onClick={() => setSelectedNode(null)}
      >
        {/* Floating recruiter cursor */}
        <FloatingRecruiterCursor containerRef={treeRef} />

        <div className="flex min-w-[700px] justify-center pb-4 px-6">
          <NodeCard
            node={tree}
            selectedId={selectedNode?.id ?? null}
            onSelect={setSelectedNode}
            fitNodeIds={fitNodeIds}
            candidateName={selectedCandidate.name.split(" (")[0]}
          />
        </div>
      </motion.div>
    </div>
  );
};
