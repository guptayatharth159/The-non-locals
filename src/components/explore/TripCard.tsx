"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Calendar, Clock, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Trip } from "@/data/trips";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface TripCardProps {
  trip: Trip;
  priority?: boolean;
}

export default function TripCard({ trip, priority = false }: TripCardProps) {
  const {
    title,
    destination,
    duration,
    departureDate,
    price,
    category,
    image,
    slug,
  } = trip;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-3xl bg-black/60 hover:bg-black/75 backdrop-blur-xl border border-white/15 hover:border-[#D4F938]/60 overflow-hidden transition-all duration-400 shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
    >
      {/* Top Image Container with ImageWithFallback */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/50">
        <ImageWithFallback
          src={image}
          fallbackSrc="/images/hero-camp.jpg"
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center filter contrast-[1.06] brightness-[0.92] transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Filmic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono font-medium text-white tracking-wider uppercase">
            {category}
          </span>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono font-semibold text-[10px] uppercase tracking-wider">
            <Compass className="w-3 h-3" />
            CURATED COHORT
          </span>
        </div>

        {/* Sample Status Tag */}
        <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4F938]" />
          <span>SAMPLE ITINERARY</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-5">
        <div className="space-y-2">
          {/* Destination */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/70">
            <MapPin className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
            <span className="truncate">{destination}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight uppercase group-hover:text-[#D4F938] transition-colors leading-snug line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-white/10 text-xs font-mono text-white/70">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#D4F938]" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#D4F938]" />
            <span className="truncate">{departureDate}</span>
          </div>
        </div>

        {/* Price & CTA Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block font-mono text-[10px] text-[#D4F938] uppercase tracking-wider font-semibold">
              INDICATIVE FARE
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-extrabold text-2xl text-white">
                ₹{price.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-white/60">/ person</span>
            </div>
          </div>

          <Link
            href={`/trips/${slug}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 group-hover:bg-[#D4F938] border border-white/20 group-hover:border-[#D4F938] text-white group-hover:text-black font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
