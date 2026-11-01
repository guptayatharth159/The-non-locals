"use client";

import React from "react";
import { Compass, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";
import { TripReview } from "@/data/trips";

interface TripReviewsProps {
  reviews?: TripReview[];
  rating?: number;
  reviewsCount?: number;
}

export default function TripReviews({ reviews = [] }: TripReviewsProps) {
  if (reviews.length === 0) {
    return (
      <section className="relative py-8 select-none">
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4F938]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">
                Expedition Community Dispatches
              </h4>
              <p className="font-body text-xs text-white/60">
                Verified reviews and traveller stories will be shared directly by cohort explorers following departure batches.
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-[#D4F938] px-3 py-1 rounded-full bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto">
            COMMUNITY FIRST
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 select-none">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-[2px] bg-[#D4F938]" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          COMMUNITY COHORT DISPATCHES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3"
          >
            <p className="font-body text-sm text-white/80 leading-relaxed italic">
              &ldquo;{rev.comment}&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-2 border-t border-white/10">
              <span className="text-white font-bold">{rev.author}</span>
              <span>{rev.college || "Explorer Community"}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
