"use client";

import React from "react";
import { Check, X, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface TripInclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export default function TripInclusions({ inclusions, exclusions }: TripInclusionsProps) {
  return (
    <section className="relative py-10 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INCLUSIONS CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0e241e]/50 border border-[#245547] backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F938]/10 text-[#D4F938] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-semibold block">
                COVERED IN EXPEDITION FARE
              </span>
              <h3 className="font-heading font-extrabold text-2xl uppercase text-white tracking-tight">
                WHAT'S INCLUDED
              </h3>
            </div>
          </div>

          <ul className="space-y-3.5">
            {inclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm font-mono text-white/90 leading-snug"
              >
                <div className="w-5 h-5 rounded-full bg-[#183D32] text-[#D4F938] flex items-center justify-center shrink-0 mt-0.5 border border-[#245547]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* EXCLUSIONS CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 text-[#FF7135] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF7135] font-semibold block">
                ADDITIONAL OR OUT-OF-POCKET
              </span>
              <h3 className="font-heading font-extrabold text-2xl uppercase text-white tracking-tight">
                WHAT'S NOT INCLUDED
              </h3>
            </div>
          </div>

          <ul className="space-y-3.5">
            {exclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm font-mono text-white/70 leading-snug"
              >
                <div className="w-5 h-5 rounded-full bg-white/5 text-[#FF7135] flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
