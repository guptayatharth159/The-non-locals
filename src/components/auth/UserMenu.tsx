"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/useAuth";

export default function UserMenu() {
  const { firebaseUser, userProfile, signOut, isAdmin, loading, profileLoading } =
    useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Not signed in ────────────────────────────────────────────────────────
  if (loading || (!firebaseUser && !loading)) return null;

  const displayName =
    userProfile?.displayName ?? firebaseUser?.displayName ?? "User";
  const photoURL =
    userProfile?.photoURL ?? firebaseUser?.photoURL ?? null;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={profileLoading}
        className="flex items-center gap-2 p-1 pr-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer group"
        aria-label="User menu"
        aria-expanded={open}
      >
        {/* Avatar image or initials */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#183D32] border border-white/20 flex items-center justify-center shrink-0">
          {photoURL ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoURL}
              alt={displayName}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="font-heading font-bold text-xs text-[#D4F938]">
              {initials}
            </span>
          )}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block font-heading font-semibold text-xs text-white group-hover:text-[#D4F938] transition-colors max-w-[100px] truncate">
          {profileLoading ? "…" : displayName.split(" ")[0]}
        </span>

        {/* Admin badge */}
        {isAdmin && (
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4F938] shrink-0" />
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0c0f0d]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="font-heading font-bold text-sm text-white truncate">
                {displayName}
              </p>
              <p className="font-mono text-[10px] text-white/50 truncate">
                {firebaseUser?.email}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] font-mono text-[9px] uppercase">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
            </div>

            {/* Menu items */}
            <nav className="p-2 space-y-0.5">
              {isAdmin && (
                <MenuLink
                  href="/admin"
                  icon={<ShieldCheck className="w-4 h-4" />}
                  label="Admin Dashboard"
                  onClick={() => setOpen(false)}
                  highlight
                />
              )}
              <MenuLink
                href="/dashboard"
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="My Dashboard"
                onClick={() => setOpen(false)}
              />
              <MenuLink
                href="/profile"
                icon={<User className="w-4 h-4" />}
                label="My Profile"
                onClick={() => setOpen(false)}
              />
            </nav>

            {/* Sign out */}
            <div className="p-2 border-t border-white/10">
              <button
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper
// ─────────────────────────────────────────────────────────────────────────────

function MenuLink({
  href,
  icon,
  label,
  onClick,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
        highlight
          ? "text-[#D4F938] hover:bg-[#183D32]/60"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

