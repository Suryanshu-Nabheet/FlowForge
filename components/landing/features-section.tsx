"use client";

import { FeatureCard } from "@/components/feature-card";
import {
  Zap,
  Cpu,
  Gauge,
  Globe,
  Workflow,
  Lock,
  Boxes,
  Sparkles,
} from "lucide-react";

// Feature data
const features = [
  {
    title: "Visual Workflow Editor",
    description:
      "Drag-and-drop interface designed for speed. Create complex logic flows without writing a single line of boilerplate code.",
    icon: Workflow,
  },
  {
    title: "AI-Powered Nodes",
    description:
      "Integrate LLMs directly into your flow. Process text, generate content, and analyze data with a single node.",
    icon: Sparkles,
  },
  {
    title: "Real-time Execution",
    description:
      "Watch your workflows run in real-time. Debug with live logs and instant feedback directly in the canvas.",
    icon: Zap,
  },
  {
    title: "Global Edge Network",
    description:
      "Deploy your workflows to the edge in seconds. Low latency execution from anywhere in the world.",
    icon: Globe,
  },
  {
    title: "Secure by Default",
    description:
      "Enterprise-grade security with encrypted variables and local execution options for sensitive data.",
    icon: Lock,
  },
  {
    title: "Infinite Extensibility",
    description:
      "Connect to any API, database, or service. If a node doesn't exist, generate it with AI.",
    icon: Boxes,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Everything you need.
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete suite of tools to help you automate, integrate, and
            deploy your ideas into reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={feature}
              className="border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
