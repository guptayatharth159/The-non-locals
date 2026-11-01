"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trip,
  ItineraryDay,
  TripHighlight,
  TripFAQItem,
  TripAccommodation,
} from "@/data/trips";
import { saveTripByAdmin } from "@/lib/firebase/services/tripsService";
import {
  uploadTripCoverImage,
  uploadTripGalleryImage,
} from "@/lib/firebase/services/storageService";
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface TripFormProps {
  initialTrip?: Partial<Trip>;
  isNew?: boolean;
}

export default function TripForm({ initialTrip, isNew = false }: TripFormProps) {
  const router = useRouter();

  // Basic Info
  const [id, setId] = useState(() => initialTrip?.id || `trip_${Date.now()}`);
  const [title, setTitle] = useState(initialTrip?.title || "");
  const [slug, setSlug] = useState(initialTrip?.slug || "");
  const [destination, setDestination] = useState(initialTrip?.destination || "");
  const [state, setState] = useState(initialTrip?.state || "");
  const [duration, setDuration] = useState(initialTrip?.duration || "3 Days / 2 Nights");
  const [durationDays, setDurationDays] = useState(initialTrip?.durationDays || 3);
  const [price, setPrice] = useState(initialTrip?.price || 7499);
  const [originalPrice, setOriginalPrice] = useState(initialTrip?.originalPrice || 8999);
  const [departureLocation, setDepartureLocation] = useState(
    initialTrip?.departureLocation || "Bennett University Campus"
  );
  const [category, setCategory] = useState<any>(initialTrip?.category || "Backpacking");
  const [difficulty, setDifficulty] = useState<any>(initialTrip?.difficulty || "Easy-Moderate");
  const [maxGroupSize, setMaxGroupSize] = useState(initialTrip?.maxGroupSize || 18);
  const [minAge, setMinAge] = useState(initialTrip?.minAge || 18);
  const [tagline, setTagline] = useState(initialTrip?.tagline || "");
  const [description, setDescription] = useState(initialTrip?.description || "");
  const [published, setPublished] = useState(initialTrip?.published ?? true);

  // Media
  const [coverImage, setCoverImage] = useState(
    initialTrip?.image || "/images/hero-misty-lake-canoe.jpg"
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialTrip?.galleryImages && initialTrip.galleryImages.length > 0
      ? initialTrip.galleryImages
      : [coverImage]
  );
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Highlights (comma or array)
  const [highlightsInput, setHighlightsInput] = useState(
    initialTrip?.highlights?.join(", ") || ""
  );

  // Inclusions & Exclusions
  const [inclusionsInput, setInclusionsInput] = useState(
    initialTrip?.inclusions?.join("\n") || ""
  );
  const [exclusionsInput, setExclusionsInput] = useState(
    initialTrip?.exclusions?.join("\n") || ""
  );

  // Accommodation
  const [stayType, setStayType] = useState(
    initialTrip?.accommodation?.type || "Student Homestay / Campsite"
  );
  const [roomSharing, setRoomSharing] = useState(
    initialTrip?.accommodation?.roomSharing || "Triple / Quad Sharing"
  );
  const [stayDescription, setStayDescription] = useState(
    initialTrip?.accommodation?.description ||
      "Comfortable verified student stays with hot water and power backup."
  );
  const [stayAmenitiesInput, setStayAmenitiesInput] = useState(
    initialTrip?.accommodation?.amenities?.join(", ") || "Hot Water, Power Backup, Wi-Fi"
  );

  // Itinerary (Days array)
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    initialTrip?.itinerary && initialTrip.itinerary.length > 0
      ? initialTrip.itinerary
      : [
          {
            day: 1,
            title: "Departure & Basecamp Arrival",
            description: "Depart from university campus and arrive at scenic basecamp.",
            activities: ["Scenic drive", "Campfire orientation", "Team briefing"],
            stayType: "Homestay / Camp",
          },
        ]
  );

  // FAQs
  const [faqs, setFaqs] = useState<TripFAQItem[]>(
    initialTrip?.faqs && initialTrip.faqs.length > 0
      ? initialTrip.faqs
      : [
          {
            question: "Who is eligible to join this trip?",
            answer: "Open to college students and travelers looking for adventurous cohort journeys.",
          },
        ]
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  // Upload Cover Image Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadTripCoverImage(slug || id, file);
      setCoverImage(url);
      setFeedback("Cover image uploaded successfully to Firebase Storage!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error("[TripForm] Cover upload error:", err);
      setErrorMsg("Failed to upload cover image. Falling back to URL input.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload Gallery Image Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGallery(true);
    try {
      const url = await uploadTripGalleryImage(slug || id, file);
      setGalleryImages((prev) => [...prev, url]);
      setFeedback("Gallery image added successfully!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error("[TripForm] Gallery upload error:", err);
      setErrorMsg("Failed to upload gallery image.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Itinerary helpers
  const handleAddItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev,
      {
        day: nextDay,
        title: `Day ${nextDay} Itinerary`,
        description: "Describe the day's experiences, hikes, and sights.",
        activities: ["Morning trek", "Sunset exploration"],
        stayType: "Homestay / Campsite",
      },
    ]);
  };

  const handleUpdateItineraryDay = (
    index: number,
    field: keyof ItineraryDay,
    val: any
  ) => {
    setItinerary((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (itinerary.length <= 1) return;
    setItinerary((prev) =>
      prev.filter((_, idx) => idx !== index).map((item, i) => ({ ...item, day: i + 1 }))
    );
  };

  // FAQ helpers
  const handleAddFaq = () => {
    setFaqs((prev) => [
      ...prev,
      { question: "New FAQ Question", answer: "FAQ Answer here..." },
    ]);
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFeedback(null);

    if (!title.trim() || !slug.trim()) {
      setErrorMsg("Title and URL slug are required.");
      return;
    }

    setIsSaving(true);
    try {
      const highlights = highlightsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const inclusions = inclusionsInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const exclusions = exclusionsInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const amenities = stayAmenitiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const accommodation: TripAccommodation = {
        type: stayType,
        roomSharing,
        description: stayDescription,
        amenities,
      };

      const tripData: Partial<Trip> & { id: string } = {
        id,
        title: title.trim(),
        slug: slug.trim(),
        destination: destination.trim(),
        state: state.trim(),
        duration,
        durationDays: Number(durationDays),
        price: Number(price),
        originalPrice: Number(originalPrice),
        departureLocation,
        category,
        difficulty,
        maxGroupSize: Number(maxGroupSize),
        minAge: Number(minAge),
        tagline: tagline.trim(),
        description: description.trim(),
        image: coverImage,
        galleryImages: galleryImages.length > 0 ? galleryImages : [coverImage],
        highlights,
        inclusions,
        exclusions,
        itinerary,
        accommodation,
        faqs,
        published,
        departureSlots: initialTrip?.departureSlots || [],
      };

      await saveTripByAdmin(tripData);
      setFeedback("Expedition saved successfully!");
      setTimeout(() => {
        router.push("/admin/trips");
      }, 1000);
    } catch (err: any) {
      console.error("[TripForm] Save error:", err);
      setErrorMsg(err?.message || "Failed to save trip to Firestore.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <Link
            href="/admin/trips"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-[#D4F938] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Trips</span>
          </Link>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            {isNew ? "CREATE EXPEDITION" : `EDIT: ${title || "Expedition"}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Publish Toggle Button */}
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs transition-colors cursor-pointer ${
              published
                ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]/40"
                : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
            }`}
          >
            {published ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Published (Live)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Draft (Hidden)</span>
              </>
            )}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,56,0.3)] cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Expedition"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── 1. BASIC DETAILS ──────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide border-b border-white/10 pb-3">
          1. Basic Trip Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {/* Title */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Expedition Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Jibhi & Tirthan Valley Expedition"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. jibhi-tirthan-escape"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Destination *</label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Jibhi - Tirthan Valley"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">State / Region</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Himachal Pradesh"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Duration String</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 Days / 3 Nights"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Price (₹) */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Indicative Fare (₹) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="7499"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Original Price */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Original Price (₹)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              placeholder="8999"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Backcountry Trek, Backpacking"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Easy-Moderate">Easy-Moderate</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>

          {/* Departure Location */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Assembly / Departure Location</label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              placeholder="e.g. Bennett University Campus Main Gate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Expedition Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Hidden Waterfalls, Great Himalayan National Park & Stargazing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Detailed Overview</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive summary of the adventure, student vibe, and terrain..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── 2. MEDIA & GALLERY ────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide border-b border-white/10 pb-3">
          2. Media &amp; Visuals
        </h2>

        {/* Cover Image */}
        <div className="space-y-3 font-mono text-xs">
          <label className="block text-white/60 uppercase font-semibold">
            Cover Image (Main Banner)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-20 rounded-xl overflow-hidden bg-black/60 border border-white/15 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage || "/images/hero-misty-lake-canoe.jpg"}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... or upload below"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] cursor-pointer">
                  <Upload className="w-3 h-3 text-[#D4F938]" />
                  <span>{isUploadingCover ? "Uploading..." : "Upload Cover Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={isUploadingCover}
                  />
                </label>
                <span className="text-[10px] text-white/40">Direct upload to Firebase Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-3 font-mono text-xs pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-white/60 uppercase font-semibold">
              Gallery Images ({galleryImages.length})
            </label>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#183D32] hover:bg-[#1f4e40] text-[#D4F938] font-mono text-[11px] cursor-pointer">
              <Plus className="w-3 h-3" />
              <span>{isUploadingGallery ? "Uploading..." : "Add Image to Gallery"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={isUploadingGallery}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden bg-black/60 border border-white/15 aspect-video group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. ITINERARY BUILDER ─────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
            3. Day-by-Day Itinerary ({itinerary.length} Days)
          </h2>
          <button
            type="button"
            onClick={handleAddItineraryDay}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#183D32] text-[#D4F938] font-mono text-xs cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Day</span>
          </button>
        </div>

        <div className="space-y-4">
          {itinerary.map((dayItem, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#D4F938] uppercase">
                  Day {dayItem.day}
                </span>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(index)}
                    className="p-1 rounded text-white/40 hover:text-red-400"
                    title="Remove day"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase">Day Title</label>
                  <input
                    type="text"
                    value={dayItem.title}
                    onChange={(e) => handleUpdateItineraryDay(index, "title", e.target.value)}
                    placeholder="e.g. Arrival at Tirthan Valley Basecamp"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase">Stay Location</label>
                  <input
                    type="text"
                    value={dayItem.stayType || ""}
                    onChange={(e) => handleUpdateItineraryDay(index, "stayType", e.target.value)}
                    placeholder="e.g. Riverside Homestay / Cottages"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase">Day Description</label>
                <textarea
                  rows={2}
                  value={dayItem.description}
                  onChange={(e) =>
                    handleUpdateItineraryDay(index, "description", e.target.value)
                  }
                  placeholder="Detail the activities, meals, and route for this day..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. ACCOMMODATION, INCLUSIONS & EXCLUSIONS ─────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide border-b border-white/10 pb-3">
          4. Stay, Inclusions &amp; Exclusions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {/* Stay Type */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Accommodation Type</label>
            <input
              type="text"
              value={stayType}
              onChange={(e) => setStayType(e.target.value)}
              placeholder="e.g. Verified Riverside Homestay"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Room Sharing */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Room Sharing Format</label>
            <input
              type="text"
              value={roomSharing}
              onChange={(e) => setRoomSharing(e.target.value)}
              placeholder="e.g. Quad / Triple Sharing (Gender-segregated)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Amenities (Comma separated)</label>
            <input
              type="text"
              value={stayAmenitiesInput}
              onChange={(e) => setStayAmenitiesInput(e.target.value)}
              placeholder="Hot Water, Power Backup, Bonfire, Verified Stays"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Inclusions */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Inclusions (One per line)</label>
            <textarea
              rows={5}
              value={inclusionsInput}
              onChange={(e) => setInclusionsInput(e.target.value)}
              placeholder="Transport from campus&#10;All meals during trek&#10;Experienced mountain guides&#10;Entry permits"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none resize-none"
            />
          </div>

          {/* Exclusions */}
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Exclusions (One per line)</label>
            <textarea
              rows={5}
              value={exclusionsInput}
              onChange={(e) => setExclusionsInput(e.target.value)}
              placeholder="Personal shopping&#10;Snacks on highway halts&#10;Anything not explicitly mentioned"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── 5. FAQs ──────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
            5. Frequently Asked Questions ({faqs.length})
          </h2>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#183D32] text-[#D4F938] font-mono text-xs cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                  placeholder="Question..."
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-bold text-xs focus:border-[#D4F938] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="p-1 ml-2 text-white/40 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                placeholder="Answer..."
                className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white/70 text-xs focus:border-[#D4F938] focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <Link
          href="/admin/trips"
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(212,249,56,0.3)] cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Expedition"}</span>
        </button>
      </div>
    </form>
  );
}
