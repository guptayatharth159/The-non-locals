"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Users, Clock, CheckCircle2, Flame, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { FEATURED_TRIP } from "@/data/trips";

export default function FeaturedTrip() {
  const shouldReduceMotion = useReducedMotion();
  const trip = FEATURED_TRIP;

  return (
    <section className="relative py-12 sm:py-16 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-6 h-[2px] bg-[#D4F938]" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            FEATURED STUDENT EXPEDITION
          </span>
        </div>

        {/* Split Card Container */}
        <div className="relative rounded-3xl lg:rounded-[36px] bg-black/60 backdrop-blur-2xl border border-white/20 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.6)] grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: Adventure Photograph */}
          <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden bg-black/50 group">
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.04, 1],
                    }
              }
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full"
            >
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center filter contrast-[1.08] brightness-[0.95] transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2.5 z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#D4F938] text-black font-heading font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,249,56,0.4)]">
                CONFIRMED DESTINATION
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-xs uppercase tracking-wider">
                {trip.category}
              </span>
            </div>

            {/* Bottom Photo Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

            {/* University Tag */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#D4F938] font-mono text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>BENNETT UNIVERSITY EXCLUSIVE COHORT</span>
            </div>
          </div>

          {/* RIGHT: Trip Information */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-white/70">
                <MapPin className="w-4 h-4 text-[#D4F938] shrink-0" />
                <span>{trip.destination}</span>
              </div>

              {/* Title */}
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-none">
                {trip.title}
              </h2>

              {/* Description */}
              <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed">
                {trip.description}
              </p>

              {/* Highlights List */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                {trip.highlights.slice(0, 4).map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#D4F938] shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4F938]" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4F938]" />
                <span>{trip.departureDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4F938]" />
                <span className="text-[#D4F938] font-bold">14–18 STUDENT COHORT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
                <span>DIFFICULTY: {trip.difficulty.toUpperCase()}</span>
              </div>
            </div>

            {/* Pricing & Action */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
              <div>
                <span className="block font-mono text-[10px] text-[#D4F938] uppercase tracking-widest font-semibold">
                  INDICATIVE STUDENT BUDGET
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    ₹{trip.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-white/70">/ PERSON</span>
                </div>
                <span className="block font-mono text-[10px] text-white/50 pt-0.5">
                  *Sample schedule & pricing. Final details announced on cohort channels.
                </span>
              </div>

              <Link
                href={`/trips/${trip.slug}`}
                className="group inline-flex items-center gap-3 pl-6 pr-2.5 py-3 bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,249,56,0.6)] active:scale-[0.98]"
              >
                <span>View Details</span>
                <span className="w-8 h-8 rounded-full bg-black text-[#D4F938] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
