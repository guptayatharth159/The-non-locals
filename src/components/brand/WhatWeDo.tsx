"use client";

import React from "react";
import Link from "next/link";
import { Users, Sliders, Camera, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { WHAT_WE_DO } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Experiential Group Trips": <Users className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  "Customised Holidays": <Sliders className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  "Creator Hosted Trips": <Camera className="w-6 h-6 text-[#D4F938]" strokeWidth={2} />,
  "Corporate & Community Retreats": <Building2 className="w-6 h-6 text-white/50" strokeWidth={2} />,
};

export default function WhatWeDo() {
  // Only display active client-confirmed services. Unconfirmed/corporate kept editable and unpublished.
  const activeServices = WHAT_WE_DO.filter((s) => s.status === "active");

  return (
    <section id="what-we-do" className="relative py-16 sm:py-24 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#D4F938]" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#D4F938] font-semibold">
                CURATED EXPEDITION FORMATS
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-none">
              WHAT <span className="text-[#D4F938]">WE DO</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-md sm:text-right">
            Curated formats designed specifically around small cohorts, weekend escapes, and personalized group journeys.
          </p>
        </div>

        {/* Active Confirmed Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeServices.map((service, index) => {
            const icon = ICON_MAP[service.title] || <Users className="w-6 h-6 text-[#D4F938]" />;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl p-7 bg-black/55 hover:bg-black/75 backdrop-blur-xl border border-white/15 hover:border-[#D4F938]/50 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#183D32] transition-all duration-300">
                      {icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono tracking-wider text-[#D4F938] uppercase">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-[#D4F938] transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-mono text-xs text-[#D4F938]">
                      {service.tagline}
                    </p>
                  </div>

                  <p className="font-body text-sm text-white/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                  <span>SMALL BATCH COHORT</span>
                  <Link
                    href="/adventures"
                    className="flex items-center gap-1 text-[#D4F938] hover:underline"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

