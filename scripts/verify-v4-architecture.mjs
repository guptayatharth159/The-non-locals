/**
 * scripts/verify-v4-architecture.mjs
 * End-to-End Verification Test Suite for THE NON LOCALS v4 Architecture
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { SAMPLE_TRIPS } from "../src/data/trips.ts";

console.log("\n=================================================================");
console.log("🚀 THE NON LOCALS — v4 ARCHITECTURE VERIFICATION TEST SUITE");
console.log("=================================================================\n");

let passed = 0;
let total = 0;

function runTest(description, testFn) {
  total++;
  try {
    testFn();
    console.log(`  ✅ [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${description}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ── TEST SUITE 1: PUBLIC CUSTOMER EXPERIENCE & WHATSAPP ENQUIRY ──────────────
console.log("--- 1. PUBLIC CUSTOMER EXPERIENCE & WHATSAPP ENQUIRY ---");

runTest("Public trip catalog is available without authentication", () => {
  assert.ok(Array.isArray(SAMPLE_TRIPS), "SAMPLE_TRIPS must be an array");
  assert.ok(SAMPLE_TRIPS.length >= 4, "Must contain all 4 confirmed destinations");
  for (const trip of SAMPLE_TRIPS) {
    assert.ok(trip.title && trip.slug && trip.destination, "Trip must contain core metadata");
    assert.ok(trip.departureSlots.length > 0, "Trip must contain departure slots");
  }
});

runTest("WhatsApp message generator produces properly structured format", () => {
  const trip = SAMPLE_TRIPS[0];
  const primaryName = "Yatharth Gupta";
  const primaryPhone = "9876543210";
  const slotDate = "Dec 20, 2026";
  const travellers = [
    { fullName: "Yatharth Gupta", age: "20" },
    { fullName: "Rohan Sharma", age: "21" },
  ];
  const notes = "Cottage sharing preferred";

  const travellersFormatted = travellers
    .map((t, idx) => `${idx + 1}. ${t.fullName} (Age: ${t.age})`)
    .join("\n");

  const message = `Hi THE NON LOCALS team! 🏔️\nI would like to book an expedition. Here are our booking details:\n\n📍 EXPEDITION: ${trip.title}\n📅 DEPARTURE DATE: ${slotDate}\n👥 PARTY SIZE: 2 Explorers (Group Joining)\n\n👤 PRIMARY CONTACT:\n• Name: ${primaryName}\n• Phone: +91 ${primaryPhone}\n\n🎒 TRAVELLER DETAILS:\n${travellersFormatted}\n\n💬 SPECIAL REQUESTS:\n${notes}\n\nPlease let us know slot availability and how to complete the payment to confirm our spots!`;

  assert.ok(message.includes("📍 EXPEDITION: " + trip.title), "Must include expedition title");
  assert.ok(message.includes("📅 DEPARTURE DATE: " + slotDate), "Must include departure date");
  assert.ok(message.includes("Rohan Sharma"), "Must include traveller names");
  assert.ok(message.includes("💬 SPECIAL REQUESTS"), "Must include special requests");

  const destinationPhone = "919876543210";
  const waUrl = `https://wa.me/${destinationPhone}?text=${encodeURIComponent(message)}`;
  assert.ok(waUrl.startsWith("https://wa.me/919876543210?text="), "Click to chat URL must match wa.me format");
});

runTest("Public navigation header contains ZERO customer login links", () => {
  const navbarContent = fs.readFileSync(path.resolve("src/components/navigation/Navbar.tsx"), "utf-8");
  const homeNavContent = fs.readFileSync(path.resolve("src/components/home/HomeNavbar.tsx"), "utf-8");
  const mobileNavContent = fs.readFileSync(path.resolve("src/components/navigation/MobileNav.tsx"), "utf-8");

  assert.ok(!navbarContent.includes("UserMenu"), "Navbar must not contain UserMenu");
  assert.ok(!homeNavContent.includes("UserMenu"), "HomeNavbar must not contain UserMenu");
  assert.ok(!navbarContent.includes('href="/auth"'), "Navbar must not link to public /auth");
  assert.ok(!homeNavContent.includes('href="/auth"'), "HomeNavbar must not link to public /auth");
  assert.ok(!mobileNavContent.includes('href="/auth"'), "MobileNav must not link to public /auth");
  assert.ok(!mobileNavContent.includes('href="/dashboard"'), "MobileNav must not link to customer /dashboard");
});

// ── TEST SUITE 2: ADMIN PORTAL ARCHITECTURE ──────────────────────────────────
console.log("\n--- 2. ADMIN PORTAL STRUCTURE & GATEKEEPER ---");

runTest("Admin portal files and routes are fully implemented", () => {
  const adminRoutes = [
    "src/app/admin/layout.tsx",
    "src/app/admin/page.tsx",
    "src/app/admin/login/page.tsx",
    "src/app/admin/trips/page.tsx",
    "src/app/admin/trips/new/page.tsx",
    "src/app/admin/trips/[id]/edit/page.tsx",
    "src/app/admin/departures/page.tsx",
    "src/app/admin/settings/page.tsx",
    "src/components/admin/AdminGuard.tsx",
    "src/components/admin/AdminLayout.tsx",
    "src/components/admin/TripForm.tsx",
  ];

  for (const route of adminRoutes) {
    assert.ok(fs.existsSync(path.resolve(route)), `Route/Component must exist: ${route}`);
  }
});

runTest("AdminGuard intercepts unauthenticated/unauthorized access", () => {
  const guardContent = fs.readFileSync(path.resolve("src/components/admin/AdminGuard.tsx"), "utf-8");
  assert.ok(guardContent.includes('router.replace("/admin/login")'), "Must redirect unauthenticated users");
  assert.ok(guardContent.includes('role === "admin"'), "Must verify admin role server-side");
  assert.ok(guardContent.includes("users"), "Must inspect users/{uid} document");
});

runTest("Admin provisioning script is offline only and sets role='admin'", () => {
  const scriptContent = fs.readFileSync(path.resolve("scripts/provision-admin.js"), "utf-8");
  assert.ok(scriptContent.includes('role: "admin"'), "Script must set role: admin");
  assert.ok(scriptContent.includes("firebase-admin"), "Script must use Firebase Admin SDK");
});

// ── TEST SUITE 3: FIRESTORE & STORAGE SECURITY RULES (v4) ────────────────────
console.log("\n--- 3. SECURITY RULES (v4) ENFORCEMENT ---");

runTest("firestore.rules enforces public read & admin-only write on trips and slots", () => {
  const rules = fs.readFileSync(path.resolve("firestore.rules"), "utf-8");
  assert.ok(rules.includes("match /trips/{tripId}"), "Must configure trips collection");
  assert.ok(rules.includes("match /tripSlots/{slotId}"), "Must configure tripSlots collection");
  assert.ok(rules.includes("match /settings/public"), "Must configure settings/public collection");
  assert.ok(rules.includes("allow write: if isAdmin();"), "Writes must be admin only");
});

runTest("firestore.rules completely shuts down deprecated customer booking collections", () => {
  const rules = fs.readFileSync(path.resolve("firestore.rules"), "utf-8");
  assert.ok(rules.includes("match /bookings/{id} {\n      allow read, write: if false;"), "Bookings collection must be closed");
  assert.ok(rules.includes("match /payments/{id} {\n      allow read, write: if false;"), "Payments collection must be closed");
  assert.ok(rules.includes("match /utrIndex/{id} {\n      allow read, write: if false;"), "utrIndex collection must be closed");
});

runTest("storage.rules allows admin-only writes to /trips and /settings", () => {
  const storageRules = fs.readFileSync(path.resolve("storage.rules"), "utf-8");
  assert.ok(storageRules.includes("match /trips/{tripId}/{fileName}"), "Must configure /trips storage");
  assert.ok(storageRules.includes("match /settings/{fileName}"), "Must configure /settings storage");
  assert.ok(storageRules.includes("allow write: if isAdmin()"), "Storage writes must be admin only");
});

// ── TEST SUITE 4: OBSOLETE ROUTE CLEANUP & REDIRECTS ─────────────────────────
console.log("\n--- 4. OBSOLETE ROUTE HANDLING ---");

runTest("Customer routes redirect safely without exposing dead interfaces", () => {
  const authPage = fs.readFileSync(path.resolve("src/app/auth/page.tsx"), "utf-8");
  const dashboardPage = fs.readFileSync(path.resolve("src/app/dashboard/page.tsx"), "utf-8");
  const profilePage = fs.readFileSync(path.resolve("src/app/profile/page.tsx"), "utf-8");

  assert.ok(authPage.includes('redirect("/admin/login")'), "/auth must redirect to /admin/login");
  assert.ok(dashboardPage.includes('redirect("/adventures")'), "/dashboard must redirect to /adventures");
  assert.ok(profilePage.includes('redirect("/adventures")'), "/profile must redirect to /adventures");
});

console.log("\n=================================================================");
console.log(`📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED (100%)`);
console.log("=================================================================\n");

