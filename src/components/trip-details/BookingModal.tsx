"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Calendar,
  Users,
  Compass,
  AlertCircle,
  Clock,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Trip, DepartureSlot } from "@/data/trips";
import { useAuth } from "@/lib/auth/useAuth";
import { executeBookingCreation } from "@/lib/firebase/services/bookingTransactionService";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  selectedSlot: DepartureSlot;
  travellers: number;
  totalPrice: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  trip,
  selectedSlot,
  travellers,
  totalPrice,
}: BookingModalProps) {
  const router = useRouter();
  const { firebaseUser, userProfile } = useAuth();

  const [joiningType, setJoiningType] = useState<"solo" | "group">("solo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProceedToReservation = async () => {
    if (!firebaseUser) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await executeBookingCreation({
        userId: firebaseUser.uid,
        userEmail: userProfile?.email || firebaseUser.email || "",
        userName: userProfile?.displayName || firebaseUser.displayName || "Explorer",
        tripSlug: trip.slug,
        slotId: selectedSlot.id,
        travellers,
        joiningType,
      });

      // Cache reservation details in session storage for resilient zero-latency page loading
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `booking_${result.bookingId}`,
          JSON.stringify({
            id: result.bookingId,
            userId: firebaseUser.uid,
            userEmail: userProfile?.email || firebaseUser.email || "",
            userName: userProfile?.displayName || firebaseUser.displayName || "Explorer",
            tripSlug: trip.slug,
            tripTitle: result.tripTitle || trip.title,
            slotId: selectedSlot.id,
            slotDate: result.slotDate || selectedSlot.date,
            travellers,
            totalAmount: result.totalAmount,
            joiningType,
            status: "pending_payment",
            expiresAt: result.expiresAt,
            seatsReleased: false,
          })
        );
      }

      // Redirect immediately to the payment instructions page
      onClose();
      router.push(`/bookings/${result.bookingId}/payment`);
    } catch (err: any) {
      console.error("[BookingModal] Failed to reserve spot:", err);
      setErrorMsg(err?.message || "Failed to reserve your departure spot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0c100e] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 pr-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono text-[11px] font-semibold uppercase">
                <Compass className="w-3.5 h-3.5" />
                EXPEDITION RESERVATION
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                CLAIM YOUR SPOT
              </h3>
              <p className="font-body text-xs sm:text-sm text-white/70">
                Reserve your seats for <strong>{trip.title}</strong>. A 30-minute hold will be placed on your departure slot while you complete UPI payment.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Reservation Summary */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Destination:</span>
                <span className="text-[#D4F938] font-bold">{trip.destination}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Departure Date:</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4F938]" />
                  {selectedSlot.date || "Schedule TBA"}
                </span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-white/50">Explorers Count:</span>
                <span className="text-white font-semibold">
                  {travellers} {travellers === 1 ? "Student Explorer" : "Student Explorers"}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-white/70 font-semibold uppercase">Total Payable:</span>
                <span className="text-[#D4F938] font-heading font-black text-xl">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Authenticated vs Unauthenticated View */}
            {!firebaseUser ? (
              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
                <div className="space-y-1">
                  <span className="font-heading font-bold text-sm text-white uppercase block">
                    Sign in to Reserve
                  </span>
                  <p className="font-body text-xs text-white/60">
                    Google sign-in is required to track your booking and issue your ticket.
                  </p>
                </div>

                <GoogleSignInButton label="Continue with Google to Book" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Account Details confirmation */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="block text-white/40 text-[10px] uppercase">BOOKING AS</span>
                    <span className="text-white font-semibold">
                      {userProfile?.displayName || firebaseUser.displayName} ({firebaseUser.email})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#183D32] text-[#D4F938] text-[10px] font-mono">
                    VERIFIED
                  </span>
                </div>

                {/* Joining Preference */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-white/70 uppercase">
                    Traveling Solo or With Friends?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setJoiningType("solo")}
                      className={`p-3 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                        joiningType === "solo"
                          ? "bg-[#183D32] border-[#D4F938] text-[#D4F938] font-bold"
                          : "bg-white/5 border-white/10 text-white/70"
                      }`}
                    >
                      Traveling Solo
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoiningType("group")}
                      className={`p-3 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                        joiningType === "group"
                          ? "bg-[#183D32] border-[#D4F938] text-[#D4F938] font-bold"
                          : "bg-white/5 border-white/10 text-white/70"
                      }`}
                    >
                      With Friends
                    </button>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleProceedToReservation}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,249,56,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Reserving Spot & Generating Invoice...</span>
                    </>
                  ) : (
                    <>
                      <span>PROCEED TO PAYMENT (₹{totalPrice.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4F938]" />
              <span>Zero-risk reservation • 30-minute guaranteed seat hold</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
