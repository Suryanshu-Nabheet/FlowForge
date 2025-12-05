"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-0 right-0 h-[500px] w-full bg-primary/10 blur-[120px] rounded-full mx-auto max-w-4xl -translate-y-1/2" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>The Next Gen of Workflow Automation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            Build faster. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400">
              Scale infinitely.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
          >
            FlowForge reimagines how you build and deploy workflows. Drag, drop,
            and let our AI agents handle the heavy lifting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/dashboard">
              <ShinyButton className="h-14 min-w-[200px] text-lg">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </ShinyButton>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 min-w-[200px] rounded-full border-white/10 bg-white/5 text-lg font-medium backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
            >
              View Documentation
            </Button>
          </motion.div>
        </div>

        {/* Hero Image / Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative rounded-xl border border-white/10 p-2 bg-white/5 backdrop-blur-lg shadow-2xl"
        >
          <div className="rounded-lg overflow-hidden bg-background aspect-video relative border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {/* Place holder for dashboard preview image */}
              <div className="text-center">
                <p>Interactive Workflow Canvas Preview</p>
                <div className="grid grid-cols-3 gap-4 mt-4 opacity-20">
                  <div className="h-24 w-32 bg-primary/20 rounded-md"></div>
                  <div className="h-24 w-32 bg-primary/20 rounded-md"></div>
                  <div className="h-24 w-32 bg-primary/20 rounded-md"></div>
                </div>
              </div>
            </div>
            {/* Abstract UI elements to simulate the app */}
            <div className="absolute top-4 left-4 right-4 h-12 border-b border-border flex items-center px-4 gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 to-purple-500/30 blur-2xl -z-10 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
