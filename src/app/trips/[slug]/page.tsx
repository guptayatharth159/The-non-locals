import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTripBySlug, getAllTripSlugs } from "@/data/trips";
import { getTripBySlugFromFirestore } from "@/lib/firebase/services/tripsService";
import TripDetailsView from "@/components/trip-details/TripDetailsView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // Query Firestore first, fall back safely to local data during static prerender
  let trip = null;
  try {
    trip = await getTripBySlugFromFirestore(slug);
  } catch (err) {
    // Non-fatal fallback for static compilation
  }
  if (!trip) {
    trip = getTripBySlug(slug) ?? null;
  }

  if (!trip || trip.published === false) {
    return {
      title: "Expedition Not Found | THE NON LOCALS",
      description: "The requested expedition could not be found.",
    };
  }

  return {
    title: `${trip.title} | THE NON LOCALS`,
    description: trip.description,
    openGraph: {
      title: `${trip.title} | THE NON LOCALS`,
      description: trip.description,
      images: [trip.image],
    },
  };
}

export default async function TripDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Query Firestore first for live departure slots, seats and itinerary
  let trip = null;
  try {
    trip = await getTripBySlugFromFirestore(slug);
  } catch (err) {
    // Non-fatal fallback for static compilation
  }
  if (!trip) {
    trip = getTripBySlug(slug) ?? null;
  }

  // Handle invalid slugs or unpublished trips
  if (!trip || trip.published === false) {
    notFound();
  }

  return <TripDetailsView trip={trip} />;
}
