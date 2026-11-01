import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FirestoreUser, UserProfileUpdate } from "@/types/firebase";

/**
 * Fetches the user profile document from Firestore.
 */
export async function getUserProfile(uid: string): Promise<FirestoreUser | null> {
  if (!uid) return null;

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as FirestoreUser;
  } catch (error) {
    console.error(`[usersService] Error fetching profile for uid "${uid}":`, error);
    throw error;
  }
}

/**
 * Updates a user's profile with strict field whitelisting.
 *
 * PERMITTED:
 * - displayName
 * - contactNumber
 *
 * FORBIDDEN (Throws Error):
 * - uid, email, role, isActive, createdAt, or any arbitrary keys
 */
export async function updateUserProfile(
  uid: string,
  updates: Record<string, any>
): Promise<void> {
  if (!uid) {
    throw new Error("User ID is required to update profile.");
  }

  // Security whitelist: check for illegal keys
  const forbiddenKeys = ["uid", "email", "role", "isActive", "createdAt", "adminNotes"];
  for (const key of forbiddenKeys) {
    if (key in updates) {
      throw new Error(`Security Violation: Field "${key}" cannot be modified by user.`);
    }
  }

  // Extract only whitelisted fields
  const safePayload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (typeof updates.displayName === "string") {
    safePayload.displayName = updates.displayName.trim();
  }

  if (typeof updates.contactNumber === "string" || updates.contactNumber === null) {
    safePayload.contactNumber = updates.contactNumber ? updates.contactNumber.trim() : null;
  }

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, safePayload);
  } catch (error) {
    console.error(`[usersService] Failed to update user profile for uid "${uid}":`, error);
    throw error;
  }
}

