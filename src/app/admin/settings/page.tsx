"use client";

import React, { useEffect, useState } from "react";
import {
  getPublicSettings,
  updatePublicSettings,
  PublicWebsiteSettings,
} from "@/lib/firebase/services/settingsService";
import { uploadUpiQrImage } from "@/lib/firebase/services/storageService";
import {
  Settings,
  Save,
  MessageCircle,
  Phone,
  Mail,
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  Compass,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PublicWebsiteSettings>({
    whatsappNumber: "",
    backupPhone: "",
    supportEmail: "",
    agencyUpiId: "",
    agencyUpiName: "THE NON LOCALS",
    upiQrImageUrl: "",
    paymentInstructions: "",
    instagramUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const data = await getPublicSettings();
        setSettings(data);
      } catch (e) {
        console.warn("[AdminSettings] Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    try {
      const url = await uploadUpiQrImage(file);
      setSettings((prev) => ({ ...prev, upiQrImageUrl: url }));
      setFeedback("UPI QR code uploaded successfully to Firebase Storage!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error("[AdminSettings] QR upload error:", err);
      setErrorMsg("Failed to upload QR code image.");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    setErrorMsg(null);

    // Sanitize WhatsApp number (must have digits)
    const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, "");
    if (!cleanWhatsApp || cleanWhatsApp.length < 10) {
      setErrorMsg("Please enter a valid 10+ digit WhatsApp business number.");
      setSaving(false);
      return;
    }

    try {
      await updatePublicSettings({
        ...settings,
        whatsappNumber: cleanWhatsApp,
      });
      setFeedback("Website and WhatsApp settings successfully updated in Firestore!");
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      console.error("[AdminSettings] Save error:", err);
      setErrorMsg("Failed to update settings in Firestore.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 font-mono text-xs text-white/50">
        <Compass className="w-8 h-8 text-[#D4F938] mx-auto animate-spin" />
        <p>Loading website settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8 select-none max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4F938] font-bold">
            CONFIGURATION
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            WEBSITE SETTINGS
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/60">
            Configure the official WhatsApp booking line, business contacts, and payment reference information.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,56,0.3)] cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── 1. OFFICIAL WHATSAPP BOOKING LINE ─────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-white uppercase">
              1. Official WhatsApp Booking Number
            </h2>
            <p className="font-mono text-[11px] text-white/50">
              This number powers the &ldquo;Continue with WhatsApp&rdquo; booking buttons across the entire website.
            </p>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-xs max-w-md">
          <label className="block text-white/60 uppercase">
            WhatsApp Business Number (with country code, e.g. 919876543210) *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3.5 rounded-l-xl bg-white/5 border border-r-0 border-white/15 text-white/60 font-mono text-xs">
              +
            </span>
            <input
              type="text"
              required
              value={settings.whatsappNumber}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))
              }
              placeholder="919876543210"
              className="w-full px-3.5 py-2.5 rounded-r-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>
          <span className="block text-[10px] text-white/40">
            Current destination: https://wa.me/{settings.whatsappNumber.replace(/[^0-9]/g, "")}
          </span>
        </div>
      </div>

      {/* ── 2. BUSINESS CONTACT DETAILS ───────────────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-white uppercase">
              2. Business Contact Information
            </h2>
            <p className="font-mono text-[11px] text-white/50">
              General support and emergency contacts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))
              }
              placeholder="hello@thenonlocals.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Backup / Calling Phone</label>
            <input
              type="text"
              value={settings.backupPhone || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, backupPhone: e.target.value }))
              }
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-white/60 uppercase">Instagram Profile URL</label>
            <input
              type="url"
              value={settings.instagramUrl || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, instagramUrl: e.target.value }))
              }
              placeholder="https://instagram.com/thenonlocals"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── 3. PAYMENT REFERENCE INFO (OPTIONAL) ───────────────────────────── */}
      <div className="rounded-3xl bg-[#0c100e] border border-white/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#183D32] border border-[#D4F938]/40 text-[#D4F938] flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-white uppercase">
              3. Payment Reference (Optional / Future Use)
            </h2>
            <p className="font-mono text-[11px] text-white/50">
              Configure official UPI credentials if needed for reference or manual coordinator sharing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Business UPI ID</label>
            <input
              type="text"
              value={settings.agencyUpiId || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, agencyUpiId: e.target.value }))
              }
              placeholder="thenonlocals@okhdfcbank"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-white/60 uppercase">Account / Payee Name</label>
            <input
              type="text"
              value={settings.agencyUpiName || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, agencyUpiName: e.target.value }))
              }
              placeholder="THE NON LOCALS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* QR Code Upload */}
          <div className="space-y-2 sm:col-span-2 pt-2">
            <label className="block text-white/60 uppercase">UPI QR Code Image</label>
            <div className="flex items-center gap-4">
              {settings.upiQrImageUrl ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-1 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.upiQrImageUrl}
                    alt="UPI QR Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center text-white/30 shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-2">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs cursor-pointer border border-white/15">
                  <Upload className="w-3.5 h-3.5 text-[#D4F938]" />
                  <span>{uploadingQr ? "Uploading..." : "Upload UPI QR Code"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="hidden"
                    disabled={uploadingQr}
                  />
                </label>
                <span className="block text-[10px] text-white/40">
                  Uploaded to Firebase Storage path: /settings/upi-qr.*
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#D4F938] hover:bg-[#C5EC2E] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(212,249,56,0.4)] cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Website Settings"}</span>
        </button>
      </div>
    </form>
  );
}
