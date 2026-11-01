"use client";

import React, { useState } from "react";
import { ChevronDown, MapPin, CheckCircle2, Compass, Mountain, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ItineraryDay } from "@/data/trips";

interface TripItineraryProps {
  itinerary: ItineraryDay[];
}

export default function TripItinerary({ itinerary }: TripItineraryProps) {
  // Default first day expanded
  const [openDays, setOpenDays] = useState<number[]>([1]);

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setOpenDays(itinerary.map((d) => d.day));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  return (
    <section className="relative py-10 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-[2px] bg-[#D4F938]" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              TRAIL BLUEPRINT & DAILY SCHEDULE
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase text-white tracking-tight leading-none">
            DAY-WISE <span className="text-[#D4F938]">ITINERARY</span>
          </h2>
        </div>

        {/* Expand / Collapse Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#D4F938] transition-colors border border-white/10 cursor-pointer"
          >
            EXPAND ALL
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#D4F938] transition-colors border border-white/10 cursor-pointer"
          >
            COLLAPSE ALL
          </button>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-2.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#D4F938] before:via-white/20 before:to-white/5">
        {itinerary.map((dayItem) => {
          const isOpen = openDays.includes(dayItem.day);

          return (
            <div key={dayItem.day} className="relative group">
              {/* Timeline Indicator Dot */}
              <button
                onClick={() => toggleDay(dayItem.day)}
                className={`absolute -left-6 sm:-left-10 top-5 w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${
                  isOpen
                    ? "bg-[#D4F938] text-black shadow-[0_0_15px_rgba(212,249,56,0.8)] scale-110"
                    : "bg-[#151916] text-white/60 border border-white/20 hover:border-[#D4F938]"
                }`}
                aria-label={`Toggle Day ${dayItem.day}`}
              >
                <span className="font-mono text-[10px] sm:text-xs font-bold">
                  {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                </span>
              </button>

              {/* Day Card Accordion */}
              <div
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? "bg-black/60 border-[#D4F938]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                    : "bg-black/40 border-white/10 hover:border-white/20"
                } backdrop-blur-md overflow-hidden`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleDay(dayItem.day)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${
                          isOpen
                            ? "bg-[#D4F938] text-black"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        DAY {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                      </span>

                      {dayItem.altitude && (
                        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-white/50">
                          <Mountain className="w-3 h-3 text-[#D4F938]" />
                          {dayItem.altitude}
                        </span>
                      )}

                      {dayItem.distance && (
                        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-white/50">
                          <MapPin className="w-3 h-3 text-[#D4F938]" />
                          {dayItem.distance}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-[#D4F938] transition-colors">
                      {dayItem.title}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-[#D4F938]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expanded Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-white/5 space-y-4">
                        <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed pt-4">
                          {dayItem.description}
                        </p>

                        {/* Activities Checklist */}
                        {dayItem.activities && dayItem.activities.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <span className="font-mono text-xs uppercase tracking-wider text-white/50 block">
                              KEY MILESTONES & ACTIVITIES:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {dayItem.activities.map((act, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-white/90"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stay & Route Info Footer */}
                        {dayItem.stayType && (
                          <div className="flex items-center gap-2 pt-2 text-xs font-mono text-white/60 border-t border-white/5">
                            <Moon className="w-3.5 h-3.5 text-[#D4F938]" />
                            <span>Overnight:</span>
                            <span className="text-white font-semibold">
                              {dayItem.stayType}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
