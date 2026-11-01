import React from "react";
import { cn } from "@/lib/utils";

export type TextVariant = "lead" | "body" | "small" | "caption" | "mono";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  color?: "offwhite" | "sand" | "muted" | "orange" | "olive";
  children: React.ReactNode;
}

export default function Text({
  variant = "body",
  color = "sand",
  children,
  className,
  ...props
}: TextProps) {
  const variantStyles: Record<TextVariant, string> = {
    lead: "text-lg sm:text-xl font-normal leading-relaxed tracking-normal",
    body: "text-base sm:text-lg font-normal leading-relaxed tracking-normal",
    small: "text-sm sm:text-base font-normal leading-normal",
    caption: "text-xs sm:text-sm font-medium tracking-wide uppercase",
    mono: "font-mono text-xs sm:text-sm tracking-wider uppercase",
  };

  const colorStyles: Record<string, string> = {
    offwhite: "text-[#F8F7F2]",
    sand: "text-[#EDE5D5]/90",
    muted: "text-[#EDE5D5]/65",
    orange: "text-[#FF7135]",
    olive: "text-[#A3A879]",
  };

  return (
    <p
      className={cn(
        "font-body",
        variantStyles[variant],
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
