import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FirestoreBooking } from "@/types/firebase";

function mapDocToBooking(id: string, data: DocumentData): FirestoreBooking {
  return {
    id,
    userId: data.userId || "",
    userEmail: data.userEmail || "",
    userName: data.userName || "",
    tripId: data.tripId || "",
    tripSlug: data.tripSlug || "",
    tripTitle: data.tripTitle || "Expedition",
    slotId: data.slotId || "",
    slotDate: data.slotDate || "",
    travellers: data.travellers || 1,
    totalAmount: data.totalAmount || 0,
    joiningType: data.joiningType || "solo",
    status: data.status || "pending_payment",
    expiresAt: data.expiresAt || null,
    confirmedAt: data.confirmedAt || null,
    rejectedAt: data.rejectedAt || null,
    rejectionReason: data.rejectionReason || null,
    adminNotes: data.adminNotes || null,
    seatsReleased: data.seatsReleased ?? false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function getLocalBookings(userId: string): FirestoreBooking[] {
  if (typeof window === "undefined") return [];
  const list: FirestoreBooking[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tnl_booking_")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const b = JSON.parse(raw);
          if (b && (b.userId === userId || !b.userId)) {
            list.push(b);
          }
        }
      }
    }
    // Also inspect sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("booking_")) {
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const b = JSON.parse(raw);
          if (b && (b.userId === userId || !b.userId) && !list.some((item) => item.id === b.id)) {
            list.push(b);
          }
        }
      }
    }
  } catch (e) {
    console.debug("[bookingsService] Local storage read note:", e);
  }
  return list;
}

/**
 * Fetches all bookings belonging to the given user ID.
 * Orders them descending by creation time.
 * Resiliently merges local session/storage reservations if Firestore is pending.
 */
export async function getUserBookings(userId: string): Promise<FirestoreBooking[]> {
  if (!userId) return [];

  const localList = getLocalBookings(userId);

  try {
    const bookingsRef = collection(db, "bookings");
    let serverBookings: FirestoreBooking[] = [];
    
    // First try with server-side ordering
    try {
      const q = query(
        bookingsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      serverBookings = snapshot.docs.map((docSnap) => mapDocToBooking(docSnap.id, docSnap.data()));
    } catch (orderError: any) {
      // If composite index is pending, fallback to un-indexed query and sort client-side
      console.warn("[bookingsService] Index may be pending, falling back to client sort:", orderError?.message);
      const fallbackQuery = query(bookingsRef, where("userId", "==", userId));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const bookings = fallbackSnapshot.docs.map((docSnap) =>
        mapDocToBooking(docSnap.id, docSnap.data())
      );
      serverBookings = bookings.sort((a, b) => {
        const tA = (a.createdAt as any)?.toMillis?.() ?? 0;
        const tB = (b.createdAt as any)?.toMillis?.() ?? 0;
        return tB - tA;
      });
    }

    // Merge server and local bookings (server takes priority)
    const combinedMap = new Map<string, FirestoreBooking>();
    for (const b of localList) {
      combinedMap.set(b.id, b);
    }
    for (const b of serverBookings) {
      combinedMap.set(b.id, b);
    }

    return Array.from(combinedMap.values());
  } catch (error) {
    console.warn(`[bookingsService] Firestore read fallback to local cache for user "${userId}":`, error);
    // Return local reservations if Firestore access is unavailable
    if (localList.length > 0) {
      return localList;
    }
    return [];
  }
}

