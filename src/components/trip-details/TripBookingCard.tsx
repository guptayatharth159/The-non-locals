"use client";

import React from "react";
import { Plus, Minus, ShieldCheck, ArrowRight, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Trip, DepartureSlot } from "@/data/trips";

interface TripBookingCardProps {
  trip: Trip;
  selectedSlot: DepartureSlot;
  onSelectSlotId: (slotId: string) => void;
  travellers: number;
  setTravellers: React.Dispatch<React.SetStateAction<number>>;
  onBookClick: () => void;
}

export default function TripBookingCard({
  trip,
  selectedSlot,
  travellers,
  setTravellers,
  onBookClick,
}: TripBookingCardProps) {
  const totalPrice = selectedSlot.price * travellers;
  const maxTravellers = 6;

  const incrementTravellers = () => {
    if (travellers < maxTravellers) {
      setTravellers((prev) => prev + 1);
    }
  };

  const decrementTravellers = () => {
    if (travellers > 1) {
      setTravellers((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP STICKY SIDEBAR CARD                            */}
      {/* ======================================================== */}
      <div className="hidden lg:block sticky top-28 z-30 select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-[#0c0f0d]/90 backdrop-blur-2xl border border-white/15 p-6 xl:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6"
        >
          {/* Top Price Row */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="block font-mono text-[10px] text-[#D4F938] uppercase tracking-widest font-semibold">
                INDICATIVE STUDENT FARE
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-heading font-black text-3xl xl:text-4xl text-white">
                  ₹{selectedSlot.price.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-white/60">/ person</span>
              </div>
              <span className="block font-mono text-[10px] text-white/50 pt-1">
                *Overall indicative budget range: ₹7,000–₹8,000
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono font-semibold text-[10px] uppercase">
              SAMPLE DATA
            </span>
          </div>

          {/* Destination Details Tag */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-white/90 font-semibold">
              <GraduationCap className="w-4 h-4 text-[#D4F938]" />
              <span>BENNETT UNIVERSITY EXCLUSIVE</span>
            </div>
            <p className="text-[11px] text-white/60 font-body">
              Join solo or register with your friends from campus.
            </p>
          </div>

          {/* Traveller Quantity Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-white/70 uppercase">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4F938]" />
                EXPLORERS COUNT
              </span>
              <span className="text-[11px] text-white/50">MAX {maxTravellers}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/15">
              <button
                type="button"
                onClick={decrementTravellers}
                disabled={travellers <= 1}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Decrease Travellers"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-heading font-bold text-xl text-white">
                {travellers} {travellers === 1 ? "Student" : "Students"}
              </span>

              <button
                type="button"
                onClick={incrementTravellers}
                disabled={travellers >= maxTravellers}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Increase Travellers"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-white/60">
              <span>{travellers} Explorer × ₹{selectedSlot.price.toLocaleString()}</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Curated Experiences & Stay</span>
              <span className="text-[#D4F938]">AS SPECIFIED</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-heading font-bold text-sm text-white">ESTIMATED TOTAL:</span>
              <span className="font-heading font-black text-2xl text-[#D4F938]">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={onBookClick}
            disabled={selectedSlot.status === "sold-out"}
            className="w-full py-4 px-6 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,249,56,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>
              {selectedSlot.status === "sold-out"
                ? "SOLD OUT"
                : "BOOK YOUR ADVENTURE"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Standards Badges */}
          <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-[11px] text-white/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4F938]" />
              <span>Female Safety First • Handpicked Stays</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#D4F938]" />
              <span>Bennett University Student Cohort</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE COMPACT STICKY BOTTOM BAR                       */}
      {/* ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/15 px-4 py-3 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="block font-mono text-[10px] text-white/50 uppercase">
              INDICATIVE FOR {travellers} {travellers === 1 ? "STUDENT" : "STUDENTS"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl text-[#D4F938]">
                ₹{totalPrice.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] text-white/50">
                (Indicative)
              </span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            disabled={selectedSlot.status === "sold-out"}
            className="px-6 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(212,249,56,0.6)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {selectedSlot.status === "sold-out" ? "SOLD OUT" : "BOOK YOUR ADVENTURE"}
          </button>
        </div>
      </div>
    </>
  );
}
