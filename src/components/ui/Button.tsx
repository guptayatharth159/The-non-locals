"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/animation/Magnetic";

export type ButtonVariant = "primary" | "forest" | "outline" | "ghost" | "sand";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isExternal?: boolean;
  withArrow?: boolean;
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  isExternal = false,
  withArrow = false,
  magnetic = false,
  icon,
  iconPosition = "right",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-display uppercase tracking-widest font-bold transition-all duration-300 select-none cursor-pointer group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-2 h-9",
    md: "text-sm px-6 py-3 gap-2.5 h-11",
    lg: "text-base px-8 py-4 gap-3 h-14",
    xl: "text-lg px-10 py-5 gap-3.5 h-16",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#FF7135] text-[#151916] hover:bg-[#E85D22] hover:shadow-[0_8px_25px_rgba(255,113,53,0.35)] shadow-[0_4px_14px_rgba(255,113,53,0.2)] border border-[#FF7135]",
    forest:
      "bg-[#183D32] text-[#EDE5D5] hover:bg-[#0E241E] border border-[#245547] hover:border-[#A3A879]",
    outline:
      "bg-transparent text-[#EDE5D5] border border-[#EDE5D5]/30 hover:border-[#FF7135] hover:text-[#FF7135] hover:bg-[#FF7135]/5",
    ghost:
      "bg-transparent text-[#EDE5D5] hover:text-[#FF7135] px-2 py-1 border-b border-transparent hover:border-[#FF7135] rounded-none",
    sand:
      "bg-[#EDE5D5] text-[#151916] hover:bg-[#F8F7F2] border border-[#EDE5D5] hover:shadow-[0_6px_20px_rgba(237,229,213,0.2)]",
  }[variant];

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current"
          strokeWidth={2.5}
        />
      )}
      {icon && iconPosition === "right" && !withArrow && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  const buttonClasses = cn(baseStyles, sizeStyles, variantStyles, className);

  const renderedButton = href ? (
    isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        {content}
      </a>
    ) : (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    )
  ) : (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );

  if (magnetic && !disabled) {
    return <Magnetic strength={0.3}>{renderedButton}</Magnetic>;
  }

  return renderedButton;
}
