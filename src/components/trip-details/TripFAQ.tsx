"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TripFAQItem } from "@/data/trips";

interface TripFAQProps {
  faqs: TripFAQItem[];
}

export default function TripFAQ({ faqs }: TripFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIdx((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-10 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-[2px] bg-[#D4F938]" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          COMMONLY ASKED EXPEDITION QUERIES
        </span>
      </div>

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none mb-6">
        FREQUENTLY <span className="text-[#D4F938]">ASKED</span>
      </h2>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border backdrop-blur-md overflow-hidden ${
                isOpen
                  ? "bg-black/60 border-[#D4F938]/40"
                  : "bg-black/40 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-heading font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                  {faq.question}
                </span>

                <div
                  className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/70 transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180 text-[#D4F938]" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-white/5">
                      <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed pt-3">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
