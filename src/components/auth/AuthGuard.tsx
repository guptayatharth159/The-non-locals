"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If true, also requires the user to have role="admin" */
  requireAdmin?: boolean;
  /** Where to redirect unauthenticated users (default: /auth) */
  redirectTo?: string;
}

/**
 * Client-side UX route guard.
 *
 * IMPORTANT: This is a convenience layer only.
 * All real authorization is enforced by Firestore Security Rules
 * and Cloud Functions on the server side.
 */
export default function AuthGuard({
  children,
  requireAdmin = false,
  redirectTo = "/auth",
}: AuthGuardProps) {
  const { firebaseUser, userProfile, loading, profileLoading } = useAuth();
  const router = useRouter();

  // ── Still resolving auth state ─────────────────────────────────────────────
  if (loading) {
    return <AuthLoadingScreen message="Checking your session…" />;
  }

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!firebaseUser) {
    router.replace(redirectTo);
    return null;
  }

  // ── Signed in but profile loading ─────────────────────────────────────────
  if (profileLoading && !userProfile) {
    return <AuthLoadingScreen message="Setting up your profile…" />;
  }

  // ── Admin check ────────────────────────────────────────────────────────────
  if (requireAdmin && userProfile?.role !== "admin") {
    router.replace("/dashboard");
    return null;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading Screen (on-brand)
// ─────────────────────────────────────────────────────────────────────────────

function AuthLoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0b0e0c] flex flex-col items-center justify-center gap-5 select-none">
      {/* Mountain icon */}
      <div className="w-14 h-14 rounded-full bg-[#183D32] border border-[#D4F938]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,249,56,0.12)]">
        <svg
          className="w-7 h-7 text-[#D4F938] fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3l4 8 5-5 5 11H2L8 3z" />
        </svg>
      </div>

      {/* Spinner ring */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#D4F938] animate-spin" />
      </div>

      <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
        {message}
      </p>
    </div>
  );
}

