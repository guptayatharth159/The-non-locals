"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Trip, getRelatedTrips } from "@/data/trips";
import TripCard from "@/components/explore/TripCard";

interface TripRelatedProps {
  currentSlug: string;
}

export default function TripRelated({ currentSlug }: TripRelatedProps) {
  const relatedTrips = getRelatedTrips(currentSlug, 3);

  if (relatedTrips.length === 0) return null;

  return (
    <section className="relative py-12 border-t border-white/10 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-[2px] bg-[#D4F938]" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              EXPLORE MORE OF THE WILD FRONTIER
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none">
            RELATED <span className="text-[#D4F938]">EXPEDITIONS</span>
          </h2>
        </div>

        <Link
          href="/adventures"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-[#D4F938] transition-colors"
        >
          <span>VIEW ALL 18+ TRIPS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {relatedTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}
