"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import HomeNavbar from "@/components/home/HomeNavbar";
import FloatingLabel from "@/components/home/FloatingLabel";
import DestinationCard from "@/components/home/DestinationCard";
import StatsPanel from "@/components/home/StatsPanel";
import AboutSection from "@/components/brand/AboutSection";
import WhyTravelWithUs from "@/components/brand/WhyTravelWithUs";
import NonNegotiables from "@/components/brand/NonNegotiables";
import WhatWeDo from "@/components/brand/WhatWeDo";
import Footer from "@/components/navigation/Footer";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || shouldReduceMotion || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0d0b] text-[#F8F7F2] overflow-x-hidden selection:bg-[#D4F938] selection:text-black">
      {/* =====================================================================
          HERO VIEWPORT CONTAINER (Preserves Approved 96% Frame Layout)
          ===================================================================== */}
      <section className="relative min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-5 lg:p-6 overflow-hidden select-none">
        {/* OUTER BLURRED BACKGROUND */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-camp.jpg"
            alt="Atmospheric Mountain Backdrop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter blur-[32px] brightness-[0.35] scale-110"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* CENTRAL WEBSITE CONTAINER FRAME */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10 w-full sm:w-[98vw] lg:w-[96vw] max-w-[1780px] min-h-[96vh] lg:h-[95vh] lg:min-h-[720px] lg:max-h-[1050px] rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-y-auto lg:overflow-hidden bg-[#0c100e]"
        >
          {/* Sharp High-Resolution Mountain & Camp Image inside the Frame */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.04, 1],
                      x: isDesktop ? mouseOffset.x * -16 : 0,
                      y: isDesktop ? mouseOffset.y * -16 : 0,
                    }
              }
              transition={{
                scale: { duration: 24, repeat: Infinity, ease: "easeInOut" },
                x: { type: "spring", stiffness: 80, damping: 25 },
                y: { type: "spring", stiffness: 80, damping: 25 },
              }}
              className="relative w-full h-full min-h-[100%]"
            >
              <Image
                src="/images/hero-camp.jpg"
                alt="Himalayan Mountain Lake and Campfire"
                fill
                priority
                sizes="(max-width: 1780px) 100vw, 1780px"
                className="object-cover object-center filter contrast-[1.08] brightness-[0.92]"
              />
            </motion.div>

            {/* Cinematic Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
          </div>

          {/* FLOATING LABELS (Confirmed Destinations) */}
          <FloatingLabel
            label="Jibhi – Tirthan Valley"
            href="/trips/jibhi-tirthan-escape"
            className="hidden lg:block top-[22%] left-[53%] xl:left-[54%]"
            delay={0.5}
            floatDelay={0}
            indicatorPosition="right"
            parallaxOffset={{
              x: isDesktop ? mouseOffset.x * 24 : 0,
              y: isDesktop ? mouseOffset.y * 24 : 0,
            }}
          />

          <FloatingLabel
            label="Dharamshala – McLeodganj"
            href="/trips/dharamshala-mcleodganj-retreat"
            className="hidden lg:block top-[47%] left-[55%] xl:left-[56%]"
            delay={0.7}
            floatDelay={1.5}
            indicatorPosition="right"
            parallaxOffset={{
              x: isDesktop ? mouseOffset.x * 32 : 0,
              y: isDesktop ? mouseOffset.y * 32 : 0,
            }}
          />

          <FloatingLabel
            label="Manali & Shimla Trails"
            href="/adventures"
            className="hidden md:block bottom-[26%] lg:bottom-[28%] left-[42%] lg:left-[45%]"
            delay={0.9}
            floatDelay={0.8}
            indicatorPosition="right"
            parallaxOffset={{
              x: isDesktop ? mouseOffset.x * 20 : 0,
              y: isDesktop ? mouseOffset.y * 20 : 0,
            }}
          />

          {/* TOP NAVIGATION BAR */}
          <HomeNavbar />

          {/* HERO MAIN SECTION */}
          <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 my-auto py-6 sm:py-8 lg:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
            {/* LEFT: Official Brand Identity & Messaging */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-4 sm:space-y-5 lg:space-y-6"
            >
              {/* Eyebrow badge: Exclusive to Bennett */}
              <motion.div variants={itemFadeUp} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#D4F938]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  BENNETT UNIVERSITY EXCLUSIVE TRAVEL COMMUNITY
                </span>
              </motion.div>

              {/* Primary Client Tagline */}
              <motion.h1
                variants={itemFadeUp}
                className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] tracking-tight leading-[1.02] text-white"
              >
                NOT HERE TO FIT IN. <br />
                <span className="text-[#D4F938] drop-shadow-[0_0_30px_rgba(212,249,56,0.35)]">
                  HERE TO EXPLORE.
                </span>
              </motion.h1>

              {/* Client Secondary Message & Description */}
              <motion.div variants={itemFadeUp} className="space-y-2">
                <p className="font-mono text-xs sm:text-sm text-[#D4F938] uppercase tracking-wider font-semibold">
                  MORE THAN A TRIP, IT&apos;S AN EXPERIENCE.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-xl font-normal leading-relaxed">
                  An exclusive community for Bennett University students who want to explore new places, meet amazing people, and experience something beyond the usual college routine. Join solo or with your friends.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={itemFadeUp}
                className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2"
              >
                {/* Primary Lime Green Pill */}
                <Link
                  href="/adventures"
                  className="group inline-flex items-center gap-2.5 sm:gap-3 pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2.5 sm:py-3 bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-bold text-xs sm:text-sm lg:text-base rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,249,56,0.6)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Destinations</span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black text-[#D4F938] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </Link>

                {/* Secondary Translucent Glass Pill */}
                <Link
                  href="/#standards"
                  className="group inline-flex items-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 hover:border-white/50 text-white font-heading font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Our Standards</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT (Desktop) / BELOW (Mobile): Confirmed Destination Card */}
            <motion.div
              animate={{
                x: isDesktop ? mouseOffset.x * 12 : 0,
                y: isDesktop ? mouseOffset.y * 12 : 0,
              }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className="flex justify-center lg:justify-end w-full lg:w-auto"
            >
              <DestinationCard />
            </motion.div>
          </div>

          {/* BOTTOM COMMUNITY PILLARS PANEL */}
          <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pb-5 sm:pb-7 lg:pb-9 pt-2">
            <StatsPanel />
          </div>
        </div>
      </section>

      {/* =====================================================================
          OFFICIAL BRAND POSITIONING & CONTENT SECTIONS
          ===================================================================== */}
      <div className="relative z-10 space-y-4">
        {/* 1. About Us & What to Expect */}
        <AboutSection />

        {/* 2. Why Travel With Us (Includes Solo Traveler Welcome) */}
        <WhyTravelWithUs />

        {/* 3. Our Non-Negotiables (Female Safety First, Thoughtful Planning, Good Stays...) */}
        <NonNegotiables />

        {/* 4. What We Do (Active Confirmed Formats) */}
        <WhatWeDo />

        {/* 5. Editorial Footer */}
        <Footer />
      </div>
    </div>
  );
}
