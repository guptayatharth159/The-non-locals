"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Settings,
  Plus,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { Trip } from "@/data/trips";
import {
  getAllTripsForAdmin,
  getAllSlotsForAdmin,
  toggleTripPublish,
  seedInitialTripsIfEmpty,
} from "@/lib/firebase/services/tripsService";

export default function AdminDashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [slotsCount, setSlotsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allTrips, allSlots] = await Promise.all([
        getAllTripsForAdmin(),
        getAllSlotsForAdmin(),
      ]);
      setTrips(allTrips);
      setSlotsCount(allSlots.length);
    } catch (e) {
      console.warn("[AdminDashboard] Error loading data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (tripId: string, currentStatus: boolean) => {
    try {
      await toggleTripPublish(tripId, !currentStatus);
      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, published: !currentStatus } : t))
      );
      setFeedback(`Trip visibility updated to ${!currentStatus ? "Published" : "Draft"}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      console.error("[AdminDashboard] Toggle publish error:", e);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const result = await seedInitialTripsIfEmpty();
      if (result) {
        setFeedback("Successfully seeded initial trips and slots into Firestore!");
        await loadData();
      } else {
        setFeedback("Firestore already contains trips. No changes needed.");
      }
    } catch (e) {
      console.error("[AdminDashboard] Seeding error:", e);
      setFeedback("Failed to seed trips to Firestore.");
    } finally {
      setSeeding(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const publishedCount = trips.filter((t) => t.published !== false).length;
  const draftCount = trips.filter((t) => t.published === false).length;

  return (
    <div className="space-y-8">
      {/* ── TOP HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
            OPERATIONS HUB
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            ADMIN DASHBOARD
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/60">
            Real-time overview of expedition catalog, departure schedules, and booking settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedData}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5 text-[#D4F938]" />
            <span>{seeding ? "Syncing..." : "Sync Sample Data"}</span>
          </button>

          <Link
            href="/admin/trips/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,56,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Trip</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ── METRIC CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trips */}
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase">Total Expeditions</span>
            <Compass className="w-4 h-4 text-[#D4F938]" />
          </div>
          <div className="font-heading font-black text-3xl text-white">
            {trips.length}
          </div>
          <span className="block font-mono text-[10px] text-white/40">
            {publishedCount} Published • {draftCount} Drafts
          </span>
        </div>

        {/* Total Departures */}
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase">Upcoming Batches</span>
            <Calendar className="w-4 h-4 text-[#D4F938]" />
          </div>
          <div className="font-heading font-black text-3xl text-white">
            {slotsCount}
          </div>
          <span className="block font-mono text-[10px] text-white/40">
            Across active expeditions
          </span>
        </div>

        {/* WhatsApp Enquiries Channel */}
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase">Booking Engine</span>
            <Flame className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="font-heading font-black text-2xl text-[#25D366] uppercase">
            WhatsApp Live
          </div>
          <span className="block font-mono text-[10px] text-white/40">
            Friction-free click-to-chat
          </span>
        </div>

        {/* Site Settings */}
        <div className="p-6 rounded-2xl bg-[#0c100e] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="font-mono text-xs uppercase">Configuration</span>
            <Settings className="w-4 h-4 text-[#D4F938]" />
          </div>
          <div className="font-heading font-black text-2xl text-white uppercase">
            Active
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#D4F938] hover:underline"
          >
            <span>Manage Settings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── QUICK ACTIONS ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/trips"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4F938]/40 hover:bg-[#183D32]/20 transition-all duration-200 space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-white group-hover:text-[#D4F938] uppercase">
              Manage Trip Catalog
            </span>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#D4F938] group-hover:translate-x-1 transition-all" />
          </div>
          <p className="font-body text-xs text-white/50">
            Create, edit itineraries, upload photos, and toggle publishing.
          </p>
        </Link>

        <Link
          href="/admin/departures"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4F938]/40 hover:bg-[#183D32]/20 transition-all duration-200 space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-white group-hover:text-[#D4F938] uppercase">
              Departure Slots &amp; Capacity
            </span>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#D4F938] group-hover:translate-x-1 transition-all" />
          </div>
          <p className="font-body text-xs text-white/50">
            Add departure dates, set prices, and update availability status.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4F938]/40 hover:bg-[#183D32]/20 transition-all duration-200 space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-white group-hover:text-[#D4F938] uppercase">
              WhatsApp &amp; Website Settings
            </span>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#D4F938] group-hover:translate-x-1 transition-all" />
          </div>
          <p className="font-body text-xs text-white/50">
            Update the official WhatsApp number powering student enquiries.
          </p>
        </Link>
      </div>

      {/* ── EXPEDITIONS OVERVIEW TABLE ────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-white uppercase">
              Expedition Catalog Overview
            </h2>
            <p className="font-mono text-xs text-white/50">
              Live trips visible to students vs. unpublished drafts.
            </p>
          </div>
          <Link
            href="/admin/trips"
            className="font-mono text-xs text-[#D4F938] hover:underline"
          >
            View All ({trips.length}) →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-white/40 animate-pulse">
            Loading expedition inventory...
          </div>
        ) : trips.length === 0 ? (
          <div className="py-12 text-center space-y-3 font-mono text-xs text-white/50">
            <p>No expeditions found in database.</p>
            <button
              onClick={handleSeedData}
              className="px-4 py-2 rounded-full bg-[#183D32] text-[#D4F938] border border-[#D4F938]/40 cursor-pointer"
            >
              Seed Initial Expeditions
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase">
                  <th className="pb-3 font-semibold">Expedition</th>
                  <th className="pb-3 font-semibold">Destination</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Fare (₹)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trips.slice(0, 6).map((trip) => {
                  const isPublished = trip.published !== false;
                  return (
                    <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-heading font-bold text-sm text-white">
                          {trip.title}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">
                          /{trip.slug}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-white/70">
                        {trip.destination}
                      </td>
                      <td className="py-3.5 pr-4 text-white/70">
                        {trip.duration}
                      </td>
                      <td className="py-3.5 pr-4 text-[#D4F938] font-bold">
                        ₹{trip.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(trip.id, isPublished)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                            isPublished
                              ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]/40"
                              : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <Link
                          href={`/trips/${trip.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
                          title="Preview public trip page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/trips/${trip.id}/edit`}
                          className="inline-flex items-center px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[11px]"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

