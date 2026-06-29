import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFeaturedTours(limit = 6) {
  return useQuery({
    queryKey: ["home", "featured-tours", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id,title,slug,short_description,duration_days,price_from,currency,featured_image,category,travel_styles",
        )
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllTours(limit = 12) {
  return useQuery({
    queryKey: ["home", "all-tours", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id,title,slug,short_description,duration_days,price_from,currency,featured_image,category",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useFeaturedDestinations(limit = 8) {
  return useQuery({
    queryKey: ["home", "featured-destinations", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("id,title,slug,country,short_description,featured_image")
        .eq("is_published", true)
        .order("title")
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLatestBlogs(limit = 3) {
  return useQuery({
    queryKey: ["home", "blogs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id,title,slug,excerpt,featured_image,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}
