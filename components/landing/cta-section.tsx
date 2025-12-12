"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusIcon, FileText } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto py-24 px-4 md:px-6">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-4 border-y px-4 py-8 dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)]">
        <PlusIcon
          className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6 text-muted-foreground/50"
          strokeWidth={1}
        />

        <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l border-border/50" />
        <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r border-border/50" />

        <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-border/50" />

        <h2 className="text-center font-bold text-3xl md:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Ready to Automate Your Workflow?
        </h2>
        <p className="text-balance text-center font-medium text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
          Join thousands of developers building complex automations with
          FlowForge. Start building for free completely client-side.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/docs">
            <Button variant="outline" className="h-11 px-6">
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="h-11 px-6 shadow-lg shadow-primary/20">
              Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
