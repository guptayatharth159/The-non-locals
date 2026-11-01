"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Compass,
  Calendar,
  Users,
  MessageCircle,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Trip, DepartureSlot } from "@/data/trips";
import { getPublicSettings } from "@/lib/firebase/services/settingsService";

interface WhatsAppEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  selectedSlot: DepartureSlot;
  initialTravellers?: number;
}

interface TravellerItem {
  id: string;
  fullName: string;
  age: string;
}

export default function WhatsAppEnquiryModal({
  isOpen,
  onClose,
  trip,
  selectedSlot,
  initialTravellers = 1,
}: WhatsAppEnquiryModalProps) {
  // ── Form State ─────────────────────────────────────────────────────────────
  const [primaryName, setPrimaryName] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [slotDate, setSlotDate] = useState(selectedSlot.date || "");
  const [joiningType, setJoiningType] = useState<"solo" | "group">(
    initialTravellers > 1 ? "group" : "solo"
  );
  const [travellers, setTravellers] = useState<TravellerItem[]>([
    { id: "1", fullName: "", age: "" },
  ]);
  const [notes, setNotes] = useState("");

  // ── UI States ──────────────────────────────────────────────────────────────
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessSent, setIsSuccessSent] = useState(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string>("");

  // Update slotDate when selectedSlot changes
  useEffect(() => {
    if (selectedSlot?.date) {
      setSlotDate(selectedSlot.date);
    }
  }, [selectedSlot]);

  // Adjust travellers array based on initial count
  useEffect(() => {
    if (initialTravellers > 1) {
      setJoiningType("group");
      setTravellers((current) => {
        if (current.length >= initialTravellers) return current;
        const newItems: TravellerItem[] = [...current];
        for (let i = current.length + 1; i <= initialTravellers; i++) {
          newItems.push({ id: String(Date.now() + i), fullName: "", age: "" });
        }
        return newItems;
      });
    }
  }, [initialTravellers]);

  // Fetch admin-configured WhatsApp number
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      setIsLoadingSettings(true);
      try {
        const settings = await getPublicSettings();
        if (isMounted) {
          setWhatsappNumber(settings.whatsappNumber || "");
        }
      } catch (e) {
        console.warn("[WhatsAppEnquiryModal] Error loading settings:", e);
      } finally {
        if (isMounted) setIsLoadingSettings(false);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // When joining solo, keep traveller 1 synced to primary name if empty
  const handlePrimaryNameChange = (val: string) => {
    setPrimaryName(val);
    if (joiningType === "solo") {
      setTravellers((prev) => {
        if (prev.length === 0) return [{ id: "1", fullName: val, age: "" }];
        return [{ ...prev[0], fullName: val }];
      });
    }
  };

  // Add traveller
  const handleAddTraveller = () => {
    if (travellers.length >= 12) return;
    setJoiningType("group");
    setTravellers((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), fullName: "", age: "" },
    ]);
  };

  // Remove traveller
  const handleRemoveTraveller = (id: string) => {
    if (travellers.length <= 1) return;
    setTravellers((prev) => prev.filter((t) => t.id !== id));
  };

  // Update specific traveller field
  const handleUpdateTraveller = (
    id: string,
    field: "fullName" | "age",
    value: string
  ) => {
    setTravellers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // ── Validation & WhatsApp Message Generator ─────────────────────────────────
  const validateAndGenerateMessage = (): {
    isValid: boolean;
    error?: string;
    url?: string;
  } => {
    // 1. Primary Name
    const cleanPrimaryName = primaryName.trim();
    if (!cleanPrimaryName || cleanPrimaryName.length < 2) {
      return {
        isValid: false,
        error: "Please enter the primary contact's full name (at least 2 characters).",
      };
    }

    // 2. Primary Phone
    const cleanPhoneDigits = primaryPhone.replace(/[^0-9]/g, "");
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
      return {
        isValid: false,
        error: "Please enter a valid 10-digit mobile number for WhatsApp coordination.",
      };
    }

    // 3. Departure Date
    if (!slotDate) {
      return {
        isValid: false,
        error: "Please select an expedition departure date.",
      };
    }

    // 4. Travellers
    for (let i = 0; i < travellers.length; i++) {
      const t = travellers[i];
      if (!t.fullName.trim() || t.fullName.trim().length < 2) {
        return {
          isValid: false,
          error: `Please enter the full name for Traveller #${i + 1}.`,
        };
      }
    }

    // 5. WhatsApp Business Phone
    const destinationPhone = whatsappNumber.replace(/[^0-9]/g, "");
    if (!destinationPhone || destinationPhone.length < 8) {
      return {
        isValid: false,
        error:
          "The official WhatsApp booking line is not configured yet. Please contact @thenonlocals or try again shortly.",
      };
    }

    // 6. Generate Message
    const count = travellers.length;
    const travellersListFormatted = travellers
      .map((t, idx) => {
        const agePart = t.age?.trim() ? ` (Age: ${t.age.trim()})` : "";
        return `${idx + 1}. ${t.fullName.trim()}${agePart}`;
      })
      .join("\n");

    const specialNotesPart = notes.trim()
      ? `\n\n💬 SPECIAL REQUESTS:\n${notes.trim()}`
      : "";

    const message = `Hi THE NON LOCALS team! 🏔️\nI would like to book an expedition. Here are our booking details:\n\n📍 EXPEDITION: ${trip.title}\n📅 DEPARTURE DATE: ${slotDate}\n👥 PARTY SIZE: ${count} ${count === 1 ? "Explorer" : "Explorers"} (${joiningType === "group" ? "Group Joining" : "Solo Explorer"})\n\n👤 PRIMARY CONTACT:\n• Name: ${cleanPrimaryName}\n• Phone: +91 ${cleanPhoneDigits.slice(-10)}\n\n🎒 TRAVELLER DETAILS:\n${travellersListFormatted}${specialNotesPart}\n\nPlease let us know slot availability and how to complete the payment to confirm our spots!`;

    const targetUrl = `https://wa.me/${destinationPhone}?text=${encodeURIComponent(
      message
    )}`;

    return { isValid: true, url: targetUrl };
  };

  const handleProceedToWhatsApp = () => {
    setErrorMessage(null);
    const result = validateAndGenerateMessage();

    if (!result.isValid || !result.url) {
      setErrorMessage(result.error || "Please complete all required fields.");
      return;
    }

    setLastGeneratedUrl(result.url);
    setIsSuccessSent(true);

    // Open WhatsApp in a new window/tab
    if (typeof window !== "undefined") {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleResetModal = () => {
    setIsSuccessSent(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0c100e] border border-white/15 p-5 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleResetModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccessSent ? (
            /* ── SUCCESS VIEW: WHATSAPP DISPATCHED ────────────────────────── */
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#183D32] border border-[#25D366] text-[#25D366] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,211,102,0.4)]">
                <MessageCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
                  WHATSAPP CHAT INITIATED
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  One Final Step!
                </h3>
                <p className="font-body text-xs sm:text-sm text-white/70 leading-relaxed">
                  We have pre-filled your expedition enquiry inside WhatsApp.
                  <br />
                  <strong className="text-white">
                    Please remember to press &ldquo;Send&rdquo; inside WhatsApp
                  </strong>{" "}
                  so our coordinator receives your group details, confirms seat
                  availability, and issues your ticket.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-left space-y-1.5 max-w-md mx-auto text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/40">Expedition:</span>
                  <span className="text-white font-semibold">{trip.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Departure Date:</span>
                  <span className="text-[#D4F938] font-semibold">{slotDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Party Size:</span>
                  <span className="text-white font-semibold">
                    {travellers.length} {travellers.length === 1 ? "Explorer" : "Explorers"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Primary Contact:</span>
                  <span className="text-white font-semibold">{primaryName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {lastGeneratedUrl && (
                  <a
                    href={lastGeneratedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Re-Open WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            /* ── MAIN ENQUIRY FORM ────────────────────────────────────────── */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-3.5 pr-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4F938]/40 bg-[#151916] shadow-[0_0_15px_rgba(212,249,56,0.2)] shrink-0 mt-0.5">
                  <Image
                    src="/images/logo.png"
                    alt="THE NON LOCALS Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono text-[11px] font-semibold uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    WHATSAPP BOOKING ENQUIRY
                  </span>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    BOOK YOUR ADVENTURE
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-white/70">
                    Fill in your details below. We will generate a structured booking message and connect you directly with our team on WhatsApp.
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Body */}
              <div className="space-y-5">
                {/* 1. Trip & Departure Slot Selector Strip */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/50">Expedition:</span>
                    <span className="text-[#D4F938] font-bold text-right">{trip.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span className="text-white/50">Departure Date:</span>
                    {trip.departureSlots && trip.departureSlots.length > 1 ? (
                      <select
                        value={slotDate}
                        onChange={(e) => setSlotDate(e.target.value)}
                        className="bg-[#183D32] border border-[#D4F938]/40 rounded-lg px-2.5 py-1 text-white text-xs font-mono cursor-pointer focus:outline-none"
                      >
                        {trip.departureSlots.map((slot) => (
                          <option key={slot.id} value={slot.date} disabled={slot.status === "sold-out"}>
                            {slot.date} {slot.status === "sold-out" ? "(Sold Out)" : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D4F938]" />
                        {slotDate || "Schedule TBA"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/50">Joining Preference:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setJoiningType("solo")}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                          joiningType === "solo"
                            ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        Solo
                      </button>
                      <button
                        type="button"
                        onClick={() => setJoiningType("group")}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                          joiningType === "group"
                            ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        With Friends
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Primary Contact Section */}
                <div className="space-y-3 pt-1">
                  <span className="block font-mono text-[11px] text-[#D4F938] uppercase tracking-wider font-semibold">
                    1. PRIMARY CONTACT DETAILS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-white/50 uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={primaryName}
                        onChange={(e) => handlePrimaryNameChange(e.target.value)}
                        placeholder="e.g. Yatharth Gupta"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-white/50 uppercase">
                        WhatsApp Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl bg-white/5 border border-r-0 border-white/15 text-white/60 font-mono text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={primaryPhone}
                          onChange={(e) => setPrimaryPhone(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={15}
                          className="w-full px-3.5 py-2.5 rounded-r-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Travellers / Friends List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#D4F938] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4F938]" />
                      2. TRAVELLERS ({travellers.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTraveller}
                      disabled={travellers.length >= 12}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#183D32] hover:bg-[#1f4e40] text-[#D4F938] font-mono text-[11px] transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Friend</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {travellers.map((traveller, index) => (
                      <div
                        key={traveller.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 sm:gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-white/5 text-white/50 font-mono text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={traveller.fullName}
                            onChange={(e) =>
                              handleUpdateTraveller(
                                traveller.id,
                                "fullName",
                                e.target.value
                              )
                            }
                            placeholder={index === 0 ? "Primary Explorer Name" : `Explorer #${index + 1} Full Name`}
                            className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={traveller.age}
                            onChange={(e) =>
                              handleUpdateTraveller(
                                traveller.id,
                                "age",
                                e.target.value
                              )
                            }
                            placeholder="Age (opt.)"
                            maxLength={3}
                            className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                          />
                        </div>
                        {travellers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTraveller(traveller.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            aria-label="Remove traveller"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Special Requests */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-mono text-[10px] text-white/50 uppercase">
                    Special Requests or College Cohort Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Quad sharing cottage preference, dietary requests, Bennett cohort room allocation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 5. CTA Button */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleProceedToWhatsApp}
                    disabled={isLoadingSettings}
                    className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.99] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(37,211,102,0.4)] cursor-pointer disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>CONTINUE WITH WHATSAPP ({travellers.length} {travellers.length === 1 ? "EXPLORER" : "EXPLORERS"})</span>
                  </button>

                  {/* Clarification banner */}
                  <p className="text-center font-mono text-[11px] text-white/60">
                    💡 Clicking opens WhatsApp with your enquiry pre-filled. Please tap{" "}
                    <strong className="text-white">Send</strong> inside WhatsApp!
                  </p>
                </div>

                {/* Privacy & Trust Signals */}
                <div className="pt-3 border-t border-white/10 space-y-2 font-mono text-[11px] text-white/50">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4F938] shrink-0 mt-0.5" />
                    <span>
                      🔒 <strong>Zero Server Storage:</strong> Your personal details are not stored on our web database. They transfer directly to THE NON LOCALS via WhatsApp chat.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <GraduationCap className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
                    <span>Bennett University Exclusive Cohort • Female Safety Priority</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

