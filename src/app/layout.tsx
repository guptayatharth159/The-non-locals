import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animation/SmoothScroll";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { BRAND } from "@/lib/constants";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thenonlocals.com"),
  title: `${BRAND.name} | Bennett University Student Travel Community`,
  description: `${BRAND.tagline} - ${BRAND.shortDescription}`,
  keywords: [
    "Bennett University travel community",
    "The Non Locals",
    "Bennett student adventures",
    "Jibhi Tirthan Valley student trip",
    "Dharamshala McLeodganj student trip",
    "Manali Kullu student trip",
    "Shimla Kufri student trip",
    "Solo student travel",
  ],
  authors: [{ name: BRAND.name }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: BRAND.shortDescription,
    url: "https://thenonlocals.com",
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 533,
        height: 533,
        alt: "The Non Locals Logo",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0e0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${bebasNeue.variable} dark antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#0b0e0c] text-[#F8F7F2] font-body selection:bg-[#D4F938] selection:text-[#0b0e0c]"
      >
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
