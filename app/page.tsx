import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FlowForge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#templates"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Templates
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              v1.0 is now live
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-500 pb-2">
              Automate your work, <br /> without the chaos.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Build powerful workflows with our visual node editor. Connect
              APIs, process data, and integrate AI agents in minutes, not days.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold">
              Why choose FlowForge?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Visual Builder",
                  desc: "Drag and drop nodes to create complex workflows with ease.",
                  icon: Zap,
                },
                {
                  title: "AI Integrated",
                  desc: "Built-in AI nodes powered by OpenRouter to process text and data.",
                  icon: Smartphone,
                },
                {
                  title: "Production Ready",
                  desc: "Reliable execution engine with detailed logging and error handling.",
                  icon: CheckCircle,
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/5 bg-card p-8 transition-all hover:bg-card/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feat.title}</h3>
                  <p className="text-muted-foreground">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 FlowForge. Built by Suryanshu Nabheet.</p>
        </div>
      </footer>
    </div>
  );
}
