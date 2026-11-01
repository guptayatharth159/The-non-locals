import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. onUserCreate
 * Auth trigger: creates users/{uid} document with default role "user".
 * Idempotent: does not overwrite if already created.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const userRef = db.doc(`users/${user.uid}`);
  const snap = await userRef.get();

  if (!snap.exists) {
    await userRef.set({
      uid: user.uid,
      displayName: user.displayName || "Explorer",
      email: user.email || "",
      photoURL: user.photoURL || null,
      contactNumber: null,
      role: "user",
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
});

/**
 * 2. createBooking (Callable Cloud Function)
 * Atomically validates trip, slot, and available seats.
 * Reserves seats and creates booking with status 'pending_payment'.
 */
export const createBooking = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required: You must be signed in to create a booking reservation."
    );
  }

  const { tripSlug, slotId, travellers, joiningType, userName, userEmail } = data;
  const userId = context.auth.uid;

  if (!travellers || typeof travellers !== "number" || travellers < 1 || travellers > 6) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Party size must be between 1 and 6 travellers."
    );
  }

  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingId = `TNL-${timestamp}-${randomSuffix}`;
  const expiryTimeMs = Date.now() + 30 * 60 * 1000; // 30-minute reservation window
  const expiresAt = admin.firestore.Timestamp.fromMillis(expiryTimeMs);

  let calculatedPrice = 0;
  let tripTitle = "";
  let slotDate = "";

  await db.runTransaction(async (transaction) => {
    // 1. Fetch trip document
    const tripRef = db.doc(`trips/${tripSlug}`);
    const tripSnap = await transaction.get(tripRef);

    if (!tripSnap.exists || tripSnap.data()?.published === false) {
      throw new functions.https.HttpsError(
        "not-found",
        "The requested expedition is not currently published."
      );
    }

    const tripData = tripSnap.data()!;
    tripTitle = tripData.title;

    // 2. Fetch departure slot
    const slotDocRef = db.doc(`tripSlots/${tripSlug}-${slotId}`);
    const slotSnap = await transaction.get(slotDocRef);

    if (!slotSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Departure slot not found.");
    }

    const slotData = slotSnap.data()!;
    if (slotData.published === false || slotData.status === "sold-out") {
      throw new functions.https.HttpsError("failed-precondition", "Selected slot is unavailable.");
    }

    if (slotData.availableSeats < travellers) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        `Only ${slotData.availableSeats} seats remaining for this departure. Cannot reserve ${travellers} seats.`
      );
    }

    // Authoritative server-side price computation
    calculatedPrice = slotData.price * travellers;
    slotDate = slotData.date;

    // 3. Atomically update slot counters
    const newReserved = (slotData.reservedSeats || 0) + travellers;
    const newAvailable = Math.max(0, slotData.totalSeats - newReserved - (slotData.confirmedSeats || 0));
    const newStatus = newAvailable === 0 ? "sold-out" : newAvailable <= 5 ? "filling-fast" : "available";

    transaction.update(slotDocRef, {
      reservedSeats: newReserved,
      availableSeats: newAvailable,
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Create booking document (Status: pending_payment)
    const bookingRef = db.doc(`bookings/${bookingId}`);
    transaction.set(bookingRef, {
      id: bookingId,
      userId,
      userEmail: userEmail || context.auth?.token.email || "",
      userName: userName || context.auth?.token.name || "Explorer",
      tripId: tripData.id || tripSlug,
      tripSlug,
      tripTitle,
      slotId,
      slotDate,
      travellers,
      totalAmount: calculatedPrice,
      joiningType: joiningType === "group" ? "group" : "solo",
      status: "pending_payment",
      expiresAt,
      confirmedAt: null,
      rejectedAt: null,
      rejectionReason: null,
      adminNotes: null,
      seatsReleased: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return {
    bookingId,
    totalAmount: calculatedPrice,
    expiresAt: new Date(expiryTimeMs).toISOString(),
    tripTitle,
    slotDate,
  };
});

/**
 * 3. submitPaymentDetails (Callable Cloud Function)
 * Validates UTR uniqueness, payment amount, screenshot path ownership,
 * and moves status to 'verification_pending'.
 */
export const submitPaymentDetails = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, utrId, amount, paymentDate, screenshotUrl } = data;
  const userId = context.auth.uid;

  // Validate UTR format
  const normalizedUtr = (utrId || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!normalizedUtr || normalizedUtr.length < 6 || normalizedUtr.length > 30) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Please enter a valid 6-30 character Transaction ID / UTR."
    );
  }

  // Validate screenshot URL path ownership (prevent submitting another user's file)
  if (screenshotUrl && typeof screenshotUrl === "string") {
    const expectedPathSegment = `payment-screenshots/${userId}/${bookingId}/`;
    const encodedSegment = `payment-screenshots%2F${userId}%2F${bookingId}%2F`;
    if (!screenshotUrl.includes(expectedPathSegment) && !screenshotUrl.includes(encodedSegment)) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Security violation: The screenshot does not belong to your booking upload directory."
      );
    }
  }

  const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  await db.runTransaction(async (transaction) => {
    // 1. Uniqueness check against utrIndex
    const utrRef = db.doc(`utrIndex/${normalizedUtr}`);
    const utrSnap = await transaction.get(utrRef);

    if (utrSnap.exists) {
      throw new functions.https.HttpsError(
        "already-exists",
        `Transaction ID / UTR "${normalizedUtr}" has already been claimed for another booking.`
      );
    }

    // 2. Validate booking ownership and status
    const bookingRef = db.doc(`bookings/${bookingId}`);
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Booking record not found.");
    }

    const booking = bookingSnap.data()!;
    if (booking.userId !== userId) {
      throw new functions.https.HttpsError("permission-denied", "Unauthorized: You do not own this booking.");
    }

    // Disallow duplicate submissions if already verification_pending
    if (booking.status === "verification_pending") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "A payment submission has already been received for this booking and is currently awaiting admin verification."
      );
    }

    // Disallow submission for terminal or confirmed statuses
    if (booking.status !== "pending_payment") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `Cannot submit payment for a booking with status "${booking.status}".`
      );
    }

    // Enforce exact amount match
    if (typeof amount !== "number" || amount !== booking.totalAmount) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Submitted amount (₹${amount}) does not match the authoritative booking amount (₹${booking.totalAmount}).`
      );
    }

    // 3. Write utrIndex document (Guarantees atomic uniqueness across all bookings)
    transaction.set(utrRef, {
      utrId: normalizedUtr,
      bookingId,
      userId,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Create payment record
    const paymentRef = db.doc(`payments/${paymentId}`);
    transaction.set(paymentRef, {
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
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5. Update booking status to 'verification_pending' & clear TTL so it won't auto-expire
    transaction.update(bookingRef, {
      status: "verification_pending",
      expiresAt: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { success: true, paymentId };
});

/**
 * 4. cancelBooking (Callable Cloud Function)
 * Allows users to cancel their own pending reservations.
 * Releases reserved seats atomically and idempotently.
 */
export const cancelBooking = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId } = data;
  const userId = context.auth.uid;

  if (!bookingId) {
    throw new functions.https.HttpsError("invalid-argument", "Booking ID is required.");
  }

  await db.runTransaction(async (transaction) => {
    const bookingRef = db.doc(`bookings/${bookingId}`);
    const bookingSnap = await transaction.get(bookingRef);

    if (!bookingSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Booking not found.");
    }

    const booking = bookingSnap.data()!;
    if (booking.userId !== userId) {
      throw new functions.https.HttpsError("permission-denied", "Unauthorized access.");
    }

    if (booking.status === "cancelled" || booking.status === "expired") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `Booking is already in terminal state "${booking.status}".`
      );
    }

    if (booking.status === "confirmed") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Confirmed bookings cannot be cancelled by the student. Please contact the expedition coordinator."
      );
    }

    // Release seats on slot if not already released
    if (!booking.seatsReleased && (booking.status === "pending_payment" || booking.status === "verification_pending")) {
      const slotRef = db.doc(`tripSlots/${booking.tripSlug}-${booking.slotId}`);
      const slotSnap = await transaction.get(slotRef);

      if (slotSnap.exists) {
        const slot = slotSnap.data()!;
        const newReserved = Math.max(0, (slot.reservedSeats || 0) - booking.travellers);
        const newAvailable = Math.min(slot.totalSeats, slot.totalSeats - newReserved - (slot.confirmedSeats || 0));

        transaction.update(slotRef, {
          reservedSeats: newReserved,
          availableSeats: newAvailable,
          status: newAvailable > 0 ? (newAvailable <= 5 ? "filling-fast" : "available") : "sold-out",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    transaction.update(bookingRef, {
      status: "cancelled",
      seatsReleased: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { success: true };
});

/**
 * 5. expireBookings (Scheduled Cloud Function)
 * Runs every 5 minutes.
 * Idempotently releases seats for expired 'pending_payment' bookings.
 * Does NOT expire 'verification_pending' bookings.
 */
export const expireBookings = functions.pubsub.schedule("every 5 minutes").onRun(async () => {
  const now = admin.firestore.Timestamp.now();
  const snapshot = await db
    .collection("bookings")
    .where("status", "==", "pending_payment")
    .where("expiresAt", "<=", now)
    .get();

  if (snapshot.empty) return null;

  for (const docSnap of snapshot.docs) {
    const bookingId = docSnap.id;
    await db.runTransaction(async (transaction) => {
      const bRef = db.doc(`bookings/${bookingId}`);
      const bSnap = await transaction.get(bRef);
      if (!bSnap.exists) return;
      const bData = bSnap.data()!;

      // Idempotency: skip if seats already released or status changed
      if (bData.seatsReleased || bData.status !== "pending_payment") return;

      // Release seats on slot
      const slotRef = db.doc(`tripSlots/${bData.tripSlug}-${bData.slotId}`);
      const slotSnap = await transaction.get(slotRef);

      if (slotSnap.exists) {
        const slot = slotSnap.data()!;
        const newReserved = Math.max(0, (slot.reservedSeats || 0) - bData.travellers);
        const newAvailable = Math.min(slot.totalSeats, slot.totalSeats - newReserved - (slot.confirmedSeats || 0));

        transaction.update(slotRef, {
          reservedSeats: newReserved,
          availableSeats: newAvailable,
          status: newAvailable > 0 ? (newAvailable <= 5 ? "filling-fast" : "available") : "sold-out",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      transaction.update(bRef, {
        status: "expired",
        seatsReleased: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  }

  return null;
});
