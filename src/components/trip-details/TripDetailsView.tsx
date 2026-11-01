"use client";

import React, { useState } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/navigation/Footer";
import TripHero from "@/components/trip-details/TripHero";
import TripOverview from "@/components/trip-details/TripOverview";
import TripGallery from "@/components/trip-details/TripGallery";
import TripHighlights from "@/components/trip-details/TripHighlights";
import TripItinerary from "@/components/trip-details/TripItinerary";
import TripAccommodation from "@/components/trip-details/TripAccommodation";
import TripInclusions from "@/components/trip-details/TripInclusions";
import TripDepartureSlots from "@/components/trip-details/TripDepartureSlots";
import TripBookingCard from "@/components/trip-details/TripBookingCard";
import TripReviews from "@/components/trip-details/TripReviews";
import TripFAQ from "@/components/trip-details/TripFAQ";
import TripRelated from "@/components/trip-details/TripRelated";
import WhatsAppEnquiryModal from "@/components/trip-details/WhatsAppEnquiryModal";
import { Trip, DepartureSlot } from "@/data/trips";

interface TripDetailsViewProps {
  trip: Trip;
}

export default function TripDetailsView({ trip }: TripDetailsViewProps) {
  // Find initial available slot
  const initialSlot =
    trip.departureSlots.find((s) => s.status !== "sold-out") || trip.departureSlots[0];

  const [selectedSlot, setSelectedSlot] = useState<DepartureSlot>(initialSlot);
  const [travellers, setTravellers] = useState<number>(1);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const handleSelectSlotId = (slotId: string) => {
    const found = trip.departureSlots.find((s) => s.id === slotId);
    if (found && found.status !== "sold-out") {
      setSelectedSlot(found);
    }
  };

  const handleSelectSlot = (slot: DepartureSlot) => {
    if (slot.status !== "sold-out") {
      setSelectedSlot(slot);
    }
  };

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0d0b] text-[#F8F7F2] overflow-x-hidden selection:bg-[#D4F938] selection:text-black">
      {/* Top Floating Navigation */}
      <HomeNavbar />

      {/* 1. Cinematic Hero Section */}
      <TripHero trip={trip} />

      {/* Main Content Layout with Sticky Booking Sidebar */}
      <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Storytelling, Itinerary, Details (Spans 8 columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 2. Key Information Cards */}
            <TripOverview trip={trip} />

            {/* 3. Interactive Photo Gallery & Lightbox */}
            <TripGallery images={trip.galleryImages} tripTitle={trip.title} />

            {/* 4. The Experience / Highlights */}
            <TripHighlights highlights={trip.experienceHighlights} />

            {/* 5. Day-wise Itinerary Accordion Timeline */}
            <TripItinerary itinerary={trip.itinerary} />

            {/* 6. Basecamp Accommodation Details */}
            <TripAccommodation accommodation={trip.accommodation} />

            {/* 7. Inclusions & Exclusions */}
            <TripInclusions inclusions={trip.inclusions} exclusions={trip.exclusions} />

            {/* 8. Available Departure Slots */}
            <TripDepartureSlots
              slots={trip.departureSlots}
              selectedSlotId={selectedSlot.id}
              onSelectSlot={handleSelectSlot}
            />

            {/* 9. Demonstration Student Reviews */}
            <TripReviews
              reviews={trip.reviews}
              rating={trip.rating}
              reviewsCount={trip.reviewsCount}
            />

            {/* 10. Frequently Asked Questions */}
            <TripFAQ faqs={trip.faqs} />
          </div>

          {/* Right Column: Sticky Booking Widget (Spans 4 columns) */}
          <div className="lg:col-span-4">
            <TripBookingCard
              trip={trip}
              selectedSlot={selectedSlot}
              onSelectSlotId={handleSelectSlotId}
              travellers={travellers}
              setTravellers={setTravellers}
              onBookClick={handleOpenBooking}
            />
          </div>
        </div>

        {/* 11. Related Expeditions */}
        <div className="mt-16">
          <TripRelated currentSlug={trip.slug} />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive WhatsApp Booking Enquiry Modal */}
      <WhatsAppEnquiryModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        trip={trip}
        selectedSlot={selectedSlot}
        initialTravellers={travellers}
      />
    </div>
  );
}
