// Menu taxonomy used by the mega menu and filter pages.

export type CountryLink = { slug: string; label: string };

// Countries shown under "Europe Tour Packages".
export const EUROPE_COUNTRIES: CountryLink[] = [
  { slug: "italy", label: "Italy" },
  { slug: "switzerland", label: "Switzerland" },
  { slug: "austria", label: "Austria" },
  { slug: "france", label: "France" },
  { slug: "czech-republic", label: "Czech Republic" },
  { slug: "germany", label: "Germany" },
  { slug: "spain", label: "Spain" },
];

// Fallback when destinations table is still loading.
export const FEATURED_COUNTRIES = EUROPE_COUNTRIES;

export type TourCategory = { slug: string; label: string; blurb: string };

// "Theme Tours" — how you travel.
export const TOUR_CATEGORIES: TourCategory[] = [
  { slug: "rail", label: "Europe Rail Tour Packages", blurb: "Scenic European train journeys" },
  { slug: "van", label: "Private Van Tours", blurb: "Small-group bespoke vans" },
  { slug: "individual", label: "Individual Tour", blurb: "Tailor-made independent travel" },
  { slug: "self-drive", label: "Self Drive", blurb: "Drive your own itinerary" },
  { slug: "coach", label: "Escorted Coach Tours", blurb: "Luxury escorted coach holidays" },
];

export type TravelStyle = { slug: string; label: string; blurb: string };

// "Category" — why you travel.
export const TRAVEL_STYLES: TravelStyle[] = [
  { slug: "activities-switzerland", label: "Activities in Switzerland", blurb: "Alpine adventures & experiences" },
  { slug: "adventure", label: "Adventure Tours", blurb: "Thrills across the continent" },
  { slug: "beach", label: "Beach Tours", blurb: "Mediterranean shorelines" },
  { slug: "honeymoon", label: "Honeymoon Tour Packages", blurb: "Romantic getaways for two" },
  { slug: "culture-heritage", label: "Culture & Heritage Tours", blurb: "Historic cities & traditions" },
  { slug: "family", label: "Family Tour Packages", blurb: "Tailored for all ages" },
  { slug: "shopping", label: "Shopping Tours", blurb: "Luxury boutiques & markets" },
  { slug: "wildlife", label: "Wildlife Tour Packages", blurb: "Europe in the wild" },
  { slug: "winter", label: "Winter Tour Packages", blurb: "Snow, ski & festive markets" },
  { slug: "nature", label: "Nature Tours", blurb: "Lakes, peaks & countryside" },
  { slug: "festivals", label: "Festivals in Europe", blurb: "Iconic seasonal celebrations" },
];

export type SimpleLink = { to: string; label: string };

// "About Us" dropdown.
export const ABOUT_LINKS: SimpleLink[] = [
  { to: "/about", label: "About Company" },
  { to: "/contact", label: "Contact" },
  { to: "/faqs", label: "FAQs" },
  { to: "/blog", label: "Blog" },
];
