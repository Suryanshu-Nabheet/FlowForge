import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  const company = [
    {
      title: "About Us",
      href: "#",
    },
    {
      title: "Careers",
      href: "#",
    },
    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
  ];

  const resources = [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Blog",
      href: "#",
    },
    {
      title: "Community",
      href: "#",
    },
    {
      title: "Support",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      link: "https://github.com/flowforge",
    },
    {
      icon: Twitter,
      link: "https://twitter.com/flowforge",
    },
    {
      icon: Linkedin,
      link: "https://linkedin.com/company/flowforge",
    },
  ];

  return (
    <footer className="relative bg-background">
      <div className={cn("mx-auto max-w-5xl lg:border-x border-border/50")}>
        <div className="absolute inset-x-0 h-px w-full bg-border/50" />
        <div className="grid max-w-5xl grid-cols-6 gap-6 p-8 md:p-12">
          <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
            <Link href="/" className="w-fit">
              <Logo />
            </Link>
            <p className="max-w-sm text-balance text-muted-foreground text-sm">
              Build powerful automations visually. Open source, limitless
              possibilities.
            </p>
            <div className="flex gap-2 mt-2">
              {socialLinks.map((item, index) => (
                <Button
                  key={`social-${index}`}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <item.icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-foreground font-medium text-sm">
              Resources
            </span>
            <div className="mt-4 flex flex-col gap-2">
              {resources.map(({ href, title }) => (
                <a
                  className="w-max text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  href={href}
                  key={title}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-foreground font-medium text-sm">Company</span>
            <div className="mt-4 flex flex-col gap-2">
              {company.map(({ href, title }) => (
                <a
                  className="w-max text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  href={href}
                  key={title}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 h-px w-full bg-border/50" />
        <div className="flex max-w-4xl flex-col justify-between gap-2 py-6 px-8 md:px-12">
          <p className="text-center md:text-left font-light text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} FlowForge Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
