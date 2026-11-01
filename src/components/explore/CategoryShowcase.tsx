"use client";

import React from "react";
import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES_DATA } from "@/data/trips";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryShowcase({
  selectedCategory,
  onSelectCategory,
}: CategoryShowcaseProps) {
  const hasActiveCategory = selectedCategory !== "All";

  return (
    <section className="relative py-12 sm:py-16 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#D4F938]" />
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-[#D4F938] font-semibold">
                WAYPOINTS & EXPEDITION MODES
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-none">
              BROWSE BY <span className="text-[#D4F938]">CATEGORY</span>
            </h2>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-sm sm:text-base text-white/70 max-w-md sm:text-right">
              Filter upcoming journeys by your exploration style. Tap any category to view curated departures.
            </p>

            {/* Active Category Indicator & Reset Pill */}
            <AnimatePresence>
              {hasActiveCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-[#D4F938] flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183D32] border border-[#245547]">
                    <Check className="w-3.5 h-3.5" />
                    Filtering by: <strong>{selectedCategory}</strong>
                  </span>
                  <button
                    onClick={() => onSelectCategory("All")}
                    className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Asymmetrical Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  onSelectCategory(isSelected ? "All" : cat.name);
                }}
                className={`group relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-xl ${
                  isSelected
                    ? "border-[#D4F938] shadow-[0_0_30px_rgba(212,249,56,0.45)] ring-2 ring-[#D4F938] scale-[1.02]"
                    : "border-white/15 hover:border-white/40"
                }`}
              >
                {/* Background Image with Fallback */}
                <ImageWithFallback
                  src={cat.image}
                  fallbackSrc="/images/hero-camp.jpg"
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover object-center filter contrast-[1.08] brightness-[0.85] transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Gradient Vignette */}
                <div
                  className={`absolute inset-0 transition-colors ${
                    isSelected
                      ? "bg-gradient-to-t from-black/95 via-black/45 to-[#183D32]/40"
                      : "bg-gradient-to-t from-black/90 via-black/35 to-black/20 group-hover:from-black/95"
                  }`}
                />

                {/* Top Badge Count & Selection State */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors ${
                      isSelected
                        ? "bg-[#D4F938] text-black font-bold shadow-[0_0_10px_rgba(212,249,56,0.6)]"
                        : "bg-black/60 backdrop-blur-md border border-white/20 text-[#D4F938]"
                    }`}
                  >
                    {isSelected ? "ACTIVE FILTER" : `${cat.count} TRIPS`}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#D4F938] text-black font-bold rotate-45"
                        : "bg-black/50 text-white/80 group-hover:bg-[#D4F938] group-hover:text-black"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                  <h3
                    className={`font-heading font-bold text-lg sm:text-xl tracking-tight uppercase leading-snug transition-colors ${
                      isSelected ? "text-[#D4F938]" : "text-white group-hover:text-[#D4F938]"
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
