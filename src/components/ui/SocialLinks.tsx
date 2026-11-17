"use client";

import React from "react";
import { SOCIAL_LINKS, SocialLinkItem } from "@/lib/constants";

interface SocialLinksProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  links?: SocialLinkItem[];
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.718.311 1.278.497 1.716.636.721.23 1.377.197 1.895.12.578-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.516 2 2.022 6.49 2.022 12.013c0 1.947.558 3.766 1.527 5.309L2 22l4.829-1.503a9.96 9.96 0 0 0 5.211 1.464l.004-.001c5.52 0 10.014-4.49 10.014-10.013C22.058 6.49 17.564 2 12.04 2zm0 18.273c-1.644 0-3.197-.47-4.526-1.282l-.325-.199-3.327 1.036 1.058-3.243-.217-.341a8.232 8.232 0 0 1-1.266-4.241c0-4.567 3.717-8.283 8.285-8.283 4.567 0 8.283 3.716 8.283 8.283 0 4.568-3.716 8.284-8.284 8.284z" />
    </svg>
  );
}

function GmailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

const BRAND_THEMES = {
  instagram: {
    hoverClass:
      "hover:text-[#E4405F] hover:border-[#E1306C]/70 hover:shadow-[0_0_18px_rgba(225,48,108,0.45)]",
    icon: InstagramIcon,
  },
  facebook: {
    hoverClass:
      "hover:text-[#1877F2] hover:border-[#1877F2]/70 hover:shadow-[0_0_18px_rgba(24,119,242,0.45)]",
    icon: FacebookIcon,
  },
  whatsapp: {
    hoverClass:
      "hover:text-[#25D366] hover:border-[#25D366]/70 hover:shadow-[0_0_18px_rgba(37,211,102,0.45)]",
    icon: WhatsAppIcon,
  },
  gmail: {
    hoverClass:
      "hover:text-[#EA4335] hover:border-[#EA4335]/70 hover:shadow-[0_0_18px_rgba(234,67,53,0.45)]",
    icon: GmailIcon,
  },
};

const SIZE_CLASSES = {
  sm: {
    btn: "w-8 h-8 sm:w-9 sm:h-9",
    icon: "w-4 h-4",
  },
  md: {
    btn: "w-9 h-9 sm:w-10 sm:h-10",
    icon: "w-4 h-4 sm:w-[18px] sm:h-[18px]",
  },
  lg: {
    btn: "w-11 h-11",
    icon: "w-5 h-5",
  },
};

export default function SocialLinks({
  size = "md",
  className = "",
  links = SOCIAL_LINKS,
}: SocialLinksProps) {
  const currentSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      role="list"
      aria-label="Official Social Media Links"
      className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}
    >
      {links.map((link) => {
        const theme = BRAND_THEMES[link.id];
        const IconComponent = theme?.icon;

        return (
          <div key={link.id} role="listitem" className="relative group/social">
            <a
              href={link.url}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              aria-label={link.ariaLabel}
              title={link.name}
              className={`
                relative flex items-center justify-center rounded-full
                bg-white/5 hover:bg-[#183D32]/80
                border border-white/15
                text-white/80
                transition-all duration-300 ease-out
                hover:scale-110 active:scale-95
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4F938]
                cursor-pointer
                ${currentSize.btn}
                ${theme?.hoverClass || "hover:text-[#D4F938] hover:border-[#D4F938]/60"}
              `}
            >
              {IconComponent && <IconComponent className={currentSize.icon} />}
              <span className="sr-only">{link.name}</span>
            </a>

            {/* Hover Tooltip (revealed only on hover/focus - no visible text beside icons) */}
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0c100e] border border-white/20 text-[#F8F7F2] font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap opacity-0 group-hover/social:opacity-100 group-focus-visible/social:opacity-100 -translate-y-1 group-hover/social:translate-y-0 transition-all duration-200 shadow-xl z-30"
            >
              {link.name}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-[#0c100e] border-r border-b border-white/20" />
            </span>
          </div>
        );
      })}
    </div>
  );
}
