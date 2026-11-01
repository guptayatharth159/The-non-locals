"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "video" | "wide" | "hero";
  className?: string;
  priority?: boolean;
  scaleHover?: boolean;
  overlay?: boolean;
  sizes?: string;
}

export default function ParallaxImage({
  src,
  alt,
  aspectRatio = "video",
  className,
  priority = false,
  scaleHover = true,
  overlay = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth subtle vertical parallax (10% shift)
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.08, 1]);

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    video: "aspect-[16/9]",
    wide: "aspect-[21/9]",
    hero: "h-[85vh] min-h-[550px]",
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-charcoal-dark select-none",
        aspectClasses,
        className
      )}
    >
      <motion.div
        style={{ y, scale }}
        className={cn(
          "relative w-full h-[120%] -top-[10%] transition-transform duration-700 ease-out",
          scaleHover && "hover:scale-[1.03]"
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-center filter contrast-[1.05] brightness-[0.92]"
        />
      </motion.div>

      {/* Raw atmospheric shadow overlay to ensure text contrast and cinematic mood */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-black/20 pointer-events-none" />
      )}
    </div>
  );
}
