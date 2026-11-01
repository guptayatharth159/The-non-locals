"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Clock, Gauge, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Trip } from "@/data/trips";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface TripHeroProps {
  trip: Trip;
}

export default function TripHero({ trip }: TripHeroProps) {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] flex items-end pb-12 sm:pb-16 pt-32 overflow-hidden select-none">
      {/* Background Image with Zoom Animation */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <ImageWithFallback
            src={trip.image}
            fallbackSrc="/images/hero-camp.jpg"
            alt={trip.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter contrast-[1.08] brightness-[0.72]"
          />
        </motion.div>

        {/* Multi-layered Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d0b] via-[#0a0d0b]/50 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d0b]/80 via-transparent to-[#0a0d0b]/80 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-xs text-white/60 uppercase tracking-widest mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-[#D4F938] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <Link href="/adventures" className="hover:text-[#D4F938] transition-colors">
            Adventures
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[#D4F938] truncate max-w-[200px] sm:max-w-none">
            {trip.title}
          </span>
        </motion.nav>

        {/* Category & Cohort Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#183D32]/90 border border-[#245547] text-[#D4F938] font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Compass className="w-3.5 h-3.5" />
            {trip.category}
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 text-[#D4F938] font-mono text-xs backdrop-blur-md">
            <span>CURATED SMALL GROUP COHORT</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 font-mono text-xs backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#D4F938]" />
            {trip.duration}
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 font-mono text-xs backdrop-blur-md">
            <Gauge className="w-3.5 h-3.5 text-[#D4F938]" />
            {trip.difficulty}
          </span>
        </motion.div>

        {/* Expressive Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white tracking-tight leading-[0.92] max-w-5xl"
        >
          {trip.title}
        </motion.h1>

        {/* Destination & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl"
        >
          <div className="flex items-center gap-2 text-white/80 font-mono text-sm sm:text-base">
            <MapPin className="w-4 h-4 text-[#D4F938] shrink-0" />
            <span className="font-semibold text-white tracking-wide">{trip.destination}</span>
          </div>

          <p className="font-body text-sm sm:text-base text-white/75 max-w-xl italic leading-relaxed border-l-2 border-[#D4F938] pl-4">
            &ldquo;{trip.tagline}&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
