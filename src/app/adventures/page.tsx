"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/navigation/Footer";
import ExploreHero from "@/components/explore/ExploreHero";
import FeaturedTrip from "@/components/explore/FeaturedTrip";
import CategoryShowcase from "@/components/explore/CategoryShowcase";
import FilterBar, { FilterState } from "@/components/explore/FilterBar";
import TripCard from "@/components/explore/TripCard";
import ExploreCTA from "@/components/explore/ExploreCTA";
import NonNegotiables from "@/components/brand/NonNegotiables";
import { SAMPLE_TRIPS, Trip } from "@/data/trips";
import { fetchTripsWithFallback, seedInitialTripsIfEmpty } from "@/lib/firebase/services/tripsService";
import { Sparkles, Compass, RotateCcw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdventuresPage() {
  const tripsSectionRef = useRef<HTMLDivElement>(null);

  // Firestore Trips State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveFromFirestore, setIsLiveFromFirestore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrips() {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await fetchTripsWithFallback();
        if (isMounted) {
          setTrips(result.trips);
          setIsLiveFromFirestore(result.isLiveFirestore);
        }

        // Auto-seed if Firestore is empty
        if (!result.isLiveFirestore) {
          seedInitialTripsIfEmpty().then((seeded) => {
            if (seeded && isMounted) {
              fetchTripsWithFallback().then((res) => {
                if (isMounted && res.isLiveFirestore) {
                  setTrips(res.trips);
                  setIsLiveFromFirestore(true);
                }
              });
            }
          });
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("[AdventuresPage] Using sample trips fallback:", err);
          setTrips(SAMPLE_TRIPS);
          setLoadError("Connecting to live departures database...");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    budget: "All",
    duration: "All",
    month: "All",
    fastFillingOnly: false,
    sortBy: "recommended",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      budget: "All",
      duration: "All",
      month: "All",
      fastFillingOnly: false,
      sortBy: "recommended",
    });
  };

  const handleSelectCategory = (catName: string) => {
    setFilters((prev) => ({ ...prev, category: catName }));
    if (tripsSectionRef.current) {
      tripsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter and sort trips in real-time
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Search Query
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = trip.title.toLowerCase().includes(query);
        const matchesDestination = trip.destination.toLowerCase().includes(query);
        const matchesCategory = trip.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDestination && !matchesCategory) return false;
      }

      // 2. Category Filter
      if (filters.category !== "All" && trip.category !== filters.category) {
        return false;
      }

      // 3. Budget Range Filter
      if (filters.budget === "7000-8000" && (trip.price < 7000 || trip.price > 8000)) return false;
      if (filters.budget === "under-7500" && trip.price >= 7500) return false;
      if (filters.budget === "above-7500" && trip.price < 7500) return false;

      // 4. Duration Filter
      if (filters.duration === "weekend" && trip.durationDays > 3) return false;
      if (filters.duration === "short" && (trip.durationDays < 4 || trip.durationDays > 5)) return false;
      if (filters.duration === "expedition" && trip.durationDays < 6) return false;

      // 5. Month Filter
      if (filters.month !== "All" && trip.departureMonth !== filters.month) return false;

      // 6. Fast Filling Only
      if (filters.fastFillingOnly && trip.availableSeats > 6) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "newest") return b.durationDays - a.durationDays;
      return 0; // "recommended"
    });
  }, [trips, filters]);

  return (
    <div className="relative min-h-screen bg-[#0a0d0b] text-[#F8F7F2] overflow-x-hidden selection:bg-[#D4F938] selection:text-black">
      {/* Top Floating Navbar */}
      <HomeNavbar />

      {/* 1. Page Hero with Breadcrumb Navigation */}
      <ExploreHero />

      {/* 2. Featured Adventure Split Section */}
      <FeaturedTrip />

      {/* 3. Browse by Adventure Categories (Interactive Filter Triggers) */}
      <CategoryShowcase
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Main Search & Filter Interface + Trips Grid */}
      <section ref={tripsSectionRef} id="trips-catalog" className="relative py-12 sm:py-16 select-none">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-[#D4F938]" />
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-[#D4F938] font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  UPCOMING STUDENT COHORTS & EXPEDITIONS
                </span>
                {isLiveFromFirestore && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono text-[9px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4F938] animate-pulse" />
                    LIVE FIRESTORE
                  </span>
                )}
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase text-white tracking-tight leading-none">
                UPCOMING <span className="text-[#D4F938]">ADVENTURES</span>
              </h2>
            </div>

            <span className="font-mono text-xs text-white/60">
              BENNETT UNIVERSITY EXCLUSIVE // 14-18 EXPLORER CAP PER BATCH
            </span>
          </div>

          {/* Interactive Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalResults={loading ? 0 : filteredTrips.length}
          />

          {/* Loading Skeletons, Trips Grid or Empty State */}
          <AnimatePresence mode="wait">
            {loading ? (
              /* Loading Skeletons */
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-3xl bg-[#0c100d] border border-white/10 p-4 space-y-4 animate-pulse"
                  >
                    <div className="aspect-[16/10] w-full rounded-2xl bg-white/5" />
                    <div className="space-y-2 pt-1">
                      <div className="h-5 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="h-4 w-1/3 rounded bg-white/5" />
                      <div className="h-6 w-1/4 rounded-full bg-[#D4F938]/10" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredTrips.length > 0 ? (
              /* Trips Grid */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredTrips.map((trip, idx) => (
                  <TripCard key={trip.id} trip={trip} priority={idx < 3} />
                ))}
              </motion.div>
            ) : trips.length === 0 ? (
              /* Truly Empty Published Trips in Database */
              <motion.div
                key="empty-db"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-16 sm:py-24 px-6 rounded-3xl bg-black/50 border border-white/15 text-center space-y-4 max-w-xl mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D4F938]">
                  <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <h3 className="font-heading font-bold text-2xl uppercase text-white">
                  No Published Expeditions Yet
                </h3>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Upcoming student departures are currently being finalized by the field team. Check back shortly for confirmed schedules.
                </p>
              </motion.div>
            ) : (
              /* Filter Mismatch Empty State */
              <motion.div
                key="empty-filter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-16 sm:py-24 px-6 rounded-3xl bg-black/50 border border-white/15 text-center space-y-4 max-w-xl mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D4F938]">
                  <RotateCcw className="w-6 h-6 text-[#D4F938]" />
                </div>
                <h3 className="font-heading font-bold text-2xl uppercase text-white">
                  No Expeditions Found
                </h3>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  We couldn't find any trips matching your exact filter criteria. Try adjusting your search query, budget range, or duration.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#C5EC2E] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. Our Non-Negotiables & Travel Standards */}
      <NonNegotiables />

      {/* 6. Final Full-Width Cinematic Call to Action */}
      <ExploreCTA
        onExploreClick={() => {
          if (tripsSectionRef.current) {
            tripsSectionRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* Shared Editorial Footer */}
      <Footer />
    </div>
  );
}
