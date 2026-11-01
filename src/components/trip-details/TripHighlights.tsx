"use client";

import React from "react";
import { Mountain, Tent, Flame, Waves, Compass, Utensils, Camera, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TripHighlight } from "@/data/trips";

interface TripHighlightsProps {
  highlights: TripHighlight[];
}

const iconMap: Record<string, React.ElementType> = {
  Mountain,
  Tent,
  Flame,
  Waves,
  Compass,
  Utensils,
  Camera,
  Sparkles,
};

export default function TripHighlights({ highlights }: TripHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="relative py-10 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-[2px] bg-[#D4F938]" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          KEY MOMENTS & SIGNATURE MEMORIES
        </span>
      </div>

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none mb-6">
        THE <span className="text-[#D4F938]">EXPERIENCE</span>
      </h2>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item, idx) => {
          const Icon = iconMap[item.iconName] || Sparkles;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="relative p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-[#D4F938]/60 transition-all duration-300 backdrop-blur-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#183D32]/80 border border-[#245547] text-[#D4F938] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-heading font-bold text-xl uppercase text-white group-hover:text-[#D4F938] transition-colors mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>0{idx + 1} // SIGNATURE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4F938] opacity-60 group-hover:opacity-100" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
