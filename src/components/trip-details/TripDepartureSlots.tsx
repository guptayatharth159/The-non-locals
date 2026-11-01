"use client";

import React from "react";
import { Calendar, Users, Check, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { DepartureSlot } from "@/data/trips";

interface TripDepartureSlotsProps {
  slots: DepartureSlot[];
  selectedSlotId: string;
  onSelectSlot: (slot: DepartureSlot) => void;
}

export default function TripDepartureSlots({
  slots,
  selectedSlotId,
  onSelectSlot,
}: TripDepartureSlotsProps) {
  return (
    <section id="departure-slots" className="relative py-10 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-[2px] bg-[#D4F938]" />
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          AVAILABLE EXPEDITION BATCHES
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none">
          SELECT <span className="text-[#D4F938]">DEPARTURE DATE</span>
        </h2>
        <span className="font-mono text-xs text-white/50">
          SELECT YOUR PREFERRED SLOT TO LOCK YOUR SPOT
        </span>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isSoldOut = slot.status === "sold-out" || slot.availableSeats === 0;
          const isFillingFast = slot.status === "filling-fast";

          return (
            <motion.div
              key={slot.id}
              whileHover={!isSoldOut ? { scale: 1.01 } : {}}
              onClick={() => {
                if (!isSoldOut) onSelectSlot(slot);
              }}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative ${
                isSoldOut
                  ? "bg-black/30 border-white/5 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-black/70 border-[#D4F938] shadow-[0_0_25px_rgba(212,249,56,0.25)] cursor-pointer"
                  : "bg-black/40 border-white/10 hover:border-white/30 cursor-pointer"
              }`}
            >
              {/* Active Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#D4F938] text-black flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="space-y-4">
                {/* Date & Month Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4F938]" />
                    <span className="font-heading font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
                      {slot.date} – {slot.endDate}
                    </span>
                  </div>
                </div>

                {/* Status Badge & Available Seats */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {isSoldOut ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/50 font-mono text-xs uppercase tracking-wider">
                        SOLD OUT
                      </span>
                    ) : isFillingFast ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F938]/20 border border-[#D4F938]/40 text-[#D4F938] font-heading font-bold text-xs uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#D4F938] animate-ping" />
                        ONLY {slot.availableSeats} SEATS LEFT
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 font-mono text-xs uppercase tracking-wider">
                        {slot.availableSeats} SEATS OPEN
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-white/50 uppercase">
                      PER EXPLORER
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-white">
                      ₹{slot.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-white/50">
        <Sparkles className="w-3.5 h-3.5 text-[#D4F938]" />
        <span>
          Batches operate with a strict student-to-guide ratio. Early reservations are recommended.
        </span>
      </div>
    </section>
  );
}
