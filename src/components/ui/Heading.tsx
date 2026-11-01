import React from "react";
import { cn } from "@/lib/utils";

export type HeadingLevel = "hero" | "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  kicker?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Heading({
  level = "h2",
  tag,
  kicker,
  subtitle,
  children,
  className,
  ...props
}: HeadingProps) {
  const Component = tag || (level === "hero" ? "h1" : level);

  const levelStyles: Record<HeadingLevel, string> = {
    hero: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight",
    h1: "text-5xl sm:text-6xl md:text-7xl leading-[0.92] tracking-tight",
    h2: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight",
    h3: "text-2xl sm:text-3xl md:text-4xl leading-tight tracking-normal",
    h4: "text-xl sm:text-2xl leading-snug tracking-normal",
  };

  return (
    <div className="flex flex-col gap-2">
      {kicker && (
        <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#FF7135] font-semibold flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[#FF7135] inline-block" />
          {kicker}
        </span>
      )}
      <Component
        className={cn(
          "font-display uppercase text-[#F8F7F2]",
          levelStyles[level],
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {subtitle && (
        <p className="font-body text-base sm:text-lg text-[#EDE5D5]/80 font-normal max-w-2xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
