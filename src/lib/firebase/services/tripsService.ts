import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Trip, DepartureSlot, SAMPLE_TRIPS } from "@/data/trips";

/**
 * Transforms a Firestore trip document to the frontend Trip interface.
 * Handles backward/forward compatibility between coverImage and image.
 */
function mapDocToTrip(id: string, data: DocumentData): Trip {
  return {
    id: id,
    slug: data.slug || id,
    title: data.title || "Untitled Expedition",
    destination: data.destination || "",
    state: data.state || "",
    duration: data.duration || "",
    durationDays: data.durationDays || 3,
    departureDate: data.departureDate || "Schedule TBA",
    departureMonth: data.departureMonth || "Fall 2026",
    departureLocation: data.departureLocation || "Delhi NCR Pickup Hub",
    maxGroupSize: data.maxGroupSize || 18,
    minAge: data.minAge || 18,
    price: data.price || 7499,
    originalPrice: data.originalPrice || 8999,
    availableSeats: typeof data.availableSeats === "number" ? data.availableSeats : 18,
    totalSeats: data.totalSeats || 18,
    category: data.category || "Backpacking",
    difficulty: data.difficulty || "Easy-Moderate",
    rating: data.rating,
    reviewsCount: data.reviewsCount,
    isSampleData: data.isSampleData ?? true,
    image: data.coverImage || data.image || "/images/hero-misty-lake-canoe.jpg",
    galleryImages: Array.isArray(data.galleryImages) && data.galleryImages.length > 0
      ? data.galleryImages
      : [data.coverImage || data.image || "/images/hero-misty-lake-canoe.jpg"],
    description: data.description || "",
    tagline: data.tagline || "",
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    experienceHighlights: Array.isArray(data.experienceHighlights) ? data.experienceHighlights : [],
    itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
    accommodation: data.accommodation || {
      type: "Mountain Homestay / Campsite",
      roomSharing: "Triple / Quad Sharing",
      description: "Comfortable verified stays with hot water and power backup.",
      amenities: ["Hot Water", "Power Backup", "Wi-Fi (subject to network)"],
    },
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
    departureSlots: Array.isArray(data.departureSlots) ? data.departureSlots : [],
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    featured: data.featured ?? false,
    published: data.published ?? true,
  };
}

/**
 * Fetches all published trips directly from Firestore.
 */
export async function getPublishedTripsFromFirestore(): Promise<Trip[]> {
  try {
    const tripsRef = collection(db, "trips");
    const q = query(tripsRef, where("published", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Check if trips exist without the explicit boolean published field
      const allQ = query(tripsRef);
      const allSnapshot = await getDocs(allQ);
      if (!allSnapshot.empty) {
        return allSnapshot.docs
          .map((docSnap) => mapDocToTrip(docSnap.id, docSnap.data()))
          .filter((t) => t.published !== false);
      }
      return [];
    }

    return snapshot.docs
      .map((docSnap) => mapDocToTrip(docSnap.id, docSnap.data()))
      .filter((t) => t.published !== false);
  } catch (error) {
    console.warn("[tripsService] Firestore getPublishedTrips error:", error);
    throw error;
  }
}

/**
 * Fetches a single trip by slug from Firestore.
 * Also queries the tripSlots collection if external slots exist.
 */
export async function getTripBySlugFromFirestore(slug: string): Promise<Trip | null> {
  try {
    const tripsRef = collection(db, "trips");
    const q = query(tripsRef, where("slug", "==", slug), where("published", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const tripData = docSnap.data();

    // Verify published status
    if (tripData.published === false) {
      return null;
    }

    const trip = mapDocToTrip(docSnap.id, tripData);

    // Check if slots exist in tripSlots collection
    try {
      const slotsRef = collection(db, "tripSlots");
      const slotsQ = query(slotsRef, where("tripSlug", "==", slug), where("published", "==", true));
      const slotsSnapshot = await getDocs(slotsQ);

      if (!slotsSnapshot.empty) {
        trip.departureSlots = slotsSnapshot.docs.map((slotDoc) => {
          const s = slotDoc.data();
          return {
            id: slotDoc.id,
            date: s.date || "Schedule TBA",
            endDate: s.endDate || "",
            month: s.month || "Fall 2026",
            price: s.price || trip.price,
            availableSeats: typeof s.availableSeats === "number" ? s.availableSeats : 18,
            totalSeats: s.totalSeats || 18,
            status: s.status || "available",
          } as DepartureSlot;
        });
      }
    } catch (slotErr) {
      // Non-fatal if slots collection is empty
      console.warn("[tripsService] Could not fetch standalone tripSlots:", slotErr);
    }

    return trip;
  } catch (error) {
    console.warn(`[tripsService] Firestore getTripBySlug error for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Service function with fallback:
 * Queries Firestore first. If Firestore has published trips, returns them.
 * If Firestore is empty (or encounters a network error), falls back gracefully to static data.
 */
export async function fetchTripsWithFallback(): Promise<{ trips: Trip[]; isLiveFirestore: boolean }> {
  try {
    const firestoreTrips = await getPublishedTripsFromFirestore();
    if (firestoreTrips.length > 0) {
      return { trips: firestoreTrips, isLiveFirestore: true };
    }
  } catch (err) {
    console.warn("[tripsService] Firestore unavailable, using static trip data fallback:", err);
  }

  // Graceful fallback to approved static trips (published only)
  const publishedSampleTrips = SAMPLE_TRIPS.filter((t) => t.published !== false);
  return { trips: publishedSampleTrips, isLiveFirestore: false };
}

/**
 * Seeds initial confirmed trips and slots into Firestore if the trips collection is empty.
 * This populates the database with client-approved data.
 */
export async function seedInitialTripsIfEmpty(): Promise<boolean> {
  try {
    const tripsRef = collection(db, "trips");
    const snapshot = await getDocs(tripsRef);

    if (!snapshot.empty) {
      // Already seeded
      return false;
    }

    // Seed the confirmed trips
    for (const trip of SAMPLE_TRIPS) {
      const tripRef = doc(db, "trips", trip.id);
      await setDoc(tripRef, {
        id: trip.id,
        slug: trip.slug,
        title: trip.title,
        destination: trip.destination,
        state: trip.state,
        duration: trip.duration,
        durationDays: trip.durationDays,
        departureLocation: trip.departureLocation,
        departureDate: trip.departureDate,
        departureMonth: trip.departureMonth,
        maxGroupSize: trip.maxGroupSize,
        minAge: trip.minAge,
        price: trip.price,
        originalPrice: trip.originalPrice,
        availableSeats: trip.availableSeats,
        totalSeats: trip.totalSeats,
        category: trip.category,
        difficulty: trip.difficulty,
        description: trip.description,
        tagline: trip.tagline,
        highlights: trip.highlights,
        inclusions: trip.inclusions,
        exclusions: trip.exclusions,
        itinerary: trip.itinerary,
        accommodation: trip.accommodation,
        experienceHighlights: trip.experienceHighlights,
        faqs: trip.faqs,
        coverImage: trip.image,
        galleryImages: trip.galleryImages,
        published: true,
        isSampleData: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: "system_init",
      });

      // Seed slots for this trip
      if (trip.departureSlots && trip.departureSlots.length > 0) {
        for (const slot of trip.departureSlots) {
          const slotRef = doc(db, "tripSlots", `${trip.slug}-${slot.id}`);
          await setDoc(slotRef, {
            id: `${trip.slug}-${slot.id}`,
            tripId: trip.id,
            tripSlug: trip.slug,
            date: slot.date,
            endDate: slot.endDate,
            month: slot.month,
            price: slot.price,
            totalSeats: slot.totalSeats,
            reservedSeats: 0,
            confirmedSeats: 0,
            availableSeats: slot.availableSeats,
            status: slot.status,
            expiryMinutes: 30,
            published: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    console.log("[tripsService] Successfully seeded trips and slots into Firestore.");
    return true;
  } catch (error) {
    console.error("[tripsService] Failed to seed initial trips:", error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN OPERATIONS (PRIVATE ADMIN PORTAL)
// ─────────────────────────────────────────────────────────────────────────────

// In-memory cache for admin operations to eliminate network latency on page navigation
let adminTripsCache: Trip[] | null = null;
let adminTripsCacheTime = 0;
let adminSlotsCache: Array<DepartureSlot & { tripId: string; tripSlug: string }> | null = null;
let adminSlotsCacheTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

export function invalidateAdminTripsCache() {
  adminTripsCache = null;
  adminTripsCacheTime = 0;
}

export function invalidateAdminSlotsCache() {
  adminSlotsCache = null;
  adminSlotsCacheTime = 0;
}

/**
 * Fetches all trips (including drafts) for admin management.
 * Uses cached data for instant sub-millisecond page transitions,
 * revalidating every 60s or immediately upon any create/edit/delete.
 */
export async function getAllTripsForAdmin(): Promise<Trip[]> {
  const now = Date.now();
  if (adminTripsCache && now - adminTripsCacheTime < CACHE_TTL_MS) {
    return adminTripsCache;
  }

  try {
    const tripsRef = collection(db, "trips");
    const snapshot = await getDocs(tripsRef);
    if (!snapshot.empty) {
      const trips = snapshot.docs.map((docSnap) => mapDocToTrip(docSnap.id, docSnap.data()));
      adminTripsCache = trips;
      adminTripsCacheTime = Date.now();
      return trips;
    }
  } catch (e) {
    console.warn("[tripsService] Admin fetch trips error, returning sample:", e);
  }

  adminTripsCache = SAMPLE_TRIPS;
  adminTripsCacheTime = Date.now();
  return SAMPLE_TRIPS;
}

/**
 * Creates or overwrites a trip in Firestore (Admin only).
 */
export async function saveTripByAdmin(tripData: Partial<Trip> & { id: string }): Promise<void> {
  invalidateAdminTripsCache();
  const tripRef = doc(db, "trips", tripData.id);
  await setDoc(
    tripRef,
    {
      ...tripData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Toggles a trip's published visibility flag.
 */
export async function toggleTripPublish(tripId: string, published: boolean): Promise<void> {
  invalidateAdminTripsCache();
  const tripRef = doc(db, "trips", tripId);
  await setDoc(tripRef, { published, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Deletes a trip document from Firestore (Admin only).
 */
export async function deleteTripByAdmin(tripId: string): Promise<void> {
  invalidateAdminTripsCache();
  const tripRef = doc(db, "trips", tripId);
  await deleteDoc(tripRef);
}

/**
 * Fetches all departure slots from tripSlots for admin management.
 * Uses cached data for instant sub-millisecond page transitions.
 */
export async function getAllSlotsForAdmin(): Promise<Array<DepartureSlot & { tripId: string; tripSlug: string }>> {
  const now = Date.now();
  if (adminSlotsCache && now - adminSlotsCacheTime < CACHE_TTL_MS) {
    return adminSlotsCache;
  }

  try {
    const slotsRef = collection(db, "tripSlots");
    const snapshot = await getDocs(slotsRef);
    if (!snapshot.empty) {
      const slots = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          tripId: d.tripId || "",
          tripSlug: d.tripSlug || "",
          date: d.date || "",
          endDate: d.endDate || "",
          month: d.month || "",
          price: d.price || 0,
          totalSeats: d.totalSeats || 18,
          availableSeats: d.availableSeats ?? d.totalSeats ?? 18,
          status: d.status || "available",
        };
      });
      adminSlotsCache = slots;
      adminSlotsCacheTime = Date.now();
      return slots;
    }
  } catch (e) {
    console.warn("[tripsService] Admin slots fetch note:", e);
  }

  // Fallback: extract from sample trips
  const slots: Array<DepartureSlot & { tripId: string; tripSlug: string }> = [];
  for (const t of SAMPLE_TRIPS) {
    for (const s of t.departureSlots) {
      slots.push({ ...s, tripId: t.id, tripSlug: t.slug });
    }
  }
  adminSlotsCache = slots;
  adminSlotsCacheTime = Date.now();
  return slots;
}

/**
 * Saves or updates a departure slot in tripSlots (Admin only).
 */
export async function saveSlotByAdmin(
  slotId: string,
  slotData: {
    tripId: string;
    tripSlug: string;
    date: string;
    endDate?: string;
    month?: string;
    price: number;
    totalSeats: number;
    availableSeats?: number;
    status: "available" | "filling-fast" | "sold-out" | "closed";
    published?: boolean;
  }
): Promise<void> {
  invalidateAdminSlotsCache();
  const slotRef = doc(db, "tripSlots", slotId);
  await setDoc(
    slotRef,
    {
      ...slotData,
      published: slotData.published ?? true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Deletes a departure slot from tripSlots (Admin only).
 */
export async function deleteSlotByAdmin(slotId: string): Promise<void> {
  invalidateAdminSlotsCache();
  const slotRef = doc(db, "tripSlots", slotId);
  await deleteDoc(slotRef);
}


