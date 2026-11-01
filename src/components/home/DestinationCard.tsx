"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Compass, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function DestinationCard() {
  const shouldReduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Jibhi – Tirthan Valley",
      location: "Tirthan Valley, Himachal Pradesh",
      description: "Hidden waterfalls, pine nature trails, and authentic riverside wooden homestays.",
      image: "/images/hero-misty-lake-canoe.jpg",
      category: "OFFBEAT",
      href: "/trips/jibhi-tirthan-escape",
      budget: "₹7,499",
    },
    {
      title: "Dharamshala – McLeodganj",
      location: "Kangra Valley, Himachal Pradesh",
      description: "Tibetan culture, mountain cafe trails, Bhagsu waterfall & panoramic Dhauladhar views.",
      image: "/images/hero-twilight-camp.jpg",
      category: "CULTURE",
      href: "/trips/dharamshala-mcleodganj-retreat",
      budget: "₹7,800",
    },
    {
      title: "Manali – Kullu",
      location: "Kullu District, Himachal Pradesh",
      description: "Old Manali lanes, Jogini waterfall hike, Solang valley vistas & crisp pine air.",
      image: "/images/emerald-lake.jpg",
      category: "MOUNTAIN",
      href: "/trips/manali-kullu-adventure",
      budget: "₹7,999",
    },
    {
      title: "Shimla – Kufri",
      location: "Shimla Hills, Himachal Pradesh",
      description: "Historic colonial ridge walks, deodar cedar forests & panoramic Himalayan viewpoints.",
      image: "/images/hero-camp.jpg",
      category: "HIGHLANDS",
      href: "/trips/shimla-kufri-getaway",
      budget: "₹7,200",
    },
  ];

  const current = slides[activeSlide];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
      className="relative z-20 w-full max-w-[320px] sm:max-w-[340px] lg:max-w-[350px] mx-auto lg:mx-0"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="group relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 bg-black/60 hover:bg-black/75 backdrop-blur-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:-translate-y-1.5 text-white"
      >
        {/* Top Destination Image (Clickable Link) */}
        <Link
          href={current.href}
          className="block relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 cursor-pointer"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 640px) 300px, 350px"
            className="object-cover object-center filter contrast-[1.05] brightness-[0.95] transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top category & icon */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-wider text-[#D4F938] uppercase">
              {current.category}
            </span>
            <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Indicative budget chip */}
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90">
              Indicative: <strong className="text-[#D4F938]">{current.budget}</strong>
            </span>
          </div>
        </Link>

        {/* Destination Information */}
        <div className="pt-3 pb-1.5 px-1 space-y-1.5">
          <Link href={current.href} className="group/title block cursor-pointer">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-base sm:text-lg text-white group-hover/title:text-[#D4F938] transition-colors tracking-tight">
                {current.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/70 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
              <span className="truncate">{current.location}</span>
            </div>
          </Link>

          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
            {current.description}
          </p>

          {/* Action Row: Pagination Dots + Destination Button */}
          <div className="flex items-center justify-between pt-2">
            {/* Pagination Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx
                      ? "w-6 bg-[#D4F938] shadow-[0_0_8px_#D4F938]"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Destination Button */}
            <Link
              href={current.href}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-[11px] uppercase tracking-wider transition-all duration-200 hover:shadow-[0_0_15px_rgba(212,249,56,0.5)] active:scale-95 cursor-pointer"
            >
              <span>View Trip</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
