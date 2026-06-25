import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SITE as FALLBACK, whatsappLink as fallbackWA } from "@/lib/site";

export type SiteSettings = {
  company_name: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  notify_email: string | null;
};

export function useSiteSettings() {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return (data ?? null) as SiteSettings | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const s = data;
  const merged = {
    name: s?.company_name || FALLBACK.name,
    tagline: s?.tagline || FALLBACK.tagline,
    description: s?.description || FALLBACK.description,
    email: s?.email || FALLBACK.email,
    phone: s?.phone || FALLBACK.phone,
    whatsappNumber: s?.whatsapp_number || FALLBACK.whatsappNumber,
    address: s?.address || FALLBACK.address,
    logoUrl: s?.logo_url || null,
    socials: {
      instagram: s?.instagram_url || FALLBACK.socials.instagram,
      facebook: s?.facebook_url || FALLBACK.socials.facebook,
      twitter: s?.twitter_url || FALLBACK.socials.twitter,
      youtube: s?.youtube_url || null,
      linkedin: s?.linkedin_url || null,
    },
  };

  function whatsappLink(message?: string) {
    const num = merged.whatsappNumber;
    const base = `https://wa.me/${num}`;
    if (!message) return base;
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  return { settings: merged, raw: s, whatsappLink, fallbackWhatsapp: fallbackWA };
}
