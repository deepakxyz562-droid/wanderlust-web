export const SITE = {
  name: "Europe Tourism Bureau",
  shortName: "ETB",
  tagline: "Curated Journeys Across Europe",
  description:
    "Plan luxury escorted tours and tailor-made holidays across Europe with the Europe Tourism Bureau.",
  email: "hello@europetourismbureau.com",
  phone: "+44 20 0000 0000",
  whatsappNumber: "447700000000", // international format, no +
  address: "London, United Kingdom",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
  },
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number | null | undefined, currency = "EUR") {
  if (value == null) return "On request";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}
