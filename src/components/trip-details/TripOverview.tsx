"use client";

import React from "react";
import { Clock, MapPin, Gauge, Users, UserCheck, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Trip } from "@/data/trips";

interface TripOverviewProps {
  trip: Trip;
}

export default function TripOverview({ trip }: TripOverviewProps) {
  const cards = [
    {
      icon: Clock,
      label: "DURATION",
      value: trip.duration,
      subtext: `${trip.durationDays} Days of Expedition`,
    },
    {
      icon: MapPin,
      label: "BASECAMP PICKUP",
      value: trip.departureLocation.split("(")[0].trim(),
      subtext: trip.departureLocation.includes("(")
        ? trip.departureLocation.match(/\((.*?)\)/)?.[1] || "Direct Pickup Point"
        : "Central Assembly Point",
    },
    {
      icon: Gauge,
      label: "DIFFICULTY GRADE",
      value: trip.difficulty,
      subtext:
        trip.difficulty === "Easy"
          ? "Beginner Friendly"
          : trip.difficulty === "Moderate"
          ? "Good Fitness Needed"
          : "Endurance & Preparation Required",
    },
    {
      icon: Users,
      label: "MAX COHORT SIZE",
      value: `${trip.maxGroupSize} Explorers`,
      subtext: "Strict Cap For Safe Batches",
    },
    {
      icon: UserCheck,
      label: "ELIGIBILITY AGE",
      value: `${trip.minAge}+ Years`,
      subtext: "College Students & Youth Only",
    },
    {
      icon: CalendarCheck,
      label: "UPCOMING BATCHES",
      value: `${trip.departureSlots.length} Open Slots`,
      subtext: `Starting ${trip.departureDate}`,
    },
  ];

  return (
    <section className="relative py-8 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-[#D4F938]/40 transition-all duration-300 backdrop-blur-md group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] sm:text-[11px] text-white/50 tracking-wider uppercase font-medium">
                  {card.label}
                </span>
                <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#D4F938]/10 flex items-center justify-center text-[#D4F938] transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-[#D4F938] transition-colors leading-tight">
                  {card.value}
                </div>
                <div className="font-mono text-[11px] text-white/50 mt-1 truncate">
                  {card.subtext}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
