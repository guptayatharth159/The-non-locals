"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // If on trip detail pages, raise slightly on mobile to avoid overlapping with the sticky booking bar
  const isTripPage = pathname?.startsWith("/trips/");

  useEffect(() => {
    // Show initial teaser tooltip after 2.5 seconds, then hide after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Approved official WhatsApp line for THE NON LOCALS (+91 7485 888 279)
  const destinationPhone = "917485888279";
  const prefilledMessage =
    "Hi THE NON LOCALS! 🏔️ I have an enquiry about your upcoming Himalayan group expeditions.";
  const whatsappUrl = `https://wa.me/${destinationPhone}?text=${encodeURIComponent(
    prefilledMessage
  )}`;

  const handleOpenWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <aside
      aria-label="WhatsApp quick chat"
      className={`fixed right-4 sm:right-7 z-[9999] select-none flex items-center gap-3 transition-all duration-300 ${
        isTripPage ? "bottom-20 sm:bottom-7" : "bottom-5 sm:bottom-7"
      }`}
      style={{ zIndex: 9999 }}
    >
      {/* Interactive Tooltip (shows on teaser or hover) */}
      <div
        className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0e1411]/95 border border-white/15 text-white shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-300 ${
          showTooltip || isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-2 scale-95 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
            Chat with us
          </span>
          <span className="font-mono text-[10px] text-white/60">
            Usually replies in minutes
          </span>
        </div>
        <div className="w-2 h-2 rotate-45 bg-[#0e1411] border-r border-t border-white/15 -mr-4 -ml-1 shrink-0" />
      </div>

      {/* Floating Button with Ambient Glow & Red Notification Badge */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Halo (matches user screenshot outer ring) */}
        <div
          className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#25D366]/25 pointer-events-none animate-pulse"
          style={{ animationDuration: "3s" }}
        />

        {/* Second Subtle Concentric Aura Ring */}
        <div className="absolute w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#25D366]/10 pointer-events-none" />

        {/* WhatsApp Link Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenWhatsApp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Chat with THE NON LOCALS on WhatsApp (opens in new tab)"
        >
          {/* Official WhatsApp Speech Bubble + Phone Glyph */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8 fill-white transition-transform duration-300 group-hover:rotate-6"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.718.311 1.278.497 1.716.636.721.23 1.377.197 1.895.12.578-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.516 2 2.022 6.49 2.022 12.013c0 1.947.558 3.766 1.527 5.309L2 22l4.829-1.503a9.96 9.96 0 0 0 5.211 1.464l.004-.001c5.52 0 10.014-4.49 10.014-10.013C22.058 6.49 17.564 2 12.04 2zm0 18.273c-1.644 0-3.197-.47-4.526-1.282l-.325-.199-3.327 1.036 1.058-3.243-.217-.341a8.232 8.232 0 0 1-1.266-4.241c0-4.567 3.717-8.283 8.285-8.283 4.567 0 8.283 3.716 8.283 8.283 0 4.568-3.716 8.284-8.284 8.284z" />
          </svg>

          {/* Red Notification Badge "1" (matches user screenshot) */}
          <span
            className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ef4444] border-2 border-[#0b0e0c] text-white font-sans font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg pointer-events-none"
            aria-hidden="true"
          >
            1
          </span>
        </a>
      </div>
    </aside>
  );
}
