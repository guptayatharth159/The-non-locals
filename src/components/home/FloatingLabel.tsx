"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingLabelProps {
  label: string;
  className?: string;
  delay?: number;
  indicatorPosition?: "left" | "right";
  floatDelay?: number;
  parallaxOffset?: { x: number; y: number };
  href?: string;
}

export default function FloatingLabel({
  label,
  className,
  delay = 0.5,
  indicatorPosition = "right",
  floatDelay = 0,
  parallaxOffset = { x: 0, y: 0 },
  href = "/adventures",
}: FloatingLabelProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <motion.div
      animate={
        shouldReduceMotion
          ? {}
          : {
              y: [0, -6, 0],
            }
      }
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
      className="group inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 hover:border-[#D4F938]/60 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer"
    >
      {indicatorPosition === "left" && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4F938] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4F938] shadow-[0_0_8px_#D4F938]" />
        </span>
      )}

      <span className="text-white/95 font-medium text-[11px] sm:text-xs tracking-wide whitespace-nowrap">
        {label}
      </span>

      {indicatorPosition === "right" && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4F938] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4F938] shadow-[0_0_8px_#D4F938]" />
        </span>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: shouldReduceMotion ? 0 : parallaxOffset.x,
      }}
      transition={{
        opacity: { duration: 0.7, delay, ease: "easeOut" },
        scale: { duration: 0.7, delay, ease: "easeOut" },
        x: { type: "spring", stiffness: 100, damping: 20 },
      }}
      className={cn("absolute z-20 select-none pointer-events-auto", className)}
    >
      {href ? <Link href={href}>{content}</Link> : content}
    </motion.div>
  );
}
