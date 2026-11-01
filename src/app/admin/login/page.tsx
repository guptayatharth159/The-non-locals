"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { ShieldCheck, AlertCircle, ArrowRight, Compass } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasUnauthorizedError = searchParams.get("error") === "unauthorized";

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    hasUnauthorizedError
      ? "Access Denied: Your account does not have authorized administrator privileges."
      : null
  );

  const handleAdminGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const uid = userCred.user.uid;

      // Verify admin role in Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        router.push("/admin");
      } else {
        setErrorMsg(
          `Access Denied: Account (${userCred.user.email}) is not provisioned as an administrator. Please contact the project owner to grant admin access via offline credentials.`
        );
        // Sign out unauthorized user
        await auth.signOut();
      }
    } catch (err: any) {
      console.error("[AdminLogin] Sign in error:", err);
      setErrorMsg(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e0c] text-[#F8F7F2] flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-[#183D32]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-[#D4F938]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0c100e]/90 backdrop-blur-2xl border border-white/15 p-8 sm:p-10 shadow-2xl space-y-8 text-center">
        {/* Brand Logo Badge */}
        <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D4F938]/40 bg-[#183D32] flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(212,249,56,0.25)]">
          <Image
            src="/images/logo.png"
            alt="THE NON LOCALS Logo"
            width={80}
            height={80}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-[#D4F938] uppercase tracking-widest font-semibold block">
            PRIVATE ACCESS ONLY
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            ADMIN OPERATIONS PORTAL
          </h1>
          <p className="font-body text-xs text-white/60">
            Sign in with your authorized administrator Google account to manage expeditions, departures, and website settings.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-mono flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Sign In CTA */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleAdminGoogleSignIn}
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] active:scale-[0.99] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(212,249,56,0.4)] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Compass className="w-4 h-4 animate-spin" />
                <span>Verifying Role...</span>
              </>
            ) : (
              <>
                <span>Sign In with Admin Google Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-white/40 space-y-1">
          <p>🔒 Server-side role provisioning required.</p>
          <p>Public users cannot self-assign administrator privileges.</p>
        </div>
      </div>
    </div>
  );
}

