"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { Compass } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

const SESSION_KEY = "tnl_admin_verified";

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Optimistic initial check: if session storage already has verified admin, start with loading=false
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    }
    return false;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (pathname === "/admin/login") return false;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_KEY) !== "true";
    }
    return true;
  });

  const verifiedRef = useRef(isAdmin);

  useEffect(() => {
    verifiedRef.current = isAdmin;
  }, [isAdmin]);

  useEffect(() => {
    // If on login page, never block
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(SESSION_KEY);
        }
        setIsAdmin(false);
        setLoading(false);
        router.replace("/admin/login");
        return;
      }

      // If already verified in this session, skip remote Firestore network call
      if (verifiedRef.current) {
        setLoading(false);
        return;
      }

      try {
        // Safe timeout in case Firestore cloud connection is slow
        const fetchPromise = getDoc(doc(db, "users", currentUser.uid));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Firestore verification timeout")), 4000)
        );

        const userDocSnap = await Promise.race([fetchPromise, timeoutPromise]);

        if (userDocSnap && userDocSnap.exists() && userDocSnap.data().role === "admin") {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(SESSION_KEY, "true");
          }
          setIsAdmin(true);
        } else {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(SESSION_KEY);
          }
          setIsAdmin(false);
          router.replace("/admin/login?error=unauthorized");
        }
      } catch (err) {
        console.warn("[AdminGuard] Role verification note:", err);
        // If we were previously verified in session, keep access; otherwise redirect
        if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.replace("/admin/login?error=unauthorized");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e0c] flex flex-col items-center justify-center gap-5 select-none">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#D4F938]/30 border-t-[#D4F938] animate-spin" />
          <div className="absolute inset-1 rounded-full overflow-hidden bg-[#183D32] flex items-center justify-center p-1 shadow-[0_0_25px_rgba(212,249,56,0.25)]">
            <Image
              src="/images/logo.png"
              alt="THE NON LOCALS Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
        <p className="font-mono text-xs text-white/60 tracking-widest uppercase">
          Verifying Admin Credentials…
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
