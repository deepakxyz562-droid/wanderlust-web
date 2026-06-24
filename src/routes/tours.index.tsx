import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/tours/")({
  component: ToursIndex,
});

function ToursIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("id,title,slug,short_description,duration_days,price_from,currency,featured_image")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <PageHeader eyebrow="Signature Journeys" title="All Tours" subtitle="Crafted itineraries across Europe's most loved destinations." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
          ))}
          {(data ?? []).map((t) => (
            <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {t.featured_image && <img src={t.featured_image} alt={t.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.duration_days} days</span>
                  <span className="font-semibold text-primary">from {formatPrice(t.price_from ? Number(t.price_from) : null, t.currency)}</span>
                </div>
                <h3 className="font-display text-xl font-semibold group-hover:text-primary">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.short_description}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:text-gold">
                  Discover journey <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
          {!isLoading && (data ?? []).length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">No tours published yet.</div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
