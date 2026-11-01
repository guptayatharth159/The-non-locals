"use client";

import React, { useState } from "react";
import { Search, X, SlidersHorizontal, RotateCcw, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  search: string;
  category: string;
  budget: string;
  duration: string;
  month: string;
  fastFillingOnly: boolean;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "All" },
  { label: "Mountain Trekking", value: "Mountain Trekking" },
  { label: "Camping", value: "Camping" },
  { label: "Road Trips", value: "Road Trips" },
  { label: "Water Adventures", value: "Water Adventures" },
  { label: "Backpacking", value: "Backpacking" },
];

const BUDGET_RANGES = [
  { label: "All Budgets", value: "All" },
  { label: "₹7,000 – ₹8,000 (Student Range)", value: "7000-8000" },
  { label: "Under ₹7,500", value: "under-7500" },
  { label: "₹7,500+", value: "above-7500" },
];

const DURATIONS = [
  { label: "All Durations", value: "All" },
  { label: "Weekend (2-3 Days)", value: "weekend" },
  { label: "Short Trek (4-5 Days)", value: "short" },
  { label: "Expedition (6+ Days)", value: "expedition" },
];

const DEPARTURE_DATES = [
  { label: "All Departure Dates", value: "All" },
  { label: "November 2026", value: "Nov 2026" },
  { label: "December 2026", value: "Dec 2026" },
  { label: "January 2027", value: "Jan 2027" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest Departures", value: "newest" },
];

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  totalResults,
}: FilterBarProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Count active non-default filters
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category !== "All" ? 1 : 0) +
    (filters.budget !== "All" ? 1 : 0) +
    (filters.duration !== "All" ? 1 : 0) +
    (filters.month !== "All" ? 1 : 0) +
    (filters.fastFillingOnly ? 1 : 0) +
    (filters.sortBy !== "recommended" ? 1 : 0);

  return (
    <div className="w-full space-y-4 select-none">
      {/* Main Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* 1. Search Box (Destination or Trip Name) */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              placeholder="Search destination (Manali, Spiti...) or trip name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#D4F938] focus:bg-white/10 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filter Selectors */}
          <div className="hidden lg:flex items-center flex-wrap gap-2">
            {/* 2. Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              aria-label="Filter by Adventure Category"
              className={`px-3 py-2 rounded-full border text-xs font-medium cursor-pointer focus:outline-none focus:border-[#D4F938] transition-colors ${
                filters.category !== "All"
                  ? "bg-[#183D32] border-[#D4F938] text-[#D4F938]"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#151916] text-white">
                  {c.label}
                </option>
              ))}
            </select>

            {/* 3. Budget Range Filter */}
            <select
              value={filters.budget}
              onChange={(e) => onFilterChange("budget", e.target.value)}
              aria-label="Filter by Budget Range"
              className={`px-3 py-2 rounded-full border text-xs font-medium cursor-pointer focus:outline-none focus:border-[#D4F938] transition-colors ${
                filters.budget !== "All"
                  ? "bg-[#183D32] border-[#D4F938] text-[#D4F938]"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value} className="bg-[#151916] text-white">
                  {b.label}
                </option>
              ))}
            </select>

            {/* 4. Duration Filter */}
            <select
              value={filters.duration}
              onChange={(e) => onFilterChange("duration", e.target.value)}
              aria-label="Filter by Duration"
              className={`px-3 py-2 rounded-full border text-xs font-medium cursor-pointer focus:outline-none focus:border-[#D4F938] transition-colors ${
                filters.duration !== "All"
                  ? "bg-[#183D32] border-[#D4F938] text-[#D4F938]"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value} className="bg-[#151916] text-white">
                  {d.label}
                </option>
              ))}
            </select>

            {/* 5. Departure Date Filter */}
            <select
              value={filters.month}
              onChange={(e) => onFilterChange("month", e.target.value)}
              aria-label="Filter by Departure Date"
              className={`px-3 py-2 rounded-full border text-xs font-medium cursor-pointer focus:outline-none focus:border-[#D4F938] transition-colors ${
                filters.month !== "All"
                  ? "bg-[#183D32] border-[#D4F938] text-[#D4F938]"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {DEPARTURE_DATES.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#151916] text-white">
                  {m.label}
                </option>
              ))}
            </select>

            {/* 6. Sorting Order */}
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              aria-label="Sort Trips"
              className="px-3 py-2 rounded-full bg-[#183D32] border border-[#245547] text-[#D4F938] text-xs font-medium cursor-pointer focus:outline-none focus:border-[#D4F938] hover:bg-[#1f4a3d] transition-colors"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#151916] text-white">
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions (Fast Filling Toggle & Reset) */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-heading font-medium text-xs hover:border-[#D4F938]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4F938]" />
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black font-bold text-[10px] flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>

            {/* 7. Available Seats (Fast Filling Toggle) */}
            <button
              onClick={() => onFilterChange("fastFillingOnly", !filters.fastFillingOnly)}
              className={`px-3.5 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border whitespace-nowrap ${
                filters.fastFillingOnly
                  ? "bg-[#D4F938] text-black border-[#D4F938] font-bold shadow-[0_0_12px_rgba(212,249,56,0.4)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${filters.fastFillingOnly ? "bg-black" : "bg-[#D4F938]"}`} />
              FAST FILLING ONLY
            </button>

            {/* 8. Reset All Filters Button */}
            {activeCount > 0 && (
              <button
                onClick={onClearFilters}
                className="p-2 sm:px-3 sm:py-2 rounded-full bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Popular Destination Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-[#D4F938]" />
            Destinations:
          </span>
          {["Jibhi", "Tirthan", "Dharamshala", "McLeodganj", "Manali", "Kullu", "Shimla", "Kufri"].map((dest) => {
            const isSelected = filters.search.toLowerCase() === dest.toLowerCase();
            return (
              <button
                key={dest}
                type="button"
                onClick={() => onFilterChange("search", isSelected ? "" : dest)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#D4F938] text-black font-bold shadow-[0_0_10px_rgba(212,249,56,0.4)]"
                    : "bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-white/20"
                }`}
              >
                {dest}
              </button>
            );
          })}
        </div>

        {/* Results Count & Live Filters Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white/50 pt-3 mt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span>
              SHOWING <strong className="text-[#D4F938] font-bold">{totalResults}</strong> VERIFIED EXPEDITIONS
            </span>
            {activeCount > 0 && (
              <span className="text-white/40">({activeCount} filters active)</span>
            )}
          </div>
          <span className="hidden sm:inline text-white/40">
            ALL EXPEDITIONS INCLUDE STUDENT SAFETY & GUIDES
          </span>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden p-4 sm:p-5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-3.5 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-heading font-bold text-sm uppercase text-[#D4F938] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filter Expeditions
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-white/70 uppercase">Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#151916] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-white/70 uppercase">Budget Range</label>
              <select
                value={filters.budget}
                onChange={(e) => onFilterChange("budget", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b.value} value={b.value} className="bg-[#151916] text-white">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-white/70 uppercase">Trip Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => onFilterChange("duration", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value} className="bg-[#151916] text-white">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-white/70 uppercase">Departure Date</label>
              <select
                value={filters.month}
                onChange={(e) => onFilterChange("month", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium"
              >
                {DEPARTURE_DATES.map((m) => (
                  <option key={m.value} value={m.value} className="bg-[#151916] text-white">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-white/70 uppercase">Sort Order</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#151916] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#D4F938] text-black font-heading font-bold text-xs uppercase"
              >
                Apply Filters
              </button>
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    onClearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/10 text-white font-mono text-xs uppercase"
                >
                  Reset
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
