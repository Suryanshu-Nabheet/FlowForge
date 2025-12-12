import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type React from "react";

export function LogoIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      <Zap className="h-5 w-5 fill-current" />
    </div>
  );
}

export function Logo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <LogoIcon className="h-6 w-6 rounded-md" />
      <span className="text-lg font-bold tracking-tight">FlowForge</span>
    </div>
  );
}
