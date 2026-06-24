import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsIndex,
});

function DestinationsIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("id,title,slug,country,short_description,featured_image")
        .eq("is_published", true)
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <SiteLayout>
      <PageHeader eyebrow="Where to next?" title="Destinations" subtitle="Hand-picked corners of Europe." />
      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}
          {(data ?? []).map((d) => (
            <Link key={d.id} to="/destinations/$slug" params={{ slug: d.slug }} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
              {d.featured_image && <img src={d.featured_image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="text-xs flex items-center gap-1 opacity-80"><MapPin className="h-3 w-3" /> {d.country}</div>
                <div className="font-display text-2xl font-semibold mt-1">{d.title}</div>
                <p className="text-sm opacity-85 mt-1 line-clamp-2">{d.short_description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
