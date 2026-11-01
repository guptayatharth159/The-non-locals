"use client";

import React from "react";
import { Sparkles, Users, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsPanel() {
  const pillars = [
    {
      icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4F938]" strokeWidth={2.2} />,
      value: "Curated Cohorts",
      label: "14–18 explorers per batch",
      mobileLabel: "14–18 Batch",
    },
    {
      icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4F938]" strokeWidth={2.2} />,
      value: "Solo & Friends",
      label: "Join solo or with your group",
      mobileLabel: "Solo Friendly",
    },
    {
      icon: <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4F938]" strokeWidth={2.2} />,
      value: "₹7K – ₹8K",
      label: "Indicative adventure budget",
      mobileLabel: "₹7K–₹8K",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      className="relative z-20 w-full sm:w-fit select-none"
    >
      <div className="w-full sm:w-auto px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl sm:rounded-full bg-black/55 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        {/* Responsive Grid for mobile, Flex for desktop */}
        <div className="grid grid-cols-3 divide-x divide-white/15 sm:divide-x-0 sm:flex sm:items-center sm:gap-6">
          {pillars.map((pillar, index) => (
            <React.Fragment key={pillar.label}>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-0 text-center sm:text-left">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {pillar.icon}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="font-heading font-bold text-xs sm:text-sm lg:text-base text-white leading-tight whitespace-nowrap">
                    {pillar.value}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] sm:text-[11px] text-white/60 font-medium whitespace-nowrap">
                    {pillar.label}
                  </span>
                  <span className="sm:hidden text-[9px] text-white/60 font-medium whitespace-nowrap">
                    {pillar.mobileLabel}
                  </span>
                </div>
              </div>

              {index < pillars.length - 1 && (
                <div className="hidden sm:block h-7 w-[1px] bg-white/15 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
