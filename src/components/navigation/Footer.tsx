"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Compass, Shield, Mountain, Mail, CheckCircle2, GraduationCap } from "lucide-react";
import { BRAND, NAV_ITEMS, CONFIRMED_DESTINATIONS } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-[#0b0e0c] text-[#EDE5D5] border-t border-white/15 pt-16 sm:pt-20 pb-12 overflow-hidden select-none">
      <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Newsletter & Cohort Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 sm:pb-16 border-b border-white/10">
          <div className="lg:col-span-7 space-y-3">
            <span className="font-mono text-xs text-[#D4F938] tracking-[0.25em] uppercase font-semibold flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#D4F938]" />
              BENNETT UNIVERSITY COHORT UPDATES
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#F8F7F2] uppercase tracking-tight leading-tight">
              NOT HERE TO FIT IN. <br />
              <span className="text-[#D4F938]">HERE TO EXPLORE.</span>
            </h2>
            <p className="font-body text-[#EDE5D5]/80 text-sm sm:text-base max-w-xl">
              Get notified when upcoming semester break cohorts, weekend trips, and confirmed seat schedules are announced for Bennett students.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            {subscribed ? (
              <div className="flex items-center gap-3 p-4 bg-[#183D32] border border-[#D4F938]/40 text-[#EDE5D5] rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-[#D4F938]" />
                <span className="font-mono text-xs tracking-wider uppercase text-white">
                  EMAIL REGISTERED. YOU WILL RECEIVE BATCH DROP ALERTS.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR BENNETT / PERSONAL EMAIL"
                  required
                  className="bg-black/60 border border-white/20 rounded-full px-5 py-3 text-sm font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#D4F938] flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,249,56,0.5)] cursor-pointer"
                >
                  <span>JOIN LIST</span>
                </button>
              </form>
            )}
            <span className="font-mono text-[11px] text-white/50 mt-2">
              EXCLUSIVELY FOR BENNETT UNIVERSITY STUDENTS. ZERO SPAM.
            </span>
          </div>
        </div>

        {/* Main Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 sm:py-16 border-b border-white/10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4F938]/30 flex items-center justify-center bg-[#151916] shadow-[0_0_15px_rgba(212,249,56,0.2)] shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="THE NON LOCALS Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                THE NON LOCALS
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-white/75 leading-relaxed">
              An exclusive travel community for Bennett University students who want to explore new places, meet amazing people, and experience something beyond the usual college routine.
            </p>
            <div className="space-y-1.5 font-mono text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Indicative Budget: ₹7,000 – ₹8,000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Western Himalayas, Himachal Pradesh</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[#D4F938]">
                <Mail className="w-3.5 h-3.5" />
                <span>{BRAND.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Confirmed Destinations */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
              CONFIRMED DESTINATIONS
            </h3>
            <ul className="space-y-2.5 font-mono text-xs uppercase text-white/80">
              {CONFIRMED_DESTINATIONS.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/trips/${dest.slug}`}
                    className="hover:text-[#D4F938] transition-colors flex items-center justify-between group"
                  >
                    <span>{dest.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4F938]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
              COMMUNITY NAVIGATION
            </h3>
            <ul className="space-y-2.5 font-mono text-xs uppercase text-white/80">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#D4F938] transition-colors flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#why-us"
                  className="hover:text-[#D4F938] transition-colors text-[#D4F938]"
                >
                  SOLO TRAVELERS WELCOME
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Standards */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
              OUR STANDARDS
            </h3>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4F938]">
                <Shield className="w-4 h-4" />
                <span className="font-bold">FEMALE SAFETY FIRST</span>
              </div>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Thoughtful planning, verified stays, comfortable transportation, and reliable student support on every journey.
              </p>
            </div>
            <div className="font-mono text-[11px] text-white/40">
              *All itineraries, dates, and prices shown are sample data until final cohort schedules are published.
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div className="pt-10 pb-4 text-center overflow-hidden">
          <span className="block font-heading font-black text-4xl sm:text-6xl md:text-8xl lg:text-[10vw] tracking-wider text-white/5 uppercase select-none leading-none">
            {BRAND.name}
          </span>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono text-white/50">
          <span>
            © {new Date().getFullYear()} {BRAND.name}. FOR BENNETT UNIVERSITY STUDENTS.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/adventures" className="hover:text-[#D4F938] transition-colors">
              CONFIRMED TRIPS
            </Link>
            <Link href="/#standards" className="hover:text-[#D4F938] transition-colors">
              STANDARDS
            </Link>
            <Link href="/#about" className="hover:text-[#D4F938] transition-colors">
              ABOUT US
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
