// Menu taxonomy used by the mega menu and filter pages.

export type TourCategory = {
  slug: string;
  label: string;
  blurb: string;
};

export const TOUR_CATEGORIES: TourCategory[] = [
  { slug: "rail", label: "Rail Tours", blurb: "Scenic European train journeys" },
  { slug: "coach", label: "Coach Tours", blurb: "Escorted luxury coach holidays" },
  { slug: "van", label: "Private Van Tours", blurb: "Small-group bespoke vans" },
  { slug: "self-drive", label: "Self Drive Tours", blurb: "Drive your own itinerary" },
];

export type TravelStyle = {
  slug: string;
  label: string;
  blurb: string;
};

export const TRAVEL_STYLES: TravelStyle[] = [
  { slug: "family", label: "Family Tours", blurb: "Tailored for all ages" },
  { slug: "luxury", label: "Luxury Tours", blurb: "Five-star experiences" },
  { slug: "honeymoon", label: "Honeymoon Tours", blurb: "Romantic getaways" },
  { slug: "group", label: "Group Tours", blurb: "Departures with new friends" },
];

export type CountryLink = { slug: string; label: string };

// Fallback featured countries shown in the mega menu when destinations are still loading.
export const FEATURED_COUNTRIES: CountryLink[] = [
  { slug: "switzerland", label: "Switzerland" },
  { slug: "italy", label: "Italy" },
  { slug: "france", label: "France" },
  { slug: "austria", label: "Austria" },
  { slug: "germany", label: "Germany" },
  { slug: "netherlands", label: "Netherlands" },
  { slug: "united-kingdom", label: "United Kingdom" },
  { slug: "czech-republic", label: "Czech Republic" },
];
