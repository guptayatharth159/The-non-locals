"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Compass } from "lucide-react";
import { BRAND, NAV_ITEMS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import MobileNav from "@/components/navigation/MobileNav";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Top Field Broadcast Bar */}
        <div className="hidden lg:flex items-center justify-between px-6 lg:px-12 py-2 bg-[#0E241E] border-b border-[#245547]/60 text-xs font-mono text-[#EDE5D5]/80 select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#FF7135]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7135] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7135]" />
              </span>
              FIELD LIVE
            </span>
            <span className="text-[#EDE5D5]/50">|</span>
            <span>BASECAMP: {BRAND.baseCampCoordinates}</span>
            <span className="text-[#EDE5D5]/50">|</span>
            <span className="text-[#A3A879]">ELEVATION 2,050M</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-[#EDE5D5]/70">
              COLLEGE STUDENT BATCHES: <strong className="text-[#EDE5D5]">NOW BOOKING FALL 2026</strong>
            </span>
            <span className="text-[#FF7135] flex items-center gap-1">
              CAMPFIRE VERIFIED <Compass className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={cn(
            "transition-all duration-300 px-4 sm:px-6 lg:px-12 py-4 sm:py-5 border-b",
            isScrolled
              ? "bg-[#151916]/90 backdrop-blur-md border-[#EDE5D5]/15 py-3 sm:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              : "bg-gradient-to-b from-[#151916]/80 via-[#151916]/30 to-transparent border-transparent"
          )}
        >
          <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4">
            {/* Brand Logo & Tagline */}
            <Link href="/" className="group flex items-center gap-3 select-none cursor-pointer">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#D4F938]/30 flex items-center justify-center bg-[#151916] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(212,249,56,0.2)] shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="THE NON LOCALS Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wider text-[#F8F7F2] group-hover:text-[#FF7135] transition-colors leading-none">
                  {BRAND.name}
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] lg:text-[10px] text-[#A3A879] tracking-[0.22em] uppercase mt-1">
                  {BRAND.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative font-display tracking-widest text-sm text-[#EDE5D5]/90 hover:text-[#FF7135] transition-colors py-1 uppercase flex items-center gap-2"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FF7135]/20 text-[#FF7135] border border-[#FF7135]/40 leading-none">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF7135] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right: CTA + Mobile Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="primary"
                size="md"
                href="/adventures"
                withArrow
                magnetic
                className="hidden sm:inline-flex"
              >
                EXPLORE TRIPS
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 sm:p-3 bg-[#1E2420] border border-[#EDE5D5]/20 text-[#EDE5D5] hover:text-[#FF7135] hover:border-[#FF7135] transition-colors cursor-pointer lg:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
