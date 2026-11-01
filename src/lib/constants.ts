import { Expedition, NavItem } from "@/types";

export const BRAND = {
  name: "THE NON LOCALS",
  tagline: "NOT HERE TO FIT IN. HERE TO EXPLORE.",
  secondaryTagline: "MORE THAN A TRIP, IT'S AN EXPERIENCE.",
  targetUniversity: "Bennett University",
  shortDescription:
    "An exclusive travel community for Bennett University students who want to explore new places, meet amazing people and experience something beyond the usual college routine.",
  budgetNote: "Indicative Student Budget: ₹7,000 – ₹8,000",
  establishedYear: "2024",
  baseCampCoordinates: "32.2396° N, 77.1887° E",
  baseCampLocation: "Western Himalayas, India",
  contactEmail: "hello@thenonlocals.com",
  instagramHandle: "@thenonlocals",
  phone: "+91 98765 43210",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "DESTINATIONS", href: "/adventures" },
  { label: "ABOUT US", href: "/#about" },
  { label: "WHY US", href: "/#why-us" },
  { label: "STANDARDS", href: "/#standards" },
  { label: "WHAT WE DO", href: "/#what-we-do" },
];

export const BRAND_COLORS = {
  forestGreen: "#183D32",
  forestGreenDeep: "#0e241e",
  deepCharcoal: "#151916",
  charcoalDark: "#0c0f0d",
  adventureOrange: "#FF7135",
  sandBeige: "#EDE5D5",
  offWhite: "#F8F7F2",
  olive: "#A3A879",
  limeGreen: "#D4F938",
} as const;

// Official Client Confirmed Destinations
export const CONFIRMED_DESTINATIONS = [
  {
    id: "jibhi-tirthan",
    title: "Jibhi – Tirthan Valley",
    region: "Tirthan Valley, Himachal Pradesh",
    highlight: "Hidden waterfalls, pine trails & serene wooden homestays",
    indicativePrice: "₹7,499",
    category: "OFFBEAT EXPLORATION",
    image: "/images/hero-misty-lake-canoe.jpg",
    slug: "jibhi-tirthan-escape",
  },
  {
    id: "dharamshala-mcleodganj",
    title: "Dharamshala – McLeodganj",
    region: "Kangra Valley, Himachal Pradesh",
    highlight: "Tibetan culture, mountain monasteries & cafe trails",
    indicativePrice: "₹7,800",
    category: "CULTURE & HERITAGE",
    image: "/images/hero-twilight-camp.jpg",
    slug: "dharamshala-mcleodganj-retreat",
  },
  {
    id: "manali-kullu",
    title: "Manali – Kullu",
    region: "Kullu Valley, Himachal Pradesh",
    highlight: "Alpine passes, cedar forests & Old Manali wanderlust",
    indicativePrice: "₹7,999",
    category: "MOUNTAIN ADVENTURE",
    image: "/images/emerald-lake.jpg",
    slug: "manali-kullu-adventure",
  },
  {
    id: "shimla-kufri",
    title: "Shimla – Kufri",
    region: "Shimla Hills, Himachal Pradesh",
    highlight: "Colonial architectural trails & panoramic Himalayan ridges",
    indicativePrice: "₹7,200",
    category: "SCENIC HIGHLANDS",
    image: "/images/hero-camp.jpg",
    slug: "shimla-kufri-getaway",
  },
];

// Client Messaging: Why Travel With Us
export const WHY_TRAVEL_WITH_US = [
  {
    title: "Affordable Student Trips",
    description: "Carefully designed for Bennett University students with realistic, accessible student budgets.",
    icon: "BadgePercent",
  },
  {
    title: "Transparent Package Inclusions",
    description: "Travel, accommodation, and curated experiences exactly as specified in each verified package.",
    icon: "ShieldCheck",
  },
  {
    title: "Hidden Gems & Offbeat Spots",
    description: "Skip the overcrowded tourist traps for untouched Himalayan trails, secret waterfalls, and quiet vistas.",
    icon: "Compass",
  },
  {
    title: "Local Exploration First",
    description: "Deep cultural immersion and local storytelling beyond hurried bus sightseeing.",
    icon: "MapPin",
  },
  {
    title: "Organised with Travel Guides",
    description: "Structured group itineraries led by experienced mountain guides and friendly cohort coordinators.",
    icon: "Users",
  },
  {
    title: "Safety-Conscious Planning",
    description: "Every route, stay, and transit option is vetted with thoughtful planning and student safety as priority.",
    icon: "HeartHandshake",
  },
];

// Client Messaging: What to Expect
export const WHAT_TO_EXPECT = [
  {
    number: "01",
    title: "Local Experiences",
    tagline: "Experience the Himalayas like a local.",
    description:
      "Taste authentic regional food, stay in warm family-run guesthouses, and connect with mountain communities on real human terms.",
  },
  {
    number: "02",
    title: "Scenic Routes",
    tagline: "Traverse beautiful mountain roads and landscapes.",
    description:
      "Wind through dramatic pine canyons, ancient river valleys, and panoramic high passes made for lifelong road trip memories.",
  },
  {
    number: "03",
    title: "Culture and Heritage",
    tagline: "Visit remote mountain villages and historic temples.",
    description:
      "Explore age-old wooden architecture, sacred Himalayan shrines, and remote indigenous hamlets untouched by mass commercialism.",
  },
];

// Client Messaging: Our Non-Negotiables
export const OUR_NON_NEGOTIABLES = [
  {
    title: "Female Safety First",
    description: "Safe, respectful environment with curated female-friendly stays, trusted drivers, and mindful cohort supervision.",
    iconName: "Shield",
  },
  {
    title: "Thoughtful Planning",
    description: "Balanced pacing with breathing room — no frantic rushing, no hidden agenda, just seamless execution.",
    iconName: "CalendarCheck",
  },
  {
    title: "Good Stays",
    description: "Clean, hygienic, and welcoming accommodations handpicked for safety, warmth, and mountain character.",
    iconName: "Home",
  },
  {
    title: "Reliable Service",
    description: "Transparent communication before, during, and after every trip with dedicated student point-of-contacts.",
    iconName: "Sparkles",
  },
  {
    title: "Comfortable Transportation",
    description: "Verified mountain-certified vehicles and skilled drivers who respect high-altitude road safety.",
    iconName: "Bus",
  },
  {
    title: "Zero Hassle",
    description: "We handle the logistics from pickup to drop, so you can focus entirely on making memories with your crew.",
    iconName: "CheckCircle2",
  },
];

// Client Messaging: What We Do (Only Client-Confirmed Active Services)
export const WHAT_WE_DO = [
  {
    title: "Experiential Group Trips",
    tagline: "Cohort-based weekend & semester break getaways",
    description: "Curated small group departures where Bennett students explore together and bond over shared mountain adventures.",
    status: "active",
    badge: "CORE OFFERING",
  },
  {
    title: "Customised Holidays",
    tagline: "Tailored private getaways for your friend circle",
    description: "Got a specific group or semester break in mind? We customize itineraries, stays, and transit to your preferences.",
    status: "active",
    badge: "AVAILABLE ON REQUEST",
  },
  {
    title: "Creator Hosted Trips",
    tagline: "Themed journeys with storytellers & photographers",
    description: "Special edition student journeys led by visual creators, outdoor enthusiasts, and mountain storytellers.",
    status: "active",
    badge: "LIMITED EDITIONS",
  },
  {
    title: "Corporate & Campus Trips",
    tagline: "Departmental & leadership retreats",
    description: "Structured mountain retreats designed for campus clubs, student bodies, and partner organizations.",
    status: "in-planning",
    badge: "IN PLANNING",
  },
];

export const FEATURED_EXPEDITIONS: Expedition[] = [
  {
    id: "jibhi-tirthan-escape",
    slug: "jibhi-tirthan-escape",
    title: "JIBHI & TIRTHAN VALLEY ESCAPE",
    subtitle: "Pine forests, quiet riverbanks & Chehni Kothi village trail",
    region: "Tirthan Valley, HP",
    elevation: "5,300 FT",
    duration: "4 DAYS / 3 NIGHTS",
    groupSize: "14-18 EXPLORERS",
    price: 7499,
    currency: "INR",
    difficulty: "Easy-Moderate",
    season: "All Season",
    featuredImage: "/images/hero-misty-lake-canoe.jpg",
    galleryImages: [
      "/images/hero-misty-lake-canoe.jpg",
      "/images/hero-camp.jpg",
      "/images/emerald-lake.jpg",
    ],
    coordinates: "31.6367° N, 77.3468° E",
    highlightTag: "STUDENT FAVORITE",
    description:
      "A peaceful getaway into the heart of Himachal with cozy riverside wooden cottages, trout streams, and serene alpine walks.",
    departureDates: ["*Sample Schedule — Batch announcements via Bennett cohort group"],
  },
  {
    id: "dharamshala-mcleodganj-retreat",
    slug: "dharamshala-mcleodganj-retreat",
    title: "DHARAMSHALA & MCLEODGANJ JOURNEY",
    subtitle: "Tibetan culture, Bhagsu waterfall & Triund trail vistas",
    region: "Kangra Valley, HP",
    elevation: "6,831 FT",
    duration: "4 DAYS / 3 NIGHTS",
    groupSize: "14-18 EXPLORERS",
    price: 7800,
    currency: "INR",
    difficulty: "Easy",
    season: "All Season",
    featuredImage: "/images/hero-twilight-camp.jpg",
    galleryImages: [
      "/images/hero-twilight-camp.jpg",
      "/images/hero-crystal-lake.jpg",
    ],
    coordinates: "32.2190° N, 76.3234° E",
    highlightTag: "CULTURE & VIEWS",
    description:
      "Experience serene monastery chanting, bustling mountain cafes, high pine trails, and the majestic Dhauladhar snowline backdrop.",
    departureDates: ["*Sample Schedule — Batch announcements via Bennett cohort group"],
  },
  {
    id: "manali-kullu-adventure",
    slug: "manali-kullu-adventure",
    title: "MANALI & KULLU VALLEY ADVENTURE",
    subtitle: "Old Manali streets, Solang valley vistas & pine forests",
    region: "Kullu District, HP",
    elevation: "6,726 FT",
    duration: "4 DAYS / 3 NIGHTS",
    groupSize: "14-18 EXPLORERS",
    price: 7999,
    currency: "INR",
    difficulty: "Easy-Moderate",
    season: "All Season",
    featuredImage: "/images/emerald-lake.jpg",
    galleryImages: [
      "/images/emerald-lake.jpg",
      "/images/hero-camp.jpg",
    ],
    coordinates: "32.2396° N, 77.1887° E",
    highlightTag: "POPULAR COHORT",
    description:
      "The classic Himalayan mountain journey: chill cafe culture, Jogini waterfall hike, and crisp alpine air surrounded by soaring peaks.",
    departureDates: ["*Sample Schedule — Batch announcements via Bennett cohort group"],
  },
  {
    id: "shimla-kufri-getaway",
    slug: "shimla-kufri-getaway",
    title: "SHIMLA & KUFRI HIGHLAND ESCAPE",
    subtitle: "Ridge strolls, cedar trails & panoramic Himalayan view points",
    region: "Shimla Hills, HP",
    elevation: "7,467 FT",
    duration: "3 DAYS / 2 NIGHTS",
    groupSize: "14-18 EXPLORERS",
    price: 7200,
    currency: "INR",
    difficulty: "Easy",
    season: "All Season",
    featuredImage: "/images/hero-camp.jpg",
    galleryImages: [
      "/images/hero-camp.jpg",
      "/images/hero-sunset-campfire.jpg",
    ],
    coordinates: "31.1048° N, 77.1734° E",
    highlightTag: "WEEKEND SPECIAL",
    description:
      "Escape campus for a quick recharge amidst historic mountain architecture, deodar cedar canopies, and sweeping Himalayan panoramas.",
    departureDates: ["*Sample Schedule — Batch announcements via Bennett cohort group"],
  },
];
