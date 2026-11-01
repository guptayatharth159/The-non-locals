import type { Timestamp } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

export interface FirestoreUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  contactNumber: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Fields a user may update themselves
export type UserProfileUpdate = Pick<FirestoreUser, "displayName" | "contactNumber">;

// ─────────────────────────────────────────────────────────────────────────────
// Trip
// ─────────────────────────────────────────────────────────────────────────────

export interface FirestoreItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  altitude?: string;
  distance?: string;
  stayType?: string;
}

export interface FirestoreAccommodation {
  type: string;
  roomSharing: string;
  description: string;
  amenities: string[];
  notes?: string;
  image?: string;
}

export interface FirestoreTripHighlight {
  title: string;
  description: string;
  iconName: string;
}

export interface FirestoreFAQItem {
  question: string;
  answer: string;
}

export interface FirestoreTrip {
  id: string;
  slug: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  departureLocation: string;
  maxGroupSize: number;
  minAge: number;
  category: string;
  difficulty: string;
  description: string;
  tagline: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: FirestoreItineraryDay[];
  accommodation: FirestoreAccommodation;
  experienceHighlights: FirestoreTripHighlight[];
  faqs: FirestoreFAQItem[];
  coverImage: string;
  galleryImages: string[];
  published: boolean;
  isSampleData: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Trip Slot
// ─────────────────────────────────────────────────────────────────────────────

export type SlotStatus = "available" | "filling-fast" | "sold-out" | "closed";

export interface FirestoreTripSlot {
  id: string;
  tripId: string;
  tripSlug: string;
  date: string;
  endDate: string;
  month: string;
  price: number;
  totalSeats: number;
  reservedSeats: number;
  confirmedSeats: number;
  availableSeats: number;
  status: SlotStatus;
  expiryMinutes: number;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking
// ─────────────────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending_payment"
  | "verification_pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "expired";

export type JoiningType = "solo" | "group";

export interface FirestoreBooking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  tripId: string;
  tripSlug: string;
  tripTitle: string;
  slotId: string;
  slotDate: string;
  travellers: number;
  totalAmount: number;
  joiningType: JoiningType;
  status: BookingStatus;
  paymentMethod?: "whatsapp" | "upi_manual";
  expiresAt: Timestamp | null;
  confirmedAt: Timestamp | null;
  rejectedAt: Timestamp | null;
  rejectionReason: string | null;
  adminNotes: string | null;
  seatsReleased: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "verified" | "rejected";

export interface FirestorePayment {
  id: string;
  bookingId: string;
  userId: string;
  utrId: string;
  amount: number;
  paymentDate: string;
  screenshotUrl: string | null;
  status: PaymentStatus;
  verifiedAt: Timestamp | null;
  verifiedBy: string | null;
  rejectedAt: Timestamp | null;
  rejectionReason: string | null;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTR Index (duplicate prevention — internal to Cloud Functions)
// ─────────────────────────────────────────────────────────────────────────────

export interface FirestoreUtrIndex {
  utrId: string;
  bookingId: string;
  userId: string;
  submittedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "booking_confirmed"
  | "booking_rejected"
  | "payment_received"
  | "general";

export interface FirestoreNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  bookingId: string | null;
  read: boolean;
  createdAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonial
// ─────────────────────────────────────────────────────────────────────────────

export interface FirestoreTestimonial {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string | null;
  tripId: string;
  tripTitle: string;
  rating: number;
  comment: string;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings (public document)
// ─────────────────────────────────────────────────────────────────────────────

export interface FirestorePublicSettings {
  agencyUpiId: string;
  agencyUpiName: string;
  upiQrImageUrl: string;
  whatsappNumber: string;
  paymentInstructions: string;
  maxTravellersPerBooking: number;
  pendingBookingExpiryMinutes: number;
  updatedAt: Timestamp;
}

