"use client";

import { TestimonialsColumn } from "@/components/testimonials-columns";

const testimonials1 = [
  {
    text: "FlowForge has completely transformed how we handle our internal automations. It's intuitive, powerful, and secure.",
    image: "https://avatar.vercel.sh/jenny",
    name: "Jenny Wilson",
    role: "DevOps Engineer",
  },
  {
    text: "The AI nodes are a game changer. I implemented a complex support bot in minutes.",
    image: "https://avatar.vercel.sh/jamie",
    name: "Jamie Rivera",
    role: "Product Manager",
  },
  {
    text: "Being able to export to JSON and version control my workflows is essential for our team.",
    image: "https://avatar.vercel.sh/josh",
    name: "Josh Brown",
    role: "Tech Lead",
  },
];

const testimonials2 = [
  {
    text: "Finally, a low-code tool that doesn't feel like a toy. The local execution mode is brilliant.",
    image: "https://avatar.vercel.sh/alex",
    name: "Alex Morgan",
    role: "Software Architect",
  },
  {
    text: "We replaced 5 different tools with FlowForge. The cost savings and simplicity are unmatched.",
    image: "https://avatar.vercel.sh/sam",
    name: "Sam Chen",
    role: "CTO",
  },
  {
    text: "The global edge network deployment is flawless. Latency is non-existent.",
    image: "https://avatar.vercel.sh/casey",
    name: "Casey Smith",
    role: "Developer",
  },
];

const testimonials3 = [
  {
    text: "I love the open source nature of FlowForge. I can extend it with my own nodes easily.",
    image: "https://avatar.vercel.sh/drew",
    name: "Drew Taylor",
    role: "Frontend Dev",
  },
  {
    text: "The best visual programming environment I've used. Period.",
    image: "https://avatar.vercel.sh/jordan",
    name: "Jordan Lee",
    role: "UX Designer",
  },
  {
    text: "FlowForge allowed us to automate our entire onboarding process without writing a single line of backend code.",
    image: "https://avatar.vercel.sh/morgan",
    name: "Morgan White",
    role: "Operations Manager",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Loved by developers.
          </h2>
          <p className="text-muted-foreground text-lg">
            See what the community has to say about building with FlowForge.
          </p>
        </div>
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] h-[600px]">
          <TestimonialsColumn testimonials={testimonials1} duration={15} />
          <TestimonialsColumn
            testimonials={testimonials2}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={testimonials3}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
