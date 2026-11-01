export type AdventureCategory =
  | "Mountain Trekking"
  | "Camping"
  | "Road Trips"
  | "Water Adventures"
  | "Backpacking";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  altitude?: string;
  distance?: string;
  stayType?: string;
}

export interface DepartureSlot {
  id: string;
  date: string;
  endDate: string;
  month: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: "available" | "filling-fast" | "sold-out";
}

export interface TripAccommodation {
  type: string;
  roomSharing: string;
  description: string;
  amenities: string[];
  notes?: string;
  image?: string;
}

export interface TripReview {
  id: string;
  author: string;
  college?: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface TripHighlight {
  title: string;
  description: string;
  iconName: string;
}

export interface TripFAQItem {
  question: string;
  answer: string;
}

export interface Trip {
  id: string;
  slug: string;
  title: string;
  destination: string;
  state: string;
  duration: string;
  durationDays: number;
  departureDate: string;
  departureMonth: string;
  departureLocation: string;
  maxGroupSize: number;
  minAge: number;
  price: number;
  originalPrice: number;
  availableSeats: number;
  totalSeats: number;
  category: AdventureCategory;
  difficulty: "Easy" | "Easy-Moderate" | "Moderate" | "Demanding";
  rating?: number;
  reviewsCount?: number;
  isSampleData?: boolean;
  image: string;
  galleryImages: string[];
  description: string;
  tagline: string;
  highlights: string[];
  experienceHighlights: TripHighlight[];
  itinerary: ItineraryDay[];
  accommodation: TripAccommodation;
  inclusions: string[];
  exclusions: string[];
  departureSlots: DepartureSlot[];
  reviews: TripReview[];
  faqs: TripFAQItem[];
  featured?: boolean;
  published?: boolean;
}

export interface CategoryInfo {
  name: AdventureCategory;
  count: number;
  image: string;
  tagline: string;
}

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    name: "Backpacking",
    count: 4,
    image: "/images/hero-misty-lake-canoe.jpg",
    tagline: "Student cohorts, mountain cafes & local homestays",
  },
  {
    name: "Mountain Trekking",
    count: 4,
    image: "/images/hero-crystal-lake.jpg",
    tagline: "Pine trails, waterfall hikes & high ridges",
  },
  {
    name: "Camping",
    count: 3,
    image: "/images/hero-camp.jpg",
    tagline: "Starry skies, bonfires & riverside tents",
  },
  {
    name: "Road Trips",
    count: 4,
    image: "/images/hero-twilight-camp.jpg",
    tagline: "Scenic mountain highways & highland passes",
  },
  {
    name: "Water Adventures",
    count: 2,
    image: "/images/hero-sunset-campfire.jpg",
    tagline: "Trout streams, glacial riverbanks & alpine lakes",
  },
];

// 1. CONFIRMED DESTINATION 1: JIBHI – TIRTHAN VALLEY (FEATURED)
export const FEATURED_TRIP: Trip = {
  id: "jibhi-tirthan-escape",
  slug: "jibhi-tirthan-escape",
  title: "JIBHI & TIRTHAN VALLEY EXPEDITION",
  destination: "Jibhi – Tirthan Valley, Himachal Pradesh",
  state: "Himachal Pradesh",
  duration: "4 Days / 3 Nights",
  durationDays: 4,
  departureDate: "Sample Itinerary (Schedule TBA)",
  departureMonth: "Fall 2026",
  departureLocation: "Bennett University Campus (Direct Group Pickup)",
  maxGroupSize: 18,
  minAge: 18,
  price: 7499,
  originalPrice: 8999,
  availableSeats: 18,
  totalSeats: 18,
  category: "Backpacking",
  difficulty: "Easy-Moderate",
  isSampleData: true,
  image: "/images/hero-misty-lake-canoe.jpg",
  galleryImages: [
    "/images/hero-misty-lake-canoe.jpg",
    "/images/hero-camp.jpg",
    "/images/emerald-lake.jpg",
    "/images/hero-crystal-lake.jpg",
  ],
  tagline: "Hidden waterfalls, pine trails & authentic wooden homestays in Tirthan.",
  description:
    "An exclusive getaway for Bennett University students into the untouched valleys of Jibhi and Tirthan. Wind through pine-canopied trails, explore secret mountain waterfalls, visit ancient towers of Chehni Kothi, and unwind by fresh trout streams with your campus peers.",
  highlights: [
    "Exclusive to Bennett University students (Solo & Group friendly)",
    "Indicative Student Budget: ₹7,000 – ₹8,000",
    "Hidden waterfalls & pine forest nature trails",
    "Traditional Chehni Kothi fortified wooden tower walk",
    "Riverside bonfire & acoustic student evenings",
    "Safety-conscious planning & dedicated student cohort coordinator",
  ],
  experienceHighlights: [
    {
      title: "Local Himalayan Homestay",
      description: "Cozy, hygienic wooden architecture with warm mountain hospitality and wholesome meals.",
      iconName: "Home",
    },
    {
      title: "Jibhi Secret Waterfalls",
      description: "Short scenic nature walks through deodar forests to crystal alpine cascades.",
      iconName: "Compass",
    },
    {
      title: "Chehni Kothi Heritage",
      description: "Walk up to the 1,500-year-old towering indigenous stone-and-timber mountain structure.",
      iconName: "Mountain",
    },
    {
      title: "Solo Traveler Welcoming",
      description: "No group of friends needed — join solo and get grouped with friendly fellow Bennett peers.",
      iconName: "Users",
    },
  ],
  itinerary: [
    {
      day: 1,
      title: "Campus Departure & Scenic Drive into Tirthan",
      description:
        "Depart from Bennett University campus in a comfortable, verified mountain bus. Overnight drive through the scenic Shivalik foothills into Himachal.",
      activities: [
        "Pick-up directly from Bennett University campus",
        "Ice-breaking and trip briefing with cohort coordinators",
        "Scenic highway drive with comfortable food stops",
      ],
      stayType: "Comfortable Transit Coach",
    },
    {
      day: 2,
      title: "Arrival in Jibhi, Riverside Wooden Stays & Hidden Waterfall",
      description:
        "Check into verified handpicked wooden homestays. Freshen up and head out for a calm afternoon nature walk to the Jibhi waterfall.",
      activities: [
        "Check-in at traditional cedar homestay",
        "Home-cooked lunch with local mountain dishes",
        "Afternoon trail walk to Jibhi Waterfall",
        "Evening campfire and community bonding circle",
      ],
      stayType: "Hygienic Wooden Homestay",
    },
    {
      day: 3,
      title: "Jalori Pass & Serolsar Lake Alpine Walk",
      description:
        "Drive up to Jalori Pass (10,800 ft). Embark on a gentle 5 km pine meadow trail to the sacred Serolsar Lake surrounded by high oak forests.",
      activities: [
        "Morning drive to Jalori Pass viewpoints",
        "Guided walk to Serolsar Lake",
        "Visit the Budhi Nagin mountain shrine",
        "Sunset chai overlooking high Himalayan valleys",
      ],
      altitude: "10,800 FT",
      stayType: "Hygienic Wooden Homestay",
    },
    {
      day: 4,
      title: "Chehni Kothi Heritage Trail & Return Journey",
      description:
        "Explore the historic architectural gem of Chehni Kothi. Enjoy a farewell lunch and begin the scenic return drive to Bennett University.",
      activities: [
        "Short hike to Chehni Kothi ancient tower",
        "Souvenir & local honey shopping in Jibhi market",
        "Overnight journey back to campus",
      ],
      stayType: "Return Transit",
    },
  ],
  accommodation: {
    type: "Handpicked Mountain Homestay / Boutique Cottages",
    roomSharing: "Triple / Quad student sharing (Twin available on request)",
    description:
      "Vetted, clean wooden stays with 24/7 hot water, warm duvets, safe surroundings, and dedicated female safety priorities.",
    amenities: ["Hot Water", "Clean Linens", "Campfire Area", "Home Meals", "Wi-Fi in Common Areas"],
    notes: "All accommodations are personally checked for student safety and hygiene.",
  },
  inclusions: [
    "Comfortable round-trip transportation from Bennett University",
    "3 Nights stay in verified, hygienic homestays / cottages",
    "Breakfast & dinner as specified in package",
    "Guided visits to Jibhi Waterfall, Jalori Pass & Serolsar Lake",
    "Dedicated student cohort coordinator & local guide support",
    "All permits, tolls, and parking taxes",
  ],
  exclusions: [
    "Personal expenses (snacks, cafe visits, shopping)",
    "Any activity or meal not explicitly specified in package",
    "Emergency travel or medical expenses outside scope",
  ],
  departureSlots: [
    {
      id: "slot-sample-1",
      date: "Sample Date 1",
      endDate: "Sample End 1",
      month: "Fall 2026",
      price: 7499,
      availableSeats: 18,
      totalSeats: 18,
      status: "available",
    },
  ],
  reviews: [],
  faqs: [
    {
      question: "Can I join if I don't have a group of friends?",
      answer:
        "Absolutely! THE NON LOCALS is built specifically for university students to connect. A significant portion of our travelers join solo and leave with a close-knit group of friends from Bennett.",
    },
    {
      question: "Is this trip exclusively for Bennett University students?",
      answer:
        "Yes, all our cohorts are exclusively organized for Bennett University students to ensure a safe, comfortable, and relatable student community.",
    },
    {
      question: "Are these prices and dates finalized?",
      answer:
        "This is sample data reflecting our client-communicated indicative budget range of ₹7,000–₹8,000. Final departure schedules and confirmed slots will be announced on official Bennett cohort channels.",
    },
    {
      question: "What safety protocols are maintained for female students?",
      answer:
        "Female safety is our foremost non-negotiable. We select thoroughly vetted stays, safe transit partners, and maintain respectful cohort conduct on every journey.",
    },
  ],
  featured: true,
};

// 2. CONFIRMED DESTINATION 2: DHARAMSHALA – MCLEODGANJ
export const DHARAMSHALA_TRIP: Trip = {
  id: "dharamshala-mcleodganj-retreat",
  slug: "dharamshala-mcleodganj-retreat",
  title: "DHARAMSHALA & MCLEODGANJ RETREAT",
  destination: "Dharamshala – McLeodganj, Himachal Pradesh",
  state: "Himachal Pradesh",
  duration: "4 Days / 3 Nights",
  durationDays: 4,
  departureDate: "Sample Itinerary (Schedule TBA)",
  departureMonth: "Fall 2026",
  departureLocation: "Bennett University Campus (Direct Group Pickup)",
  maxGroupSize: 18,
  minAge: 18,
  price: 7800,
  originalPrice: 9200,
  availableSeats: 18,
  totalSeats: 18,
  category: "Backpacking",
  difficulty: "Easy",
  isSampleData: true,
  image: "/images/hero-twilight-camp.jpg",
  galleryImages: [
    "/images/hero-twilight-camp.jpg",
    "/images/hero-crystal-lake.jpg",
    "/images/hero-camp.jpg",
  ],
  tagline: "Tibetan culture, mountain monasteries, cafe hopping & scenic Dhauladhar views.",
  description:
    "Explore the vibrant cultural capital of the Kangra Valley with your Bennett peers. Wander through the quiet monastery courtyards of McLeodganj, taste authentic Tibetan momos and thukpa, hike up to Bhagsu Waterfall, and marvel at the colossal snow-covered Dhauladhar wall.",
  highlights: [
    "Exclusive to Bennett University students",
    "Indicative Student Budget: ₹7,000 – ₹8,000",
    "Tsuglagkhang Complex & Dalai Lama Temple visit",
    "Bhagsu Waterfall & Dharamkot cafe exploration",
    "St. John in the Wilderness forest church walk",
    "Curated mountain stays with female safety priority",
  ],
  experienceHighlights: [
    {
      title: "Tibetan Heritage & Monasteries",
      description: "Immerse in ancient Tibetan architecture, prayer wheels, and peaceful monastery chants.",
      iconName: "Mountain",
    },
    {
      title: "Mountain Cafe Hopping",
      description: "Chill in picturesque hillside cafes overlooking the Kangra valley with acoustic vibes.",
      iconName: "Coffee",
    },
    {
      title: "Scenic Pine Routes",
      description: "Walk serene deodar forest trails connecting McLeodganj, Bhagsu, and Dharamkot.",
      iconName: "Compass",
    },
    {
      title: "Solo Traveler Friendly",
      description: "Easily socialize with peers from different campus branches and semesters.",
      iconName: "Users",
    },
  ],
  itinerary: [
    {
      day: 1,
      title: "Campus Pickup & Overnight Journey to Kangra",
      description: "Board comfortable mountain coach from Bennett University. Overnight transit.",
      activities: ["Departure from Bennett campus", "Trip briefing & group introduction"],
      stayType: "Comfortable Transit Coach",
    },
    {
      day: 2,
      title: "Arrival in McLeodganj & Cultural Landmarks",
      description: "Check in, relax, and explore the Dalai Lama Temple complex and vibrant local street bazaars.",
      activities: ["Check-in at verified hotel/stay", "Dalai Lama Temple visit", "Tibetan market walk"],
      stayType: "Verified Student Hotel",
    },
    {
      day: 3,
      title: "Bhagsu Waterfall, Shiva Cafe & Dharamkot Trails",
      description: "Hike up to Bhagsu Waterfall, visit the historic Bhagsunath Temple, and spend a relaxed afternoon in Dharamkot.",
      activities: ["Hike to Bhagsu Waterfall", "Dharamkot artistic village trail", "Evening sunset viewpoint"],
      stayType: "Verified Student Hotel",
    },
    {
      day: 4,
      title: "Norbulingka Institute & Campus Return",
      description: "Visit traditional Tibetan craft workshops at Norbulingka before starting the evening return drive.",
      activities: ["Norbulingka Tibetan arts exploration", "Group lunch", "Departure back to campus"],
      stayType: "Return Transit",
    },
  ],
  accommodation: {
    type: "Clean, Verified Hillside Hotel / Guesthouse",
    roomSharing: "Triple / Quad student sharing",
    description: "Centrally located, secure, and sanitized rooms with scenic valley views.",
    amenities: ["Hot Water", "Clean Bedding", "In-house Dining", "Safety Staff"],
    notes: "Safe student environment with female safety first guidelines.",
  },
  inclusions: [
    "Round-trip AC pushback coach from Bennett University",
    "3 Nights stay in vetted hotel",
    "Daily breakfast and dinner",
    "Sightseeing and guided cultural walks",
    "Cohort coordinator support throughout",
  ],
  exclusions: ["Lunch, personal snacks, and individual activities"],
  departureSlots: [
    {
      id: "slot-sample-dhar-1",
      date: "Sample Date",
      endDate: "Sample End",
      month: "Fall 2026",
      price: 7800,
      availableSeats: 18,
      totalSeats: 18,
      status: "available",
    },
  ],
  reviews: [],
  faqs: [
    {
      question: "Are Bennett students from all years allowed?",
      answer: "Yes! Students from all batches and departments at Bennett University are welcome to join.",
    },
  ],
};

// 3. CONFIRMED DESTINATION 3: MANALI – KULLU
export const MANALI_TRIP: Trip = {
  id: "manali-kullu-adventure",
  slug: "manali-kullu-adventure",
  title: "MANALI & KULLU VALLEY ADVENTURE",
  destination: "Manali – Kullu, Himachal Pradesh",
  state: "Himachal Pradesh",
  duration: "4 Days / 3 Nights",
  durationDays: 4,
  departureDate: "Sample Itinerary (Schedule TBA)",
  departureMonth: "Fall 2026",
  departureLocation: "Bennett University Campus (Direct Group Pickup)",
  maxGroupSize: 18,
  minAge: 18,
  price: 7999,
  originalPrice: 9499,
  availableSeats: 18,
  totalSeats: 18,
  category: "Mountain Trekking",
  difficulty: "Easy-Moderate",
  isSampleData: true,
  image: "/images/emerald-lake.jpg",
  galleryImages: ["/images/emerald-lake.jpg", "/images/hero-camp.jpg"],
  tagline: "Old Manali lanes, Jogini waterfalls, Solang vistas & crisp Himalayan mountain air.",
  description:
    "The quintessential mountain retreat for Bennett University students. Stroll along the bohemian lanes of Old Manali, trek up to the thundering Jogini Waterfall through apple orchards, and soak in panoramic Himalayan views.",
  highlights: [
    "Exclusive to Bennett University students",
    "Indicative Student Budget: ₹7,000 – ₹8,000",
    "Jogini Waterfall pine trail & Vashisht hot springs",
    "Old Manali cafe culture & wooden bridge strolls",
    "Solang Valley mountain vistas",
    "Structured group management with zero hassle",
  ],
  experienceHighlights: [
    {
      title: "Jogini Waterfall Hike",
      description: "Picturesque 3 km forest walk crossing gushing streams and traditional wooden houses.",
      iconName: "Mountain",
    },
    {
      title: "Old Manali Atmosphere",
      description: "Eclectic cafes, live music, handcrafted bakeries, and student friendly hangout spots.",
      iconName: "Compass",
    },
    {
      title: "Solang Valley Panoramas",
      description: "Wide open alpine meadows framed by giant glaciers and snow-capped peaks.",
      iconName: "MapPin",
    },
    {
      title: "Safety & Trust",
      description: "Female safety first, trusted drivers, and carefully verified student accommodations.",
      iconName: "Shield",
    },
  ],
  itinerary: [
    {
      day: 1,
      title: "Bennett Campus Departure to Kullu",
      description: "Evening assembly and departure from campus. Overnight scenic highway drive.",
      activities: ["Departure from campus", "Ice-breakers & playlist sessions"],
      stayType: "Comfortable Transit Coach",
    },
    {
      day: 2,
      title: "Arrival in Manali, Hadimba Temple & Old Manali Stroll",
      description: "Check into verified stays. Afternoon visit to the ancient cedar Hadimba Temple and Old Manali.",
      activities: ["Check-in & fresh-up", "Hadimba Temple visit", "Old Manali cafe exploration"],
      stayType: "Verified Mountain Stay",
    },
    {
      day: 3,
      title: "Jogini Waterfall Hike & Solang Valley",
      description: "Hike through apple orchards to Jogini Waterfall, followed by an excursion to Solang Valley.",
      activities: ["Jogini Waterfall hike", "Solang valley viewpoints", "Evening bonfire & music"],
      stayType: "Verified Mountain Stay",
    },
    {
      day: 4,
      title: "Kullu Riverfront Exploration & Campus Return",
      description: "Visit Kullu shawls and local crafts before the return journey back to campus.",
      activities: ["Kullu valley stopover", "Return transit to Bennett University"],
      stayType: "Return Transit",
    },
  ],
  accommodation: {
    type: "Handpicked Mountain Resort / Cottage",
    roomSharing: "Triple / Quad student sharing",
    description: "Secure, hygienic, and heated rooms with hot water and student-friendly amenities.",
    amenities: ["Hot Water", "Clean Bedding", "Mountain Views", "Safe Environment"],
    notes: "Verified for female traveler comfort and hygiene.",
  },
  inclusions: [
    "Direct round-trip transport from Bennett University",
    "3 Nights stay in vetted mountain property",
    "Breakfast & dinner",
    "Guided sightseeing and coordinator support",
  ],
  exclusions: ["Lunch, personal adventure gear, and cafe orders"],
  departureSlots: [
    {
      id: "slot-sample-manali-1",
      date: "Sample Date",
      endDate: "Sample End",
      month: "Fall 2026",
      price: 7999,
      availableSeats: 18,
      totalSeats: 18,
      status: "available",
    },
  ],
  reviews: [],
  faqs: [
    {
      question: "Can I bring my campus friends together?",
      answer: "Yes, you can register with your friend group, or join solo and get grouped into the cohort.",
    },
  ],
};

// 4. CONFIRMED DESTINATION 4: SHIMLA – KUFRI
export const SHIMLA_TRIP: Trip = {
  id: "shimla-kufri-getaway",
  slug: "shimla-kufri-getaway",
  title: "SHIMLA & KUFRI HIGHLAND ESCAPE",
  destination: "Shimla – Kufri, Himachal Pradesh",
  state: "Himachal Pradesh",
  duration: "3 Days / 2 Nights",
  durationDays: 3,
  departureDate: "Sample Itinerary (Schedule TBA)",
  departureMonth: "Fall 2026",
  departureLocation: "Bennett University Campus (Direct Group Pickup)",
  maxGroupSize: 18,
  minAge: 18,
  price: 7200,
  originalPrice: 8500,
  availableSeats: 18,
  totalSeats: 18,
  category: "Road Trips",
  difficulty: "Easy",
  isSampleData: true,
  image: "/images/hero-camp.jpg",
  galleryImages: ["/images/hero-camp.jpg", "/images/hero-sunset-campfire.jpg"],
  tagline: "Colonial ridge trails, cedar forest strolls & panoramic Himalayan vistas.",
  description:
    "A crisp, refreshing weekend escape from the daily college routine. Explore Shimla's historic Mall Road and Ridge, hike through deodar woods in Kufri, and take in the majestic Himalayan snowline.",
  highlights: [
    "Exclusive to Bennett University students",
    "Indicative Student Budget: ₹7,000 – ₹8,000",
    "The Ridge & Mall Road colonial heritage walk",
    "Kufri highland viewpoints & pine walks",
    "Jakhu Temple summit panorama",
    "Zero hassle planning with campus pickup and drop",
  ],
  experienceHighlights: [
    {
      title: "Colonial Ridge & Heritage",
      description: "Historic neo-gothic architecture, open mountain squares, and pleasant evening strolls.",
      iconName: "Compass",
    },
    {
      title: "Kufri Highland Views",
      description: "Dense deodar forest trails leading to breathtaking views of the central Himalayan ranges.",
      iconName: "Mountain",
    },
    {
      title: "Campus-to-Mountain Ease",
      description: "Seamless door-to-door transit from Bennett University directly to your mountain base.",
      iconName: "CheckCircle2",
    },
    {
      title: "Female Safety First",
      description: "Strict safety vetting, verified stays, and supportive student community environment.",
      iconName: "Shield",
    },
  ],
  itinerary: [
    {
      day: 1,
      title: "Departure from Bennett Campus to Shimla",
      description: "Evening departure from Bennett University campus in AC group coach.",
      activities: ["Campus pickup", "Overnight scenic drive"],
      stayType: "Comfortable Transit Coach",
    },
    {
      day: 2,
      title: "Shimla The Ridge, Christ Church & Mall Road",
      description: "Morning arrival, check in, fresh up, and take a heritage walk along The Ridge and Lakkar Bazaar.",
      activities: ["Check-in & breakfast", "The Ridge & Christ Church walk", "Mall Road exploration"],
      stayType: "Verified Shimla Hotel",
    },
    {
      day: 3,
      title: "Kufri Highland Exploration & Return to Campus",
      description: "Excursion to Kufri pine trails followed by evening return drive to campus.",
      activities: ["Kufri scenic trails", "Himalayan panoramic viewpoints", "Return drive to Bennett University"],
      stayType: "Return Transit",
    },
  ],
  accommodation: {
    type: "Clean, Verified Highland Hotel",
    roomSharing: "Triple / Quad student sharing",
    description: "Safe, warm, and comfortable rooms with hot showers and central heating options.",
    amenities: ["Hot Water", "Clean Bedding", "Restaurant", "Safe Surroundings"],
    notes: "Curated with female safety and hygiene standards.",
  },
  inclusions: [
    "Direct round-trip transport from Bennett University",
    "2 Nights stay in verified hotel",
    "Daily breakfast and dinner",
    "Guided sightseeing and cohort coordinator support",
  ],
  exclusions: ["Individual snacks, personal shopping, and entrance fees"],
  departureSlots: [
    {
      id: "slot-sample-shimla-1",
      date: "Sample Date",
      endDate: "Sample End",
      month: "Fall 2026",
      price: 7200,
      availableSeats: 18,
      totalSeats: 18,
      status: "available",
    },
  ],
  reviews: [],
  faqs: [
    {
      question: "Is this suitable for a quick weekend recharge?",
      answer: "Yes, this itinerary is optimized specifically for university weekend schedules with minimal missed classes.",
    },
  ],
};

// Legacy compatible slugs to ensure existing links work seamlessly
export const HAMPTA_TRIP: Trip = {
  ...MANALI_TRIP,
  id: "hampta-pass-expedition",
  slug: "hampta-pass-expedition",
};

export const SPITI_TRIP: Trip = {
  ...DHARAMSHALA_TRIP,
  id: "spiti-valley-expedition",
  slug: "spiti-valley-expedition",
};

export const KASOL_TRIP: Trip = {
  ...FEATURED_TRIP,
  id: "kasol-backpacking-trip",
  slug: "kasol-backpacking-trip",
};

export const MANALI_ESCAPE_TRIP: Trip = {
  ...MANALI_TRIP,
  id: "manali-adventure-escape",
  slug: "manali-adventure-escape",
};

export const SAMPLE_TRIPS: Trip[] = [
  FEATURED_TRIP,
  DHARAMSHALA_TRIP,
  MANALI_TRIP,
  SHIMLA_TRIP,
  HAMPTA_TRIP,
  SPITI_TRIP,
  KASOL_TRIP,
  MANALI_ESCAPE_TRIP,
];

export const ALL_TRIPS: Trip[] = SAMPLE_TRIPS;

export function getTripBySlug(slug: string): Trip | undefined {
  return ALL_TRIPS.find((t) => t.slug === slug);
}

export function getAllTripSlugs(): string[] {
  return ALL_TRIPS.map((t) => t.slug);
}

export function getRelatedTrips(currentSlug: string, count: number = 3): Trip[] {
  const current = getTripBySlug(currentSlug);
  const others = ALL_TRIPS.filter((t) => t.slug !== currentSlug);
  if (!current) return others.slice(0, count);

  const sameCategory = others.filter((t) => t.category === current.category);
  const remaining = others.filter((t) => t.category !== current.category);
  return [...sameCategory, ...remaining].slice(0, count);
}
