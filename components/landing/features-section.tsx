"use client";

import { motion } from "framer-motion";
import { Zap, Cpu, Gauge, Globe, Workflow } from "lucide-react";

const features = [
  {
    title: "Visual Workflow Builder",
    description:
      "Drag-and-drop interface designed for speed. Create complex logic flows without writing a single line of boilerplate code.",
    icon: Workflow,
    className: "md:col-span-2",
  },
  {
    title: "AI-Powered Nodes",
    description:
      "Integrate LLMs directly into your flow. Process text, generate content, and analyze data with a single node.",
    icon: Cpu,
    className: "md:col-span-1",
  },
  {
    title: "Real-time Execution",
    description:
      "Watch your workflows run in real-time. Debug with live logs and instant feedback.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Global Edge Network",
    description:
      "Deploy your workflows to the edge in seconds. Low latency execution from anywhere in the world.",
    icon: Globe,
    className: "md:col-span-2",
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
            Everything you need to build.
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete suite of tools to help you automate, integrate, and
            deploy your ideas into reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-card p-8 hover:bg-card/50 transition-all duration-500 ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative background visual */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
