"use client";

import React from "react";
import { BedDouble, Users, Check, AlertCircle, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TripAccommodation as AccommodationType } from "@/data/trips";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface TripAccommodationProps {
  accommodation: AccommodationType;
}

export default function TripAccommodation({ accommodation }: TripAccommodationProps) {
  if (!accommodation) return null;

  return (
    <section className="relative py-10 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-[2px] bg-[#D4F938]" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" />
          BASECAMP & TRAIL STAYS
        </span>
      </div>

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none mb-6">
        WHERE YOU <span className="text-[#D4F938]">STAY</span>
      </h2>

      {/* Main Accommodation Card */}
      <div className="rounded-3xl bg-black/50 border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left: Content Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D32] border border-[#245547] text-[#D4F938] font-mono text-xs uppercase tracking-wider">
                <BedDouble className="w-3.5 h-3.5" />
                {accommodation.type}
              </span>

              <h3 className="font-heading font-bold text-2xl sm:text-3xl uppercase text-white tracking-tight">
                Authentic & Safe Handpicked Stays
              </h3>

              <p className="font-body text-sm sm:text-base text-white/75 leading-relaxed pt-1">
                {accommodation.description}
              </p>
            </div>

            {/* Room Sharing Details */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#D4F938]/10 text-[#D4F938] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-xs uppercase tracking-wider text-white/50 block">
                  ROOM SHARING CONFIGURATION
                </span>
                <p className="font-heading font-semibold text-sm sm:text-base text-white">
                  {accommodation.roomSharing}
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-white/50 block">
                  INCLUDED STAY AMENITIES:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {accommodation.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-white/90"
                    >
                      <Check className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notes Alert */}
            {accommodation.notes && (
              <div className="p-4 rounded-xl bg-[#151916] border border-[#245547] flex items-center gap-3 text-xs font-mono text-white/70">
                <AlertCircle className="w-4 h-4 text-[#FF7135] shrink-0" />
                <span>{accommodation.notes}</span>
              </div>
            )}
          </div>

          {/* Right: Stay Photograph */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-white/10">
            <ImageWithFallback
              src={accommodation.image || "/images/hero-camp.jpg"}
              fallbackSrc="/images/hero-camp.jpg"
              alt={accommodation.type}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center filter contrast-[1.05] brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                CAMP / COTTAGE VIEW
              </span>
              <span className="text-[#D4F938]">VERIFIED QUALITY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
