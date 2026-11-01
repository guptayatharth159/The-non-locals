import React from "react";
import { cn } from "@/lib/utils";

export type ContainerWidth = "narrow" | "default" | "wide" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  clean?: boolean; // If true, removes horizontal padding
  children: React.ReactNode;
}

export default function Container({
  width = "default",
  clean = false,
  children,
  className,
  ...props
}: ContainerProps) {
  const widthStyles: Record<ContainerWidth, string> = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1536px]",
    full: "w-full max-w-none",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        !clean && "px-4 sm:px-6 md:px-8 lg:px-12",
        widthStyles[width],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
