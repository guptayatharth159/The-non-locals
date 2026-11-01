import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { BRAND } from "@/lib/constants";

export interface PublicWebsiteSettings {
  whatsappNumber: string;
  backupPhone?: string;
  supportEmail?: string;
  agencyUpiId?: string;
  agencyUpiName?: string;
  upiQrImageUrl?: string;
  paymentInstructions?: string;
  instagramUrl?: string;
}

const DEFAULT_SETTINGS: PublicWebsiteSettings = {
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    BRAND.phone.replace(/[^0-9]/g, "") ||
    "919876543210",
  backupPhone: BRAND.phone,
  supportEmail: BRAND.contactEmail,
  agencyUpiId: "",
  agencyUpiName: "THE NON LOCALS",
  upiQrImageUrl: "",
  paymentInstructions: "Please connect with the expedition coordinator on WhatsApp to confirm availability and receive payment details.",
  instagramUrl: `https://instagram.com/${BRAND.instagramHandle.replace("@", "")}`,
};

// In-memory cache for instant page loads
let settingsCache: PublicWebsiteSettings | null = null;
let settingsCacheTime = 0;
const SETTINGS_CACHE_TTL_MS = 60000; // 60 seconds

export function invalidateSettingsCache() {
  settingsCache = null;
  settingsCacheTime = 0;
}

/**
 * Fetches the public settings document from Firestore (settings/public).
 * Uses in-memory caching for instant page render, and resiliently
 * falls back to brand constants if the document does not exist.
 */
export async function getPublicSettings(): Promise<PublicWebsiteSettings> {
  const now = Date.now();
  if (settingsCache && now - settingsCacheTime < SETTINGS_CACHE_TTL_MS) {
    return settingsCache;
  }

  try {
    const docRef = doc(db, "settings", "public");
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const loaded: PublicWebsiteSettings = {
        ...DEFAULT_SETTINGS,
        whatsappNumber: data.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
        backupPhone: data.backupPhone || DEFAULT_SETTINGS.backupPhone,
        supportEmail: data.supportEmail || DEFAULT_SETTINGS.supportEmail,
        agencyUpiId: data.agencyUpiId || data.upiId || "",
        agencyUpiName: data.agencyUpiName || "THE NON LOCALS",
        upiQrImageUrl: data.upiQrImageUrl || "",
        paymentInstructions: data.paymentInstructions || DEFAULT_SETTINGS.paymentInstructions,
        instagramUrl: data.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
      };
      settingsCache = loaded;
      settingsCacheTime = Date.now();
      return loaded;
    }
  } catch (err) {
    console.warn("[settingsService] Firestore settings read note, using fallback:", err);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Updates public settings in Firestore (admin use).
 */
export async function updatePublicSettings(
  settings: Partial<PublicWebsiteSettings>
): Promise<void> {
  invalidateSettingsCache();
  const docRef = doc(db, "settings", "public");
  await setDoc(
    docRef,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
