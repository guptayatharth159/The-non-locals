"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";

interface ExploreCTAProps {
  onExploreClick?: () => void;
}

export default function ExploreCTA({ onExploreClick }: ExploreCTAProps) {
  return (
    <section className="relative my-16 sm:my-24 mx-4 sm:mx-6 lg:mx-12 rounded-3xl lg:rounded-[44px] overflow-hidden border border-white/20 select-none shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
      {/* Background Cinematic Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-camp.jpg"
          alt="Campfire Under Mountain Skies"
          fill
          sizes="100vw"
          className="object-cover object-center filter contrast-[1.1] brightness-[0.7] scale-105"
        />
        {/* Deep Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-16 sm:py-24 px-6 sm:px-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#D4F938] font-mono text-xs tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5" />
          CURATED HIMALAYAN EXPEDITIONS // OPEN COHORT TRAVEL
        </div>

        <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-tight leading-[0.96]">
          NOT HERE TO FIT IN. <br />
          <span className="text-[#D4F938] drop-shadow-[0_0_30px_rgba(212,249,56,0.35)]">
            HERE TO EXPLORE.
          </span>
        </h2>

        <p className="font-body text-base sm:text-lg md:text-xl text-white/85 max-w-xl mx-auto leading-relaxed">
          MORE THAN A TRIP, IT&apos;S AN EXPERIENCE. Step outside the ordinary, meet incredible people, and discover the high mountains with fellow explorers.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => {
              if (onExploreClick) {
                onExploreClick();
              } else {
                window.scrollTo({ top: 400, behavior: "smooth" });
              }
            }}
            className="group inline-flex items-center gap-3 pl-6 pr-2.5 py-3.5 bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,249,56,0.6)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>VIEW ALL CONFIRMED DESTINATIONS</span>
            <span className="w-9 h-9 rounded-full bg-black text-[#D4F938] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
