"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowUpRight, Compass, Shield, Mail } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { NAV_ITEMS, BRAND } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
    },
    opened: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  const navItemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    opened: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="opened"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#151916] text-[#F8F7F2] p-6 sm:p-10 overflow-y-auto"
        >
          {/* Top Bar inside Menu */}
          <div className="flex items-center justify-between border-b border-[#EDE5D5]/15 pb-6">
            <Link href="/" onClick={onClose} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4F938]/30 flex items-center justify-center bg-[#1E2420] shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="THE NON LOCALS Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl tracking-wider uppercase text-[#F8F7F2]">
                  {BRAND.name}
                </span>
                <span className="font-mono text-[10px] text-[#FF7135] tracking-widest uppercase">
                  {BRAND.baseCampCoordinates}
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-3 bg-[#1E2420] border border-[#EDE5D5]/20 text-[#EDE5D5] hover:text-[#FF7135] transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="my-auto py-10 flex flex-col gap-4">
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.label}
                custom={index}
                variants={navItemVariants}
                initial="closed"
                animate="opened"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between font-display text-4xl sm:text-5xl uppercase text-[#EDE5D5] hover:text-[#FF7135] transition-colors py-2 border-b border-[#EDE5D5]/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#FF7135] tracking-widest">
                      0{index + 1}
                    </span>
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="font-mono text-xs tracking-wider bg-[#FF7135]/20 text-[#FF7135] px-2.5 py-0.5 border border-[#FF7135]/40">
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:text-[#FF7135] transition-all" />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom Action & Dispatch Info */}
          <div className="flex flex-col gap-6 pt-6 border-t border-[#EDE5D5]/15">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/#claim-spot"
                withArrow
                onClick={onClose}
                className="w-full"
              >
                JOIN NEXT EXPEDITION
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={`mailto:${BRAND.contactEmail}`}
                icon={<Mail className="w-4 h-4" />}
                iconPosition="left"
                className="w-full"
              >
                FIELD DESK ENQUIRY
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#EDE5D5]/60 pt-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#FF7135]" />
                {BRAND.baseCampLocation}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#A3A879]" />
                ESTD. {BRAND.establishedYear} // COLLEGE EXPEDITIONS
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
