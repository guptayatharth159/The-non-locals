"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { FirestoreUser } from "@/types/firebase";

// ─────────────────────────────────────────────────────────────────────────────
// Context Shape
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Firebase Auth user object — null when signed out */
  firebaseUser: User | null;
  /** Full Firestore user profile — null when signed out or still loading */
  userProfile: FirestoreUser | null;
  /** True while the initial auth state or profile document is being resolved */
  loading: boolean;
  /** True while the Firestore user document is being created by the Cloud Function */
  profileLoading: boolean;
  /** Sign in with Google popup */
  signIn: () => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Convenience: true when the user has role = "admin" */
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

const PROFILE_POLL_MAX_ATTEMPTS = 8;
const PROFILE_POLL_BASE_DELAY_MS = 500;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Subscribe to Firestore user document with automatic fallback ────────────
  const subscribeToProfile = useCallback(
    (user: User) => {
      setProfileLoading(true);
      const userRef = doc(db, "users", user.uid);

      // Default baseline profile from Google credentials
      const baselineProfile: FirestoreUser = {
        uid: user.uid,
        displayName: user.displayName || "Explorer",
        email: user.email || "",
        photoURL: user.photoURL || null,
        contactNumber: null,
        role: "user",
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      let unsubscribe: (() => void) | null = null;

      // 0. Safety timer: Never let the student get blocked on the "Setting up your profile" screen
      const safetyTimeout = setTimeout(() => {
        setUserProfile((current) => current || baselineProfile);
        setProfileLoading(false);
      }, 1500);

      // 1. Listen in real-time to changes in Firestore
      unsubscribe = onSnapshot(
        userRef,
        (docSnap) => {
          clearTimeout(safetyTimeout);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as FirestoreUser);
            setProfileLoading(false);
          } else {
            // Profile doc doesn't exist yet in Firestore — attempt to initialize it
            setDoc(userRef, {
              ...baselineProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }, { merge: true })
              .catch((err) => {
                console.warn("[AuthContext] Firestore write pending/blocked:", err);
              })
              .finally(() => {
                // Ensure user profile is immediately available in memory
                setUserProfile((current) => current || baselineProfile);
                setProfileLoading(false);
              });
          }
        },
        (err) => {
          clearTimeout(safetyTimeout);
          // If Firestore Security Rules or offline mode denies read, use baseline Google profile
          console.warn("[AuthContext] Firestore read error, using fallback profile:", err);
          setUserProfile(baselineProfile);
          setProfileLoading(false);
        }
      );

      return () => {
        clearTimeout(safetyTimeout);
        if (unsubscribe) unsubscribe();
      };
    },
    []
  );

  // ── Listen to Firebase Auth state ─────────────────────────────────────────
  useEffect(() => {
    let cleanupProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (cleanupProfile) {
        cleanupProfile();
        cleanupProfile = undefined;
      }

      setFirebaseUser(user);

      if (user) {
        cleanupProfile = subscribeToProfile(user);
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (cleanupProfile) cleanupProfile();
    };
  }, [subscribeToProfile]);

  // ── Sign in with Google ───────────────────────────────────────────────────
  const signIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    // Request the user's email and profile
    provider.addScope("email");
    provider.addScope("profile");
    await signInWithPopup(auth, provider);
    // Auth state listener above handles everything after sign-in
  }, []);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    // Auth state listener sets firebaseUser and userProfile to null
  }, []);

  const isAdmin = userProfile?.role === "admin";

  const value: AuthContextValue = {
    firebaseUser,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

