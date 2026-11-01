export type ExpeditionDifficulty = "Easy" | "Easy-Moderate" | "Moderate" | "Demanding" | "Expedition Grade";

export type ExpeditionSeason = "Spring" | "Summer" | "Autumn" | "Winter" | "Year-Round" | "All Season";

export interface Expedition {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  elevation: string;
  duration: string;
  groupSize: string;
  price: number;
  currency: string;
  difficulty: ExpeditionDifficulty;
  season: ExpeditionSeason;
  featuredImage: string;
  galleryImages: string[];
  coordinates: string;
  highlightTag?: string;
  description: string;
  departureDates: string[];
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface BrandManifestoPoint {
  index: string;
  title: string;
  description: string;
}
