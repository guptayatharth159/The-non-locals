"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Compass, Users, Shield } from "lucide-react";

export default function ExploreHero() {
  return (
    <section className="relative pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden select-none">
      {/* Background Wide Destination Photograph */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-twilight-camp.jpg"
          alt="Wild Himalayan Valley"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e0c] via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/75" />
      </div>

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-white/60 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-[#D4F938] transition-colors flex items-center gap-1">
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[#D4F938] font-semibold">Destinations & Cohorts</span>
        </nav>

        {/* Hero Title & Description */}
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#D4F938] font-mono text-xs tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            CURATED HIMALAYAN EXPEDITIONS // OPEN COHORT TRAVEL
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.98]">
            MORE THAN A TRIP, <br />
            <span className="text-[#D4F938] drop-shadow-[0_0_30px_rgba(212,249,56,0.35)]">
              IT&apos;S AN EXPERIENCE.
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg md:text-xl text-white/85 font-normal leading-relaxed max-w-2xl">
            Curated group expeditions and offbeat Himalayan journeys. Join solo or with friends — experience the mountains beyond the ordinary.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5 text-[#D4F938]">
              <Compass className="w-3.5 h-3.5" />
              Indicative Budget: ₹7,000 – ₹8,000
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              Solo Explorers Welcome
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#D4F938]" />
              Female Safety First
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
