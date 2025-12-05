"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  shimmerColor?: string;
  className?: string;
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(
  (
    {
      children,
      className,
      shimmerColor = "rgba(255, 255, 255, 0.2)",
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
        className={cn(
          "group relative overflow-hidden rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25",
          className
        )}
      >
        {/* Shimmer effect */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "linear",
            repeatDelay: 1,
          }}
          className="absolute inset-0 z-0 h-full w-full -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>

        {/* Border Glow for extra premium feel */}
        <div className="absolute inset-0 rounded-full border border-white/20" />
      </motion.button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";
