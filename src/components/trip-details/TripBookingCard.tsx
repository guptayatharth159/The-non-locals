"use client";

import React from "react";
import { Plus, Minus, ShieldCheck, ArrowRight, Users, Compass } from "lucide-react";
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
          {/* Top Header Row */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="block font-mono text-[10px] text-[#D4F938] uppercase tracking-widest font-semibold">
                EXPEDITION RESERVATION
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-heading font-black text-2xl xl:text-3xl text-white uppercase tracking-tight">
                  BOOK YOUR TRIP
                </span>
              </div>
              <span className="block font-mono text-[10px] text-white/60 pt-1">
                Selected Batch: <strong className="text-white">{selectedSlot.date || "Schedule TBA"}</strong>
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono font-semibold text-[10px] uppercase shrink-0">
              OPEN BATCH
            </span>
          </div>

          {/* Destination Details Tag */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-white/90 font-semibold">
              <Compass className="w-4 h-4 text-[#D4F938]" />
              <span>CURATED GROUP EXPEDITION</span>
            </div>
            <p className="text-[11px] text-white/60 font-body">
              Join solo or register with your circle. Custom packages coordinated directly.
            </p>
          </div>

          {/* Traveller Quantity Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-white/70 uppercase">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4F938]" />
                PARTY SIZE
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
                {travellers} {travellers === 1 ? "Explorer" : "Explorers"}
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

          {/* Reservation Summary */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-white/60">
              <span>Selected Batch:</span>
              <span className="text-[#D4F938] font-semibold">{selectedSlot.date || "Confirmed"}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Joining Format:</span>
              <span className="text-white font-medium">{travellers > 1 ? "Group Cohort" : "Solo Explorer"}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Inclusions:</span>
              <span className="text-white font-medium">Stays, Meals &amp; Trek</span>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-white/50 leading-relaxed">
              Click below to enter traveller details and coordinate directly with our team.
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
                : "BOOK YOUR TRIP"}
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
              <Compass className="w-3.5 h-3.5 text-[#D4F938]" />
              <span>Small Cohorts (14–18 Explorers)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE COMPACT STICKY BOTTOM BAR                       */}
      {/* ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/15 px-4 py-3 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="block font-mono text-[10px] text-white/50 uppercase truncate max-w-[170px]">
              {selectedSlot.date || "BATCH SELECTED"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-lg sm:text-xl text-[#D4F938]">
                {travellers} {travellers === 1 ? "Explorer" : "Explorers"}
              </span>
            </div>
          </div>

          <button
            onClick={onBookClick}
            disabled={selectedSlot.status === "sold-out"}
            className="px-6 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(212,249,56,0.6)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {selectedSlot.status === "sold-out" ? "SOLD OUT" : "BOOK YOUR TRIP"}
          </button>
        </div>
      </div>
    </>
  );
}
