"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Users,
  Compass,
  Archive,
} from "lucide-react";
import { Trip, DepartureSlot } from "@/data/trips";
import {
  getAllTripsForAdmin,
  getAllSlotsForAdmin,
  saveSlotByAdmin,
  deleteSlotByAdmin,
} from "@/lib/firebase/services/tripsService";

interface AdminSlotItem {
  id: string;
  tripId: string;
  tripSlug: string;
  date: string;
  endDate?: string;
  month?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: "available" | "filling-fast" | "sold-out" | "closed";
}

export default function AdminDeparturesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [slots, setSlots] = useState<AdminSlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [formTripSlug, setFormTripSlug] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formMonth, setFormMonth] = useState("Fall 2026");
  const [formPrice, setFormPrice] = useState(7499);
  const [formTotalSeats, setFormTotalSeats] = useState(18);
  const [formAvailableSeats, setFormAvailableSeats] = useState(18);
  const [formStatus, setFormStatus] = useState<
    "available" | "filling-fast" | "sold-out" | "closed"
  >("available");

  const loadData = async () => {
    setLoading(true);
    try {
      const [allTrips, allSlots] = await Promise.all([
        getAllTripsForAdmin(),
        getAllSlotsForAdmin(),
      ]);
      setTrips(allTrips);
      setSlots(allSlots);
      if (allTrips.length > 0 && !formTripSlug) {
        setFormTripSlug(allTrips[0].slug);
      }
    } catch (e) {
      console.warn("[AdminDepartures] Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNewModal = () => {
    setEditingSlotId(null);
    setFormDate("");
    setFormEndDate("");
    setFormMonth("Fall 2026");
    setFormPrice(7499);
    setFormTotalSeats(18);
    setFormAvailableSeats(18);
    setFormStatus("available");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slot: AdminSlotItem) => {
    setEditingSlotId(slot.id);
    setFormTripSlug(slot.tripSlug);
    setFormDate(slot.date);
    setFormEndDate(slot.endDate || "");
    setFormMonth(slot.month || "Fall 2026");
    setFormPrice(slot.price);
    setFormTotalSeats(slot.totalSeats);
    setFormAvailableSeats(slot.availableSeats);
    setFormStatus(slot.status);
    setIsModalOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTripSlug || !formDate.trim()) return;

    const matchedTrip = trips.find((t) => t.slug === formTripSlug);
    const tripId = matchedTrip?.id || formTripSlug;

    const slotId =
      editingSlotId ||
      `${formTripSlug}-slot-${Date.now().toString(36).substring(2, 7)}`;

    try {
      await saveSlotByAdmin(slotId, {
        tripId,
        tripSlug: formTripSlug,
        date: formDate.trim(),
        endDate: formEndDate.trim(),
        month: formMonth.trim(),
        price: Number(formPrice),
        totalSeats: Number(formTotalSeats),
        availableSeats: Number(formAvailableSeats),
        status: formStatus,
        published: true,
      });

      setFeedback("Departure slot saved successfully!");
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error("[AdminDepartures] Save error:", err);
    }
  };

  // Instant status toggle
  const handleQuickStatusChange = async (
    slotId: string,
    currentStatus: "available" | "filling-fast" | "sold-out" | "closed"
  ) => {
    const sequence: Array<"available" | "filling-fast" | "sold-out" | "closed"> = [
      "available",
      "filling-fast",
      "sold-out",
      "closed",
    ];
    const nextStatus = sequence[(sequence.indexOf(currentStatus) + 1) % sequence.length];

    const targetSlot = slots.find((s) => s.id === slotId);
    if (!targetSlot) return;

    try {
      await saveSlotByAdmin(slotId, {
        ...targetSlot,
        status: nextStatus,
      });
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, status: nextStatus } : s))
      );
      setFeedback(`Status updated to "${nextStatus}" for slot ${targetSlot.date}`);
      setTimeout(() => setFeedback(null), 2500);
    } catch (e) {
      console.error("[AdminDepartures] Quick status error:", e);
    }
  };

  const handleDeleteSlot = async (slotId: string, date: string) => {
    if (!window.confirm(`Delete departure slot "${date}"?`)) return;
    try {
      await deleteSlotByAdmin(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      setFeedback(`Slot "${date}" removed.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      console.error("[AdminDepartures] Delete error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
            SCHEDULE &amp; CAPACITY
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            DEPARTURE MANAGEMENT
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/60">
            Manage student departure batches, adjust seat availability, and set sold-out statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,56,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Departure Batch</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Slots Table */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-white/40 animate-pulse">
            Loading departure schedules...
          </div>
        ) : slots.length === 0 ? (
          <div className="py-16 text-center space-y-3 font-mono text-xs text-white/50">
            <p>No departure slots found.</p>
            <button
              onClick={handleOpenNewModal}
              className="px-4 py-2 rounded-full bg-[#183D32] text-[#D4F938] border border-[#D4F938]/40 cursor-pointer"
            >
              Add First Departure Slot
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase">
                  <th className="pb-3 font-semibold">Expedition</th>
                  <th className="pb-3 font-semibold">Departure Date</th>
                  <th className="pb-3 font-semibold">Fare (₹)</th>
                  <th className="pb-3 font-semibold">Capacity</th>
                  <th className="pb-3 font-semibold">Status (Tap to cycle)</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {slots.map((slot) => {
                  const matchedTrip = trips.find(
                    (t) => t.slug === slot.tripSlug || t.id === slot.tripId
                  );
                  return (
                    <tr key={`${slot.tripSlug || slot.tripId}-${slot.id}`} className="hover:bg-white/[0.02] transition-colors">
                      {/* Trip */}
                      <td className="py-3.5 pr-4">
                        <div className="font-heading font-bold text-sm text-white">
                          {matchedTrip?.title || slot.tripSlug}
                        </div>
                        <span className="text-[10px] text-white/40">
                          {matchedTrip?.destination || slot.tripSlug}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 pr-4 text-white font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D4F938]" />
                          <span>{slot.date}</span>
                        </div>
                        {slot.endDate && (
                          <span className="block text-[10px] text-white/40">
                            Return: {slot.endDate}
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 pr-4 text-[#D4F938] font-bold">
                        ₹{slot.price.toLocaleString()}
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 pr-4 text-white/70">
                        <span>
                          {slot.availableSeats} / {slot.totalSeats} seats
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(slot.id, slot.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                            slot.status === "available"
                              ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]/40 hover:bg-[#1f4e40]"
                              : slot.status === "filling-fast"
                              ? "bg-amber-950/40 text-amber-300 border border-amber-400/40 hover:bg-amber-900/40"
                              : slot.status === "sold-out"
                              ? "bg-red-950/40 text-red-300 border border-red-500/40 hover:bg-red-900/40"
                              : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                          }`}
                          title="Click to cycle status: Available ➔ Filling Fast ➔ Sold Out ➔ Closed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{slot.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(slot)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[11px]"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot.id, slot.date)}
                          className="inline-flex items-center p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Delete slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: ADD / EDIT DEPARTURE SLOT ──────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0c100e] border border-white/15 p-6 space-y-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
              {editingSlotId ? "Edit Departure Slot" : "Add Departure Batch"}
            </h3>

            <form onSubmit={handleSaveSlot} className="space-y-4 font-mono text-xs">
              {/* Trip Select */}
              <div className="space-y-1">
                <label className="text-white/60 uppercase">Trip</label>
                <select
                  value={formTripSlug}
                  onChange={(e) => setFormTripSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                >
                  {trips.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 uppercase">Departure Date *</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. Dec 20, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 uppercase">Return Date</label>
                  <input
                    type="text"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="e.g. Dec 24, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & Seats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 uppercase">Total Seats</label>
                  <input
                    type="number"
                    value={formTotalSeats}
                    onChange={(e) => setFormTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 uppercase">Available</label>
                  <input
                    type="number"
                    value={formAvailableSeats}
                    onChange={(e) => setFormAvailableSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-white/60 uppercase">Availability Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                >
                  <option value="available">available (Green badge - Open)</option>
                  <option value="filling-fast">filling-fast (Amber badge - Few left)</option>
                  <option value="sold-out">sold-out (Red badge - Full)</option>
                  <option value="closed">closed (Grey badge - Registration closed)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
