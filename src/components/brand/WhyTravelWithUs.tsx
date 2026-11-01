"use client";

import React from "react";
import Link from "next/link";
import {
  BadgePercent,
  ShieldCheck,
  Compass,
  MapPin,
  Users,
  HeartHandshake,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { WHY_TRAVEL_WITH_US } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  BadgePercent: <BadgePercent className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  Compass: <Compass className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  MapPin: <MapPin className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  Users: <Users className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
};

export default function WhyTravelWithUs() {
  return (
    <section id="why-us" className="relative py-16 sm:py-24 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#D4F938]" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#D4F938] font-semibold">
                CURATED FOR BENNETT STUDENTS
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-none">
              WHY TRAVEL <span className="text-[#D4F938]">WITH US</span>
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-md sm:text-right">
            We build experiences tailored for university students — keeping trips affordable, authentic, safe, and deeply memorable.
          </p>
        </div>

        {/* 6 Value Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {WHY_TRAVEL_WITH_US.map((item, index) => {
            const icon = ICON_MAP[item.icon] || <Compass className="w-5 h-5 text-[#D4F938]" />;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group relative rounded-3xl p-6 sm:p-7 bg-black/55 hover:bg-black/75 backdrop-blur-xl border border-white/15 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#183D32] transition-all duration-300">
                    {icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Solo Traveler Callout Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#183D32]/80 via-black/80 to-black/80 border border-[#D4F938]/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4F938]/15 border border-[#D4F938]/40 flex items-center justify-center shrink-0 text-[#D4F938]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
                NO GROUP? ZERO PROBLEM.
              </span>
              <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Traveling Solo? You Are Always Welcome.
              </h4>
              <p className="font-body text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                You do not need a pre-existing group of friends to travel with us. Most students sign up individually, meet peers from Bennett University on day one, and form lasting friendships across campus.
              </p>
            </div>
          </div>

          <Link
            href="/adventures"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,249,56,0.5)] shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>Browse Cohorts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

