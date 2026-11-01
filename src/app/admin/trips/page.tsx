"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Trip } from "@/data/trips";
import {
  getAllTripsForAdmin,
  toggleTripPublish,
  deleteTripByAdmin,
} from "@/lib/firebase/services/tripsService";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [notification, setNotification] = useState<string | null>(null);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const allTrips = await getAllTripsForAdmin();
      setTrips(allTrips);
    } catch (e) {
      console.error("[AdminTrips] Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleTogglePublish = async (tripId: string, currentStatus: boolean) => {
    try {
      await toggleTripPublish(tripId, !currentStatus);
      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, published: !currentStatus } : t))
      );
      setNotification(`Trip visibility changed to ${!currentStatus ? "Published" : "Draft"}.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error("[AdminTrips] Toggle error:", e);
    }
  };

  const handleDeleteTrip = async (tripId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteTripByAdmin(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      setNotification(`Trip "${title}" deleted.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error("[AdminTrips] Delete error:", e);
    }
  };

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    const matchesQuery =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.category.toLowerCase().includes(searchQuery.toLowerCase());

    const isPublished = trip.published !== false;
    if (statusFilter === "published") return matchesQuery && isPublished;
    if (statusFilter === "draft") return matchesQuery && !isPublished;
    return matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
            EXPEDITIONS CATALOG
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            TRIP MANAGEMENT
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/60">
            Create, edit, publish, and manage all student expeditions and content.
          </p>
        </div>

        <Link
          href="/admin/trips/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,56,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Expedition</span>
        </Link>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips, destinations..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 font-mono text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#183D32] text-[#D4F938] font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            All ({trips.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "published"
                ? "bg-[#183D32] text-[#D4F938] font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Published ({trips.filter((t) => t.published !== false).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "draft"
                ? "bg-[#183D32] text-[#D4F938] font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Drafts ({trips.filter((t) => t.published === false).length})
          </button>
        </div>
      </div>

      {/* Trips Table */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6">
        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-white/40 animate-pulse">
            Loading expeditions...
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="py-16 text-center space-y-3 font-mono text-xs text-white/50">
            <p>No expeditions matched your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase">
                  <th className="pb-3 font-semibold">Cover</th>
                  <th className="pb-3 font-semibold">Title &amp; Slug</th>
                  <th className="pb-3 font-semibold">Destination</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Fare (₹)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTrips.map((trip) => {
                  const isPublished = trip.published !== false;
                  return (
                    <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Cover Thumbnail */}
                      <td className="py-3 pr-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={trip.image || "/images/hero-misty-lake-canoe.jpg"}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="py-3 pr-4">
                        <div className="font-heading font-bold text-sm text-white">
                          {trip.title}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono block">
                          /{trip.slug}
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="py-3 pr-4 text-white/70">
                        {trip.destination}
                        <span className="block text-[10px] text-white/40">{trip.duration}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 pr-4 text-white/60">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                          {trip.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 pr-4 text-[#D4F938] font-bold text-sm">
                        ₹{trip.price.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3 pr-4">
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

                      {/* Actions */}
                      <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/trips/${trip.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                          title="Preview public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/trips/edit?id=${trip.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(trip.id, trip.title)}
                          className="inline-flex items-center p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete trip"
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
    </div>
  );
}

