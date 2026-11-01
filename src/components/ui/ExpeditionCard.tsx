"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Users, Mountain } from "lucide-react";
import { Expedition } from "@/types";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ExpeditionCardProps {
  expedition: Expedition;
  priority?: boolean;
  className?: string;
}

export default function ExpeditionCard({
  expedition,
  priority = false,
  className,
}: ExpeditionCardProps) {
  const {
    title,
    subtitle,
    region,
    elevation,
    duration,
    groupSize,
    price,
    currency,
    difficulty,
    featuredImage,
    highlightTag,
    coordinates,
    departureDates,
    slug,
  } = expedition;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-[#1E2420] border border-[#EDE5D5]/15 overflow-hidden transition-all duration-500 hover:border-[#FF7135]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0D100E]">
        <Image
          src={featuredImage}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center filter brightness-[0.9] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2420] via-transparent to-black/40" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
          {highlightTag ? (
            <Badge variant="orange">{highlightTag}</Badge>
          ) : (
            <Badge variant="coordinates">{coordinates}</Badge>
          )}
          <Badge variant="difficulty" difficulty={difficulty}>
            {difficulty}
          </Badge>
        </div>

        {/* Elevation Tag (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-mono text-[#A3A879] bg-[#151916]/80 backdrop-blur-sm px-2.5 py-1 border border-[#A3A879]/30">
          <Mountain className="w-3.5 h-3.5 text-[#FF7135]" />
          <span>{elevation}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-[#EDE5D5]/60 uppercase tracking-widest">
            <span>{region}</span>
            <span>{duration}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-[#F8F7F2] uppercase leading-none group-hover:text-[#FF7135] transition-colors duration-200">
            {title}
          </h3>

          <p className="font-body text-sm text-[#EDE5D5]/80 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#EDE5D5]/10 text-xs font-mono text-[#EDE5D5]/70">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#FF7135]" />
            <span>{groupSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#A3A879]" />
            <span>{departureDates[0]} NEXT</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block font-mono text-[10px] text-[#EDE5D5]/50 uppercase tracking-wider">
              ALL-INCLUSIVE GROUP FARE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl sm:text-3xl text-[#F8F7F2]">
                {currency === "INR" ? "₹" : "$"}
                {price.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-[#EDE5D5]/60">/ EXPLORER</span>
            </div>
          </div>

          <Link
            href={`/#expedition-${slug}`}
            className="inline-flex items-center justify-center w-11 h-11 bg-[#151916] border border-[#EDE5D5]/25 text-[#EDE5D5] transition-all duration-300 group-hover:bg-[#FF7135] group-hover:text-[#151916] group-hover:border-[#FF7135] group-hover:scale-105"
            aria-label={`View details for ${title}`}
          >
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
