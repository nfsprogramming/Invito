// Central template registry for Invito - Luxury Digital Invitation Studio

export interface Template {
  id: string;
  name: string;
  category: string; // Occasion (Wedding, Engagement, Haldi, Mehendi, Nikah, Reception, Sangeet, Baby Shower, Bridal Shower, Birthday, Other)
  culture: string;  // Cultural / Religious style (South Indian, North Indian, Christian, Islamic, Minimal, Modern, Royal, Traditional)
  religion: string; // For backward compatibility
  theme: string;
  style: string;
  description: string;
  tags: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  featured: boolean;
  badge?: string;
  image?: string;
  perfectFor?: string[];
  includes?: string[];
}

export const PRICING_TIER_IDS = ["free-preview", "card-basic", "website-basic", "combo", "premium"] as const;
export type PricingTierId = (typeof PRICING_TIER_IDS)[number];

export interface PricingTier {
  id: PricingTierId;
  name: string;
  price: number;
  currency: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  highlightBadge?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "south-indian",
    name: "Temple Radiance",
    category: "Wedding",
    culture: "South Indian",
    religion: "South Indian",
    theme: "Traditional",
    style: "Royal & Sacred",
    description: "Sacred temple gopuram motifs, intricate kolam art, brass deepam lamps, and golden temple borders honoring timeless South Indian heritage.",
    tags: ["south-indian", "temple", "kolam", "deepam", "traditional", "gold", "kanjeevaram"],
    colors: { primary: "#3D0000", secondary: "#C9942A", accent: "#C0392B", bg: "#FDF6E3" },
    featured: true,
    badge: "Popular",
    image: "/templates/south-indian.png",
    perfectFor: ["Tamil, Telugu, Kannada & Malayalam Weddings", "Traditional Muhurtham Ceremonies"],
    includes: ["Animated Deepam Lamps", "Custom Kolam Frame", "Carnatic Shehnai Ambience", "Interactive Muhurtham Countdown", "Google Maps Itinerary"],
  },
  {
    id: "christian",
    name: "Cathedral Grace",
    category: "Wedding",
    culture: "Christian",
    religion: "Christian",
    theme: "Classic",
    style: "Architectural & Pure",
    description: "Soaring Gothic cathedral arches, graceful floral foliage, restrained cross symbolism, and delicate gold filigree for a sacred holy matrimony.",
    tags: ["cathedral", "cross", "holy-matrimony", "arches", "elegant", "champagne", "white"],
    colors: { primary: "#1A2E44", secondary: "#C6A15B", accent: "#8B9DC3", bg: "#F8F4EE" },
    featured: true,
    badge: "Popular",
    image: "/templates/christian.png",
    perfectFor: ["Church Matrimony & Chapel Weddings", "Classic Black-Tie Celebrations"],
    includes: ["Arched Stained Glass Vignettes", "Hymnal Audio Toggle", "Order of Service Itinerary", "RSVP Guest Management"],
  },
  {
    id: "islamic",
    name: "Emerald Noor Nikah",
    category: "Nikah",
    culture: "Islamic",
    religion: "Islamic",
    theme: "Geometric",
    style: "Arabesque & Ornate",
    description: "Intricate Mashrabiya latticework, majestic mosque domes, hanging brass fanoos lanterns, and Quranic verse cartouches in deep emerald and gold.",
    tags: ["nikah", "islamic", "emerald", "lanterns", "geometric", "arabic", "walima"],
    colors: { primary: "#143D28", secondary: "#C6A15B", accent: "#2F7E53", bg: "#F4F7F2" },
    featured: true,
    badge: "Popular",
    image: "/templates/islamic.png",
    perfectFor: ["Nikah & Walima Ceremonies", "Cultural Islamic Celebrations"],
    includes: ["Animated Lantern Flickering", "Bismillah & Dua Display", "Multi-Event Nikah & Walima Cards", "Digital RSVP"],
  },
  {
    id: "rajasthani",
    name: "Haveli Splendor",
    category: "Wedding",
    culture: "North Indian",
    religion: "North Indian",
    theme: "Royal",
    style: "Regal Heritage",
    description: "Palatial arches, hand-painted royal peacocks, rich zardozi border work, and opulent crimson velvet textures from royal Rajasthan.",
    tags: ["rajasthani", "royal", "maroon", "palace", "peacock", "traditional", "haveli"],
    colors: { primary: "#4A0010", secondary: "#D4AF37", accent: "#7B1C35", bg: "#FDF6E3" },
    featured: true,
    badge: "Popular",
    image: "/templates/rajasthani.png",
    perfectFor: ["Royal Palace Weddings", "Destination Celebrations in Udaipur & Jaipur"],
    includes: ["Regal Palace Facade Motion", "Dhol & Shehnai Audio Track", "Phera & Baraat Program", "Venue Map Link"],
  },
  {
    id: "engagement",
    name: "Imperial Promise",
    category: "Engagement",
    culture: "Royal",
    religion: "All",
    theme: "Royal",
    style: "Romantic Luxury",
    description: "Twinkling champagne bubbles, interlocking diamond bands, soft dusty rose florals, and imperial amethyst gradients celebrating your official announcement.",
    tags: ["engagement", "ring-ceremony", "roka", "purple", "rose-gold", "luxury"],
    colors: { primary: "#3E1644", secondary: "#C6A15B", accent: "#B97878", bg: "#FAF3F5" },
    featured: true,
    image: "/templates/engagement.png",
    perfectFor: ["Roka, Engagement & Ring Ceremonies", "Intimate Cocktail Evenings"],
    includes: ["Animated Ring Glimmer", "Romantic Story Timeline", "Google Calendar Add", "Guest RSVP Confirmation"],
  },
  {
    id: "haldi-vibes",
    name: "Marigold Sunshine",
    category: "Haldi",
    culture: "Traditional",
    religion: "Hindu",
    theme: "Festive",
    style: "Joyous & Vibrant",
    description: "Cascading fresh marigold garlands, earthen brass urli bowls, festive turmeric hues, and sunshine energy for the playful pre-wedding morning.",
    tags: ["haldi", "marigold", "turmeric", "yellow", "urli", "festive", "morning"],
    colors: { primary: "#C97A00", secondary: "#D97706", accent: "#F59E0B", bg: "#FEF9E7" },
    featured: false,
    image: "/templates/haldi.png",
    perfectFor: ["Haldi, Pithi, and Mayun Rituals", "Sunny Outdoor Poolside Functions"],
    includes: ["Garland Sway Animations", "Dress Code Tip (Yellow/Mustard)", "Event Timeline", "Music Ambience"],
  },
  {
    id: "mehendi-magic",
    name: "Henna Garden",
    category: "Mehendi",
    culture: "Traditional",
    religion: "Hindu",
    theme: "Boho",
    style: "Intricate Floral",
    description: "Detailed paisley henna motifs, vibrant bohemian botanical greens, playful tassels, and artistic charm for a magical Mehendi celebration.",
    tags: ["mehendi", "henna", "paisley", "boho", "green", "patterns", "tassels"],
    colors: { primary: "#1E5E3A", secondary: "#C6A15B", accent: "#6AA84F", bg: "#F2FAF4" },
    featured: false,
    image: "/templates/mehendi.png",
    perfectFor: ["Mehendi & Sangeet Evenings", "Boho Garden Celebrations"],
    includes: ["Intricate Henna Pattern Reveal", "Folk Beats Ambience", "Photo Moments Gallery", "Directions to Venue"],
  },
  {
    id: "sangeet-night",
    name: "Starlight Sangeet",
    category: "Sangeet",
    culture: "Modern",
    religion: "Hindu",
    theme: "Vibrant",
    style: "Celebratory & Glitz",
    description: "Electrifying dance floor lighting, gold disco accents, musical instrument emblems, and celebration flair for an unforgettable night of music and dance.",
    tags: ["sangeet", "dance", "music", "night", "celebration", "glamour"],
    colors: { primary: "#2C124D", secondary: "#E6A15C", accent: "#D946EF", bg: "#1D0D33" },
    featured: false,
    badge: "Popular",
    image: "/templates/sangeet.png",
    perfectFor: ["Sangeet & Cocktail Nights", "DJ Dance Parties"],
    includes: ["Animated Starlight Background", "Performances Lineup Cards", "Song Request Note in RSVP"],
  },
  {
    id: "grand-reception",
    name: "Grand Ballroom Soirée",
    category: "Reception",
    culture: "Modern",
    religion: "All",
    theme: "Luxury",
    style: "Black-Tie Haute",
    description: "Cascading crystal chandeliers, warm candlelight reflections, champagne velvet tones, and sophisticated modern typography for an elite reception.",
    tags: ["reception", "black-tie", "luxury", "chandelier", "champagne", "formal"],
    colors: { primary: "#1A151D", secondary: "#C6A15B", accent: "#E8D7AE", bg: "#120E15" },
    featured: false,
    badge: "Popular",
    image: "/templates/reception.png",
    perfectFor: ["Evening Gala Receptions", "Formal Black-Tie Dinners"],
    includes: ["Crystal Light Shimmer", "Cocktail & Dinner Itinerary", "VIP RSVP Form with Dietary Preferences"],
  },
  {
    id: "minimal",
    name: "Editorial Atelier",
    category: "Wedding",
    culture: "Minimal",
    religion: "All",
    theme: "Minimal",
    style: "Clean & Architectural",
    description: "Understated luxury defined by generous white space, bespoke serif typography, deckled paper borders, and restrained champagne foil accents.",
    tags: ["minimal", "editorial", "clean", "chic", "modern", "monochrome", "neutral"],
    colors: { primary: "#2A2423", secondary: "#756C67", accent: "#C6A15B", bg: "#FBF9F5" },
    featured: true,
    badge: "Popular",
    image: "/templates/minimal.png",
    perfectFor: ["Contemporary City Weddings", "Art Gallery & Minimalist Unions"],
    includes: ["Deckled Stationery Frame", "Subtle Serif Motion", "Interactive RSVP & Map", "Add to Apple/Google Calendar"],
  },
  {
    id: "beach",
    name: "Coastal Serenade",
    category: "Wedding",
    culture: "Modern",
    religion: "All",
    theme: "Modern",
    style: "Coastal Romance",
    description: "Soft ocean watercolor washes, golden hour sunset glows, subtle palm frond silhouettes, and sea-breeze typography for idyllic beach celebrations.",
    tags: ["beach", "destination", "ocean", "sunset", "tropical", "seaside"],
    colors: { primary: "#0B4F6C", secondary: "#C6A15B", accent: "#D4738C", bg: "#F9FBFB" },
    featured: false,
    image: "/templates/beach.png",
    perfectFor: ["Goa, Bali, Phuket & Seaside Weddings", "Destination Celebrations"],
    includes: ["Gentle Wave Animations", "Weather & Sunset Times Guide", "Multi-day Itinerary Cards"],
  },
  {
    id: "vintage",
    name: "Gilded Heritage",
    category: "Wedding",
    culture: "Traditional",
    religion: "All",
    theme: "Vintage",
    style: "Victorian Romance",
    description: "Intricate Baroque gilded borders, warm parchment textures, timeless calligraphic crests, and heirloom romantic charm from an enchanted era.",
    tags: ["vintage", "baroque", "parchment", "crest", "calligraphy", "heirloom"],
    colors: { primary: "#231815", secondary: "#C6A15B", accent: "#8C4A3E", bg: "#F7F0E4" },
    featured: false,
    image: "/templates/vintage.png",
    perfectFor: ["Heritage Hotel & Fort Weddings", "Vintage Era Celebrations"],
    includes: ["Custom Monogram Crest", "Old-World Letterpress Texture", "Heirloom Love Story Timeline"],
  },
  {
    id: "tamil",
    name: "Mangala Isai",
    category: "Wedding",
    culture: "South Indian",
    religion: "South Indian",
    theme: "Traditional",
    style: "Auspicious Heritage",
    description: "Auspicious Nadaswaram and Thavil motifs, traditional banana tree gateways, pure turmeric kumkum emblems, and authentic Tamil wedding rituals.",
    tags: ["tamil", "mangala-isai", "nadaswaram", "traditional", "red", "gold", "chennai"],
    colors: { primary: "#7A0012", secondary: "#C6A15B", accent: "#D48B28", bg: "#FFFDF2" },
    featured: false,
    image: "/templates/tamil.png",
    perfectFor: ["Traditional Tamil Brahmin & South Indian Weddings", "Seer Varisai Events"],
    includes: ["Mangala Vathiyam Ambience", "Auspicious Lagnam Countdown", "Bilingual Tamil/English Headers"],
  },
  {
    id: "fairytale",
    name: "Enchanted Bloom",
    category: "Wedding",
    culture: "Modern",
    religion: "All",
    theme: "Magic",
    style: "Dreamy & Whimsical",
    description: "Magical botanical gardens, delicate pastel watercolor washes, sparkling stardust particles, and romantic European fairy-tale romance.",
    tags: ["fairytale", "pastel", "blush", "castle", "magic", "whimsical", "romantic"],
    colors: { primary: "#4A2B4A", secondary: "#C6A15B", accent: "#B97878", bg: "#FAF4F7" },
    featured: false,
    image: "/templates/fairytale.png",
    perfectFor: ["Garden & Castle Weddings", "Springtime Celebrations"],
    includes: ["Floating Petal Animation", "Orchestral Waltz Audio", "Couple Story Timeline"],
  },
  {
    id: "bollywood",
    name: "Bollywood Glamour",
    category: "Wedding",
    culture: "North Indian",
    religion: "All",
    theme: "Glamour",
    style: "Cinematic & Festive",
    description: "Dramatic marquee lights, vintage movie poster typography, cinematic starbursts, and celebration flair for couples whose love is pure cinema.",
    tags: ["bollywood", "cinema", "glamour", "filmi", "dramatic", "fun"],
    colors: { primary: "#7A0E18", secondary: "#D4AF37", accent: "#E59825", bg: "#FFFDF0" },
    featured: false,
    image: "/templates/bollywood.png",
    perfectFor: ["Bollywood Themed Sangeet & Weddings", "Cinematic Love Stories"],
    includes: ["Marquee Light Pulse", "Cinematic Filmstrip Gallery", "Soundtrack Autoplay Ready"],
  },
  {
    id: "baby-shower",
    name: "Little Blessing",
    category: "Baby Shower",
    culture: "Minimal",
    religion: "All",
    theme: "Cute",
    style: "Soft Warmth",
    description: "Soft clouds, golden crescent moons, gentle warm pastels, and joyful warmth welcoming the newest soul to the family tree.",
    tags: ["baby-shower", "valaikappu", "godh-bharai", "crescent", "pastels", "blessing"],
    colors: { primary: "#204652", secondary: "#C6A15B", accent: "#E0987A", bg: "#F6FAF9" },
    featured: false,
    image: "/templates/baby-shower.png",
    perfectFor: ["Baby Showers, Seemantham & Godh Bharai", "Cradle Ceremonies"],
    includes: ["Gentle Star Twinkle", "Blessings & Wishes Guest Book", "Gift Registry Link"],
  },
  {
    id: "bridal-shower",
    name: "Botanical Soirée",
    category: "Bridal Shower",
    culture: "Modern",
    religion: "All",
    theme: "Elegant",
    style: "Chic Brunch",
    description: "Fresh pressed wildflower botanicals, crisp mimosa brunch aesthetic, elegant rose typography, and joyful sisterhood celebrations.",
    tags: ["bridal-shower", "bachelorette", "brunch", "botanical", "champagne", "rose"],
    colors: { primary: "#422838", secondary: "#C6A15B", accent: "#B97878", bg: "#FBF7F8" },
    featured: false,
    image: "/templates/bridal-shower.png",
    perfectFor: ["Bridal Showers & Hen Parties", "Brunch & Tea Celebrations"],
    includes: ["Pressed Floral Layout", "Attire Guidance", "RSVP with Cocktail Choice"],
  },
];

export function getTemplateDefaultNames(templateId: string): { groomName: string; brideName: string } {
  switch (templateId) {
    case "islamic":
      return { groomName: "Zayn", brideName: "Fatima" };
    case "south-indian":
    case "tamil":
      return { groomName: "Karthik", brideName: "Deepika" };
    case "christian":
      return { groomName: "David", brideName: "Grace" };
    case "rajasthani":
      return { groomName: "Vikram", brideName: "Ananya" };
    case "haldi-vibes":
    case "mehendi-magic":
    case "sangeet-night":
      return { groomName: "Rohan", brideName: "Kavya" };
    case "grand-reception":
      return { groomName: "Kabir", brideName: "Tara" };
    default:
      return { groomName: "Arjun", brideName: "Priya" };
  }
}

export const CATEGORIES_OCCASION = [
  "All", "Wedding", "Engagement", "Haldi", "Mehendi", "Nikah", "Reception", "Sangeet", "Baby Shower", "Bridal Shower"
];

// Cultural filters per specification
export const CATEGORIES_CULTURE = [
  "All", "South Indian", "North Indian", "Christian", "Islamic", "Minimal", "Modern", "Royal", "Traditional"
];

export const CATEGORIES_FUNCTION = CATEGORIES_OCCASION.filter(c => c !== "All");
export const CATEGORIES_RELIGION = CATEGORIES_CULTURE.filter(c => c !== "All");

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free-preview",
    name: "Studio Preview",
    price: 0,
    currency: "₹",
    description: "Explore any design in real time with unlimited drafts",
    features: [
      "Access all 17 luxury templates",
      "Full live interactive preview",
      "Desktop & Mobile phone simulator",
      "Multi-event schedule customization",
      "No credit card required",
    ],
    cta: "Explore for Free",
    featured: false,
  },
  {
    id: "card-basic",
    name: "Stationery Card",
    price: 49,
    currency: "₹",
    description: "High-resolution digital cards for WhatsApp & Instagram",
    features: [
      "1 Matching Card Design",
      "Ultra-HD PNG & Printable PDF",
      "Instagram Story & Square crop formats",
      "Custom QR Code embed",
      "Instant direct download",
    ],
    cta: "Select Card",
    featured: false,
  },
  {
    id: "website-basic",
    name: "Digital Invitation",
    price: 99,
    currency: "₹",
    description: "Immersive animated web invitation for your guests",
    features: [
      "Interactive standalone invitation site",
      "Wax seal envelope opening experience",
      "Ambient celebration music toggle",
      "Live ceremony countdown timer",
      "Add to Google & Apple Calendar",
      "Self-contained HTML download",
    ],
    cta: "Select Invitation",
    featured: false,
  },
  {
    id: "combo",
    name: "Studio Suite",
    price: 149,
    currency: "₹",
    description: "Complete digital celebration suite — Save ₹49",
    features: [
      "Website + Matching Stationery Card",
      "Full interactive guest experience",
      "Interactive Guest RSVP collection",
      "RSVP Owner Dashboard with CSV Export",
      "Self-contained HTML + Full ZIP Package",
      "WhatsApp & QR Code share toolkit",
      "Unlimited edits for 1 full year",
    ],
    cta: "Unlock Studio Suite",
    featured: true,
    highlightBadge: "Most Popular",
  },
  {
    id: "premium",
    name: "Atelier Concierge",
    price: 249,
    currency: "₹",
    description: "All templates unlocked with VIP concierge support",
    features: [
      "All 17 Website + Card Templates",
      "AI Copywriting Assistant unlocked",
      "Multi-Language RSVP support",
      "High-Res QR code for stationery print",
      "Self-contained HTML + Offline ZIP",
      "Priority VIP studio concierge",
    ],
    cta: "Select Atelier",
    featured: false,
    highlightBadge: "Bespoke",
  },
];
