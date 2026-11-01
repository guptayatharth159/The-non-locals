"use client";

import React from "react";
import {
  Shield,
  CalendarCheck,
  Home,
  Sparkles,
  Bus,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { OUR_NON_NEGOTIABLES } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  CalendarCheck: <CalendarCheck className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  Home: <Home className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  Bus: <Bus className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
};

export default function NonNegotiables() {
  return (
    <section id="standards" className="relative py-16 sm:py-24 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#D4F938]" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#D4F938] font-semibold">
                OUR TRAVEL STANDARDS
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-none">
              OUR <span className="text-[#D4F938]">NON-NEGOTIABLES</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-md sm:text-right">
            Every trip is planned around core principles that ensure quality, comfort, and peace of mind for every traveller.
          </p>
        </div>

        {/* 6 Core Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {OUR_NON_NEGOTIABLES.map((item, index) => {
            const icon = ICON_MAP[item.iconName] || <Shield className="w-6 h-6 text-[#D4F938]" />;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-6 sm:p-7 bg-black/55 hover:bg-black/75 backdrop-blur-xl border border-white/15 hover:border-[#D4F938]/50 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  {/* Icon & Counter Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#183D32] group-hover:border-[#D4F938]/40 transition-all duration-300">
                      {icon}
                    </div>
                    <span className="font-mono text-xs text-white/30 font-semibold tracking-widest">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-[#D4F938] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Subtle Indicator */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span>STANDARD VERIFIED</span>
                  <span className="w-2 h-2 rounded-full bg-[#D4F938]/60 group-hover:bg-[#D4F938]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

