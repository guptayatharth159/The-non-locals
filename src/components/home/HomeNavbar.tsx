"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/constants";

export default function HomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAdventures = pathname === "/adventures" || pathname === "/explore";

  const NAV_LINKS = [
    { name: "Home", href: "/", active: isHome },
    { name: "Destinations", href: "/adventures", active: isAdventures },
    { name: "Why Us", href: "/#why-us", active: false },
    { name: "Standards", href: "/#standards", active: false },
    { name: "About", href: "/#about", active: false },
  ];

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white group select-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#D4F938]/30 flex items-center justify-center bg-[#151916] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(212,249,56,0.2)]">
            <Image
              src="/images/logo.png"
              alt="THE NON LOCALS Logo"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-heading font-bold text-base sm:text-xl tracking-tight text-white group-hover:text-[#D4F938] transition-colors uppercase whitespace-nowrap">
            {BRAND.name}
          </span>
        </Link>

        {/* Center Desktop Navigation Pill */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 px-5 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                link.active
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.name}
              {link.active && (
                <motion.span
                  layoutId="activePill"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-[#D4F938] rounded-full shadow-[0_0_8px_#D4F938]"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Plan Your Trip Button - Links directly to /adventures */}
          <Link
            href="/adventures"
            className="group inline-flex items-center gap-2 sm:gap-3 pl-3.5 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-semibold text-xs sm:text-sm rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,249,56,0.5)] active:scale-[0.98]"
          >
            <span className="whitespace-nowrap">Plan Your Trip</span>
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4F938]" />
            </span>
          </Link>

          {/* Compact Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 sm:p-2.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white hover:text-[#D4F938] hover:border-[#D4F938]/40 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden mt-3 p-4 sm:p-5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col gap-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center justify-between ${
                  link.active
                    ? "text-[#D4F938] bg-white/5 font-semibold"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.name}</span>
                {link.active && <span className="w-1.5 h-1.5 rounded-full bg-[#D4F938]" />}
              </Link>
            ))}

            <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/adventures"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 bg-[#D4F938] text-black font-heading font-bold text-xs sm:text-sm rounded-full"
              >
                <span>Book Expeditions Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
