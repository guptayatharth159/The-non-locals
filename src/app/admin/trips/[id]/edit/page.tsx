"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TripForm from "@/components/admin/TripForm";
import { Trip, SAMPLE_TRIPS } from "@/data/trips";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Compass } from "lucide-react";

export default function EditTripPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrip() {
      if (!tripId) return;
      setLoading(true);

      try {
        const tripRef = doc(db, "trips", tripId);
        const snap = await getDoc(tripRef);

        if (snap.exists()) {
          setTrip({ id: snap.id, ...(snap.data() as any) });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("[EditTripPage] Firestore fetch note:", e);
      }

      // Check sample trips fallback
      const foundSample = SAMPLE_TRIPS.find(
        (t) => t.id === tripId || t.slug === tripId
      );
      if (foundSample) {
        setTrip(foundSample);
      }
      setLoading(false);
    }

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 font-mono text-xs text-white/50">
        <Compass className="w-8 h-8 text-[#D4F938] mx-auto animate-spin" />
        <p>Loading expedition editor...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-24 text-center space-y-3 font-mono text-xs text-white/60">
        <p className="text-red-400">Expedition not found.</p>
      </div>
    );
  }

  return <TripForm initialTrip={trip} isNew={false} />;
}

