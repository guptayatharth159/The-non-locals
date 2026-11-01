import React from "react";
import { cn } from "@/lib/utils";
import { ExpeditionDifficulty } from "@/types";

export type BadgeVariant =
  | "coordinates"
  | "difficulty"
  | "stamp"
  | "elevation"
  | "orange"
  | "forest"
  | "sand"
  | "olive";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  difficulty?: ExpeditionDifficulty;
  pulsing?: boolean;
  children?: React.ReactNode;
}

export default function Badge({
  variant = "stamp",
  difficulty,
  pulsing = false,
  children,
  className,
  ...props
}: BadgeProps) {
  // Difficulty color styles
  const difficultyStyles: Record<ExpeditionDifficulty, string> = {
    Easy: "border-[#D4F938] text-[#D4F938] bg-[#D4F938]/10",
    "Easy-Moderate": "border-[#A3A879] text-[#A3A879] bg-[#A3A879]/10",
    Moderate: "border-[#EDE5D5] text-[#EDE5D5] bg-[#EDE5D5]/10",
    Demanding: "border-[#FF7135] text-[#FF7135] bg-[#FF7135]/10",
    "Expedition Grade": "border-red-500 text-red-400 bg-red-950/40",
  };

  const variantStyles = {
    coordinates:
      "border border-[#EDE5D5]/25 bg-[#151916]/80 text-[#EDE5D5] font-mono tracking-wider text-[11px] px-3 py-1",
    difficulty: difficulty ? difficultyStyles[difficulty] : "border-[#EDE5D5]/40 text-[#EDE5D5]",
    stamp:
      "border border-[#EDE5D5]/30 text-[#EDE5D5] bg-[#1E2420]/60 font-display uppercase tracking-widest text-xs px-3 py-1",
    elevation:
      "border border-[#A3A879]/40 bg-[#183D32]/80 text-[#A3A879] font-mono tracking-wide text-xs px-2.5 py-1",
    orange:
      "border border-[#FF7135]/50 bg-[#FF7135]/15 text-[#FF7135] font-display uppercase tracking-widest text-xs px-3 py-1",
    forest:
      "border border-[#245547] bg-[#183D32] text-[#EDE5D5] font-display uppercase tracking-widest text-xs px-3 py-1",
    sand:
      "border border-[#EDE5D5] bg-[#EDE5D5] text-[#151916] font-display uppercase tracking-widest text-xs px-3 py-1 font-bold",
    olive:
      "border border-[#A3A879]/50 bg-[#A3A879]/15 text-[#A3A879] font-display uppercase tracking-widest text-xs px-3 py-1",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 select-none uppercase font-semibold transition-colors duration-200",
        variantStyles,
        className
      )}
      {...props}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7135] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7135]" />
        </span>
      )}
      {children}
    </span>
  );
}
