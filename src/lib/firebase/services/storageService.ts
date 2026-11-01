import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

/**
 * Uploads a trip cover image to Firebase Storage:
 * Path: /trips/{tripId}/cover_{timestamp}.{ext}
 */
export async function uploadTripCoverImage(
  tripId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const safeTripId = tripId.replace(/[^a-zA-Z0-9_-]/g, "");
  const path = `trips/${safeTripId}/cover_${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads a trip gallery image to Firebase Storage:
 * Path: /trips/{tripId}/gallery_{timestamp}_{random}.{ext}
 */
export async function uploadTripGalleryImage(
  tripId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const safeTripId = tripId.replace(/[^a-zA-Z0-9_-]/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const path = `trips/${safeTripId}/gallery_${Date.now()}_${randomSuffix}.${ext}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads the UPI QR image to Firebase Storage:
 * Path: /settings/upi-qr.{ext}
 */
export async function uploadUpiQrImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `settings/upi-qr_${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || "image/png",
  });

  return await getDownloadURL(snapshot.ref);
}

