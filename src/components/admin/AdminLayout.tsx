"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, render clean layout without sidebar
  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-[#0b0e0c]">{children}</main>;
  }

  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tnl_admin_verified");
      }
      await signOut(auth);
      router.push("/admin/login");
    } catch (e) {
      console.error("[AdminLayout] Sign out error:", e);
    }
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === "/admin",
    },
    {
      label: "Trip Catalog",
      href: "/admin/trips",
      icon: <Compass className="w-4 h-4" />,
      active: pathname.startsWith("/admin/trips"),
    },
    {
      label: "Departures & Slots",
      href: "/admin/departures",
      icon: <Calendar className="w-4 h-4" />,
      active: pathname.startsWith("/admin/departures"),
    },
    {
      label: "Website Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e0c] text-[#F8F7F2] flex select-none">
      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/10 bg-[#0c100e] p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand Header */}
          <Link href="/admin" className="block space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4F938]/40 bg-[#183D32] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,249,56,0.2)]">
                <Image
                  src="/images/logo.png"
                  alt="THE NON LOCALS Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-black text-lg text-white tracking-wider">
                THE NON LOCALS
              </span>
            </div>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#D4F938]">
              OPERATIONS PORTAL
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  item.active
                    ? "bg-[#183D32] text-[#D4F938] border border-[#D4F938]/30 shadow-[0_0_15px_rgba(212,249,56,0.1)]"
                    : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-white/60 hover:text-[#D4F938] hover:bg-white/5 transition-colors"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER & DRAWER ───────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c100e] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D4F938]/40 bg-[#183D32] flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="THE NON LOCALS Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-heading font-bold text-sm text-white">
            TNL ADMIN
          </span>
        </Link>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-white"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-md pt-16 p-6 flex flex-col justify-between">
          <nav className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider ${
                  item.active
                    ? "bg-[#183D32] text-[#D4F938]"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-white/70 bg-white/5"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-16 lg:pt-0">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

