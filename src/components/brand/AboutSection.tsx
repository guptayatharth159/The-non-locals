"use client";

import React from "react";
import Image from "next/image";
import { Compass, Sparkles, MapPin, Landmark, Footprints, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { WHAT_TO_EXPECT } from "@/lib/constants";

const ICON_MAP = [
  <Footprints key="1" className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  <Compass key="2" className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
  <Landmark key="3" className="w-5 h-5 text-[#D4F938]" strokeWidth={2} />,
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 sm:py-24 select-none">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Top Split: About the Community */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-[#D4F938] font-mono text-xs tracking-wider uppercase">
              <GraduationCap className="w-4 h-4" />
              BENNETT UNIVERSITY EXCLUSIVE TRAVEL COMMUNITY
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-[1.05]">
              MORE THAN A TRIP, <br />
              <span className="text-[#D4F938] drop-shadow-[0_0_25px_rgba(212,249,56,0.3)]">
                IT&apos;S AN EXPERIENCE.
              </span>
            </h2>

            <p className="font-body text-base sm:text-lg text-white/85 leading-relaxed">
              We are a student-focused community dedicated to university students who love to travel. We create opportunities to explore new places and experience them in a whole new way.
            </p>

            <p className="font-body text-sm sm:text-base text-white/70 leading-relaxed">
              College shouldn&apos;t just be about moving between classes and dorm rooms. THE NON LOCALS is built exclusively for Bennett University students who want to step outside, meet like-minded peers, and discover mountain trails, hidden waterfalls, and quiet Himalayan roads with people who share their curiosity.
            </p>

            {/* Core Values Badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-white/80">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
                <span>Designed around your people & your experience</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
                <span>Affordable student-first budgets (₹7K - ₹8K)</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden border border-white/20 bg-black/50 shadow-2xl">
            <Image
              src="/images/hero-camp.jpg"
              alt="Bennett Students Himalayan Expedition"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center filter contrast-[1.08] brightness-[0.88]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Official Brand Crest Seal */}
            <div className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#D4F938]/40 shadow-[0_0_25px_rgba(212,249,56,0.25)] bg-[#0c100e]/90 backdrop-blur-md p-1.5 z-10 transition-transform duration-300 hover:rotate-6 hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="THE NON LOCALS Official Seal"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4F938]">
                COMMUNITY MANIFESTO
              </span>
              <p className="font-heading font-bold text-sm sm:text-base leading-snug">
                &ldquo;NOT HERE TO FIT IN. HERE TO EXPLORE.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Three Cards: What to Expect */}
        <div className="space-y-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
                EXPERIENCE THE HIMALAYAS
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl uppercase text-white tracking-tight">
                WHAT TO <span className="text-[#D4F938]">EXPECT</span>
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-white/60 max-w-sm sm:text-right">
              Every route is curated to bring you close to the authentic character of the high mountain ranges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHAT_TO_EXPECT.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl p-6 sm:p-7 bg-black/55 hover:bg-black/75 backdrop-blur-xl border border-white/15 hover:border-[#D4F938]/40 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#183D32] transition-colors">
                      {ICON_MAP[index]}
                    </div>
                    <span className="font-mono text-xs text-[#D4F938] font-bold tracking-widest">
                      {item.number}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-heading font-bold text-xl text-white tracking-tight">
                      {item.title}
                    </h4>
                    <p className="font-mono text-xs text-[#D4F938] tracking-wide">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="font-body text-sm text-white/70 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="h-[2px] w-full bg-white/10 group-hover:bg-[#D4F938]/50 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

