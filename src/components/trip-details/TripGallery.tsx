"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface TripGalleryProps {
  images: string[];
  tripTitle: string;
}

export default function TripGallery({ images, tripTitle }: TripGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryList = images && images.length > 0 ? images : ["/images/hero-camp.jpg"];
  const primaryImage = galleryList[0];
  const supportingImages = galleryList.slice(1, 5);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev as number) + 1) % galleryList.length);
    }
  }, [lightboxIndex, galleryList.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        (prev as number) === 0 ? galleryList.length - 1 : (prev as number) - 1
      );
    }
  }, [lightboxIndex, galleryList.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  return (
    <section className="relative py-8 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-[2px] bg-[#D4F938]" />
          <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            EXPEDITION PHOTO GALLERY
          </h2>
        </div>
        <span className="font-mono text-xs text-white/50">
          {galleryList.length} HIGH-RES SHOTS
        </span>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 sm:gap-4 h-[440px] md:h-[500px]">
        {/* Large Primary Image (Spans 7 cols) */}
        <div
          onClick={() => openLightbox(0)}
          className="group relative sm:col-span-7 h-full rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4F938]/60 transition-all duration-300 bg-black/40"
        >
          <ImageWithFallback
            src={primaryImage}
            fallbackSrc="/images/hero-camp.jpg"
            alt={`${tripTitle} Primary`}
            fill
            sizes="(max-width: 1024px) 60vw, 50vw"
            className="object-cover object-center filter contrast-[1.05] brightness-[0.92] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono uppercase tracking-wider border border-white/15">
              Primary View
            </span>
            <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D4F938] opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 4 Supporting Images in 2x2 Grid (Spans 5 cols) */}
        <div className="sm:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 h-full">
          {supportingImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="group relative h-full rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4F938]/60 transition-all duration-300 bg-black/40"
            >
              <ImageWithFallback
                src={img}
                fallbackSrc="/images/hero-camp.jpg"
                alt={`${tripTitle} Shot ${idx + 2}`}
                fill
                sizes="(max-width: 1024px) 25vw, 20vw"
                className="object-cover object-center filter contrast-[1.05] brightness-[0.92] transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#D4F938] opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Carousel */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
        {galleryList.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="relative flex-shrink-0 w-[82vw] aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 snap-center bg-black/40 active:scale-[0.98] transition-transform"
          >
            <ImageWithFallback
              src={img}
              fallbackSrc="/images/hero-camp.jpg"
              alt={`${tripTitle} mobile photo ${idx + 1}`}
              fill
              sizes="85vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-white/80">
              {idx + 1} / {galleryList.length}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Top Bar Controls */}
            <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-2 font-mono text-xs text-white/80 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15">
                <span>{tripTitle}</span>
                <span className="text-[#D4F938]">
                  ({lightboxIndex + 1} / {galleryList.length})
                </span>
              </div>

              <button
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4F938] hover:text-black border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-[#D4F938] text-white hover:text-black border border-white/20 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-[#D4F938] text-white hover:text-black border border-white/20 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Current Image */}
            <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[80vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <ImageWithFallback
                src={galleryList[lightboxIndex]}
                fallbackSrc="/images/hero-camp.jpg"
                alt={`${tripTitle} Lightbox View`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
