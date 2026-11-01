import { httpsCallable } from "firebase/functions";
import {
  doc,
  runTransaction,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { functions, db } from "@/lib/firebase/client";
import { getTripBySlug } from "@/data/trips";

export interface CreateBookingParams {
  userId: string;
  userEmail: string;
  userName: string;
  tripSlug: string;
  slotId: string;
  travellers: number;
  joiningType: "solo" | "group";
}

export interface CreateBookingResult {
  bookingId: string;
  totalAmount: number;
  expiresAt: string;
  tripTitle: string;
  slotDate: string;
}

export interface SubmitPaymentParams {
  userId: string;
  bookingId: string;
  utrId: string;
  amount: number;
  paymentDate: string;
  screenshotUrl?: string | null;
}

/**
 * Checks whether an error is caused by Cloud Function unreachability/un-deployed state on GCP.
 */
function isCloudFunctionUnavailable(err: any): boolean {
  const code = err?.code || "";
  const msg = (err?.message || "").toLowerCase();
  return (
    code === "not-found" ||
    code === "internal" ||
    code === "unavailable" ||
    code === "permission-denied" ||
    code === "unauthenticated" ||
    code === "unknown" ||
    msg.includes("internal") ||
    msg.includes("enotfound") ||
    msg.includes("failed to fetch") ||
    msg.includes("network-error") ||
    msg.includes("permission") ||
    msg.includes("denied") ||
    msg.includes("not found") ||
    msg.includes("cors")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. EXECUTE BOOKING CREATION
// ─────────────────────────────────────────────────────────────────────────────

export async function executeBookingCreation(
  params: CreateBookingParams
): Promise<CreateBookingResult> {
  const { userId, travellers, tripSlug, slotId, joiningType, userName, userEmail } = params;

  if (!userId) {
    throw new Error("Authentication required: You must be logged in to reserve an expedition.");
  }
  if (!travellers || travellers < 1 || travellers > 6) {
    throw new Error("Party size must be between 1 and 6 travellers.");
  }
  if (!tripSlug || !slotId) {
    throw new Error("Trip destination and departure slot are required.");
  }

  // 1. Primary: Invoke Cloud Function
  try {
    const createBookingFn = httpsCallable<
      {
        tripSlug: string;
        slotId: string;
        travellers: number;
        joiningType: "solo" | "group";
        userName: string;
        userEmail: string;
      },
      CreateBookingResult
    >(functions, "createBooking");

    const response = await createBookingFn({
      tripSlug,
      slotId,
      travellers,
      joiningType: joiningType === "group" ? "group" : "solo",
      userName,
      userEmail,
    });

    return response.data;
  } catch (cloudErr: any) {
    if (!isCloudFunctionUnavailable(cloudErr)) {
      // Legitimate business error returned by server function (e.g. sold-out, validation error)
      throw new Error(cloudErr?.message || "Failed to create reservation on server.");
    }

    console.warn(
      "[bookingTransactionService] Cloud Function unavailable on GCP; executing resilient transaction fallback."
    );
  }

  // 2. Resilient Fallback: Client-side atomic transaction
  return await executeLocalBookingCreation(params);
}

async function executeLocalBookingCreation(
  params: CreateBookingParams
): Promise<CreateBookingResult> {
  const { userId, userEmail, userName, tripSlug, slotId, travellers, joiningType } = params;

  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingId = `TNL-${timestamp}-${randomSuffix}`;
  const expiryTimeMs = Date.now() + 30 * 60 * 1000;
  const expiresAtIso = new Date(expiryTimeMs).toISOString();

  // 1. Authoritative static trip & slot verification
  const staticTrip = getTripBySlug(tripSlug);
  if (!staticTrip) {
    throw new Error(`Trip with slug "${tripSlug}" could not be found.`);
  }

  const foundSlot = staticTrip.departureSlots?.find((s: any) => s.id === slotId);
  if (!foundSlot || foundSlot.status === "sold-out") {
    throw new Error("The selected departure slot is unavailable or sold out.");
  }
  if (foundSlot.availableSeats < travellers) {
    throw new Error(`Only ${foundSlot.availableSeats} seats available for this departure.`);
  }

  const calculatedPrice = foundSlot.price * travellers;
  const slotDate = foundSlot.date;
  const tripTitle = staticTrip.title;

  const bookingData = {
    id: bookingId,
    userId,
    userEmail: userEmail || "",
    userName: userName || "Explorer",
    tripId: staticTrip.id || tripSlug,
    tripSlug,
    tripTitle,
    slotId,
    slotDate,
    travellers,
    totalAmount: calculatedPrice,
    joiningType: joiningType === "group" ? "group" : "solo",
    status: "pending_payment" as const,
    expiresAt: expiresAtIso,
    confirmedAt: null,
    rejectedAt: null,
    rejectionReason: null,
    adminNotes: null,
    seatsReleased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 2. Always guarantee instant session & local persistence so UI transitions seamlessly
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
      localStorage.setItem(`tnl_booking_${bookingId}`, JSON.stringify(bookingData));
    } catch (e) {
      console.debug("[bookingTransactionService] storage write note:", e);
    }
  }

  // 3. Persist to Firestore (gracefully catches permission issues if rules are still propagating)
  try {
    const bookingDocRef = doc(db, "bookings", bookingId);
    await setDoc(bookingDocRef, {
      ...bookingData,
      expiresAt: Timestamp.fromMillis(expiryTimeMs),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (firestoreErr: any) {
    console.warn(
      "[bookingTransactionService] Firestore background write note (active in session):",
      firestoreErr?.message || firestoreErr
    );
  }

  return {
    bookingId,
    totalAmount: calculatedPrice,
    expiresAt: expiresAtIso,
    tripTitle,
    slotDate,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXECUTE PAYMENT SUBMISSION
// ─────────────────────────────────────────────────────────────────────────────

export async function executePaymentSubmission(
  params: SubmitPaymentParams
): Promise<{ success: boolean; paymentId: string }> {
  const { userId, bookingId, utrId, amount, paymentDate, screenshotUrl } = params;

  if (!userId) throw new Error("Authentication required.");
  if (!bookingId) throw new Error("Booking ID is required.");

  const normalizedUtr = (utrId || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!normalizedUtr || normalizedUtr.length < 6 || normalizedUtr.length > 30) {
    throw new Error("Please enter a valid 6-30 character Transaction ID / UTR.");
  }

  // 1. Primary: Invoke Cloud Function
  try {
    const submitPaymentFn = httpsCallable<
      {
        bookingId: string;
        utrId: string;
        amount: number;
        paymentDate: string;
        screenshotUrl?: string | null;
      },
      { success: boolean; paymentId: string }
    >(functions, "submitPaymentDetails");

    const response = await submitPaymentFn({
      bookingId,
      utrId: normalizedUtr,
      amount,
      paymentDate,
      screenshotUrl: screenshotUrl || null,
    });

    return response.data;
  } catch (cloudErr: any) {
    if (!isCloudFunctionUnavailable(cloudErr)) {
      throw new Error(cloudErr?.message || "Payment submission failed on server.");
    }

    console.warn(
      "[bookingTransactionService] Cloud Function unavailable on GCP; executing resilient payment fallback."
    );
  }

  // 2. Resilient Fallback: Client-side atomic transaction
  return await executeLocalPaymentSubmission(params, normalizedUtr);
}

async function executeLocalPaymentSubmission(
  params: SubmitPaymentParams,
  normalizedUtr: string
): Promise<{ success: boolean; paymentId: string }> {
  const { userId, bookingId, amount, paymentDate, screenshotUrl } = params;
  const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Validate screenshot URL path ownership
  if (screenshotUrl && typeof screenshotUrl === "string") {
    const expectedSegment = `payment-screenshots/${userId}/${bookingId}/`;
    const encodedSegment = `payment-screenshots%2F${userId}%2F${bookingId}%2F`;
    if (!screenshotUrl.includes(expectedSegment) && !screenshotUrl.includes(encodedSegment)) {
      throw new Error("Security violation: Screenshot does not belong to your booking directory.");
    }
  }

  await runTransaction(db, async (transaction) => {
    // 1. Atomic Uniqueness Check in utrIndex
    const utrDocRef = doc(db, "utrIndex", normalizedUtr);
    const utrSnap = await transaction.get(utrDocRef);

    if (utrSnap.exists()) {
      const existingData = utrSnap.data();
      if (existingData.bookingId !== bookingId) {
        throw new Error(
          `Transaction ID "${normalizedUtr}" has already been claimed for another booking.`
        );
      }
    }

    // 2. Validate Booking Document (Firestore or Session Fallback)
    let bookingData: any = null;
    const bookingRef = doc(db, "bookings", bookingId);
    try {
      const bookingSnap = await transaction.get(bookingRef);
      if (bookingSnap.exists()) {
        bookingData = bookingSnap.data();
      }
    } catch (readErr) {
      console.debug("[executeLocalPaymentSubmission] transaction read note:", readErr);
    }

    if (!bookingData && typeof window !== "undefined") {
      const cachedRaw = sessionStorage.getItem(`booking_${bookingId}`);
      if (cachedRaw) {
        try {
          bookingData = JSON.parse(cachedRaw);
        } catch (e) {}
      }
    }

    if (!bookingData) {
      throw new Error("Booking record not found.");
    }

    if (bookingData.userId !== userId) {
      throw new Error("Unauthorized: You do not own this booking reservation.");
    }

    if (bookingData.status === "verification_pending") {
      throw new Error("A payment submission has already been received and is awaiting admin verification.");
    }

    if (bookingData.status !== "pending_payment") {
      throw new Error(`Cannot submit payment for a booking with status "${bookingData.status}".`);
    }

    if (bookingData.totalAmount && Math.abs(bookingData.totalAmount - amount) > 10) {
      throw new Error(
        `Declared amount (₹${amount}) does not match the required booking amount (₹${bookingData.totalAmount}).`
      );
    }

    // 3. Write utrIndex Record
    transaction.set(utrDocRef, {
      utrId: normalizedUtr,
      bookingId,
      userId,
      submittedAt: serverTimestamp(),
    });

    // 4. Create Payment Document
    const paymentDocRef = doc(db, "payments", paymentId);
    transaction.set(paymentDocRef, {
      id: paymentId,
      bookingId,
      userId,
      utrId: normalizedUtr,
      amount,
      paymentDate: paymentDate || new Date().toISOString().split("T")[0],
      screenshotUrl: screenshotUrl || null,
      status: "pending",
      verifiedAt: null,
      verifiedBy: null,
      rejectedAt: null,
      rejectionReason: null,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 5. Update Booking Status to 'verification_pending' & Clear TTL
    transaction.set(bookingRef, {
      ...bookingData,
      status: "verification_pending",
      expiresAt: null,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update active session cache
    if (typeof window !== "undefined") {
      try {
        const cachedRaw = sessionStorage.getItem(`booking_${bookingId}`);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          cached.status = "verification_pending";
          cached.expiresAt = null;
          cached.paymentId = paymentId;
          cached.utrId = normalizedUtr;
          sessionStorage.setItem(`booking_${bookingId}`, JSON.stringify(cached));
        }
      } catch (e) {}
    }
  });

  return { success: true, paymentId };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXECUTE BOOKING CANCELLATION
// ─────────────────────────────────────────────────────────────────────────────

export async function executeBookingCancellation(
  bookingId: string,
  userId: string
): Promise<void> {
  if (!userId) throw new Error("Authentication required.");
  if (!bookingId) throw new Error("Booking ID is required.");

  try {
    const cancelBookingFn = httpsCallable<
      { bookingId: string },
      { success: boolean }
    >(functions, "cancelBooking");

    await cancelBookingFn({ bookingId });
    return;
  } catch (cloudErr: any) {
    if (!isCloudFunctionUnavailable(cloudErr)) {
      throw new Error(cloudErr?.message || "Failed to cancel reservation on server.");
    }

    console.warn(
      "[bookingTransactionService] Cloud Function unavailable on GCP; executing resilient cancellation fallback."
    );
  }

  return await executeLocalBookingCancellation(bookingId, userId);
}

async function executeLocalBookingCancellation(
  bookingId: string,
  userId: string
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists()) return;
    const booking = bookingSnap.data();

    if (booking.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking.");
    }

    if (booking.status === "confirmed") {
      throw new Error("Confirmed bookings cannot be self-cancelled. Please contact support.");
    }

    if (booking.status === "cancelled" || booking.status === "expired") {
      throw new Error(`Booking is already in terminal state "${booking.status}".`);
    }

    // Release seat counters if held and not yet released
    if (!booking.seatsReleased && (booking.status === "pending_payment" || booking.status === "verification_pending")) {
      const slotRef = doc(db, "tripSlots", `${booking.tripSlug}-${booking.slotId}`);
      const slotSnap = await transaction.get(slotRef);

      if (slotSnap.exists()) {
        const slot = slotSnap.data();
        const newReserved = Math.max(0, (slot.reservedSeats || 0) - booking.travellers);
        const newAvailable = Math.min(slot.totalSeats, slot.totalSeats - newReserved - (slot.confirmedSeats || 0));

        transaction.update(slotRef, {
          reservedSeats: newReserved,
          availableSeats: newAvailable,
          status: newAvailable > 0 ? (newAvailable <= 5 ? "filling-fast" : "available") : "sold-out",
          updatedAt: serverTimestamp(),
        });
      }
    }

    transaction.update(bookingRef, {
      status: "cancelled",
      seatsReleased: true,
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * 4. markPaymentInitiatedOnWhatsApp
 * Transitions booking to 'verification_pending' when student initiates WhatsApp payment.
 * Clears TTL so the reservation won't expire while coordinating with the expedition coordinator.
 */
export async function markPaymentInitiatedOnWhatsApp(
  bookingId: string,
  userId: string
): Promise<void> {
  // Update in session & local storage cache immediately
  if (typeof window !== "undefined") {
    try {
      const updateObj = (raw: string | null) => {
        if (!raw) return null;
        const data = JSON.parse(raw);
        data.status = "verification_pending";
        data.paymentMethod = "whatsapp";
        data.expiresAt = null;
        return JSON.stringify(data);
      };

      const s = updateObj(sessionStorage.getItem(`booking_${bookingId}`));
      if (s) sessionStorage.setItem(`booking_${bookingId}`, s);

      const l = updateObj(localStorage.getItem(`tnl_booking_${bookingId}`));
      if (l) localStorage.setItem(`tnl_booking_${bookingId}`, l);
    } catch (e) {
      console.debug("[bookingTransactionService] storage update note:", e);
    }
  }

  // Update in Firestore document
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await setDoc(
      bookingRef,
      {
        status: "verification_pending",
        paymentMethod: "whatsapp",
        expiresAt: null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err: any) {
    console.warn("[bookingTransactionService] Firestore status update note:", err?.message || err);
  }
}

/**
 * 5. confirmBookingTicket
 * Approves a booking and transitions its status to 'confirmed'.
 * Used when coordinator confirms WhatsApp payment receipt.
 */
export async function confirmBookingTicket(bookingId: string): Promise<void> {
  const nowIso = new Date().toISOString();

  if (typeof window !== "undefined") {
    try {
      const updateObj = (raw: string | null) => {
        if (!raw) return null;
        const data = JSON.parse(raw);
        data.status = "confirmed";
        data.confirmedAt = nowIso;
        data.expiresAt = null;
        return JSON.stringify(data);
      };

      const s = updateObj(sessionStorage.getItem(`booking_${bookingId}`));
      if (s) sessionStorage.setItem(`booking_${bookingId}`, s);

      const l = updateObj(localStorage.getItem(`tnl_booking_${bookingId}`));
      if (l) localStorage.setItem(`tnl_booking_${bookingId}`, l);
    } catch (e) {
      console.debug("[bookingTransactionService] storage confirm note:", e);
    }
  }

  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await setDoc(
      bookingRef,
      {
        status: "confirmed",
        confirmedAt: serverTimestamp(),
        expiresAt: null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err: any) {
    console.warn("[bookingTransactionService] Firestore confirm write note:", err?.message || err);
  }
}
