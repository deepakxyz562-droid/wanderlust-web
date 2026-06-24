import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, SITE } from "@/lib/site";

async function fetchDestination(slug: string) {
  const { data, error } = await supabase.from("destinations").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) throw error;
  return data;
}

export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }) => {
    const d = await fetchDestination(params.slug);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title} — ${SITE.name}` },
      { name: "description", content: loaderData?.seo_description ?? loaderData?.short_description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "" },
      { property: "og:description", content: loaderData?.short_description ?? "" },
      { property: "og:url", content: `/destinations/${params.slug}` },
      ...(loaderData?.featured_image ? [{ property: "og:image", content: loaderData.featured_image }] : []),
    ],
    links: [{ rel: "canonical", href: `/destinations/${params.slug}` }],
  }),
  errorComponent: ({ error }) => <div className="container-page py-20">{error.message}</div>,
  notFoundComponent: () => (
    <SiteLayout><div className="container-page py-20 text-center">Destination not found.</div></SiteLayout>
  ),
  component: DestinationDetail,
});

function DestinationDetail() {
  const d = Route.useLoaderData();
  const { data: tours } = useQuery({
    queryKey: ["dest-tours", d.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("tours")
        .select("id,title,slug,short_description,duration_days,price_from,currency,featured_image")
        .eq("is_published", true)
        .eq("destination_id", d.id);
      return data ?? [];
    },
  });
  const { data: cities } = useQuery({
    queryKey: ["dest-cities", d.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("cities")
        .select("id,name,slug,short_description,featured_image,sort_order")
        .eq("destination_id", d.id)
        .eq("is_published", true)
        .order("sort_order")
        .order("name");
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <section className="relative h-[65vh] min-h-[400px] overflow-hidden">
        {d.featured_image && <img src={d.featured_image} alt={d.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container-page h-full flex flex-col justify-end pb-12 text-white">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm opacity-90 hover:text-gold mb-4 self-start">
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
          <div className="text-sm text-gold flex items-center gap-1"><MapPin className="h-4 w-4" /> {d.country}</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mt-2">{d.title}</h1>
        </div>
      </section>

      <section className="container-page py-16 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed whitespace-pre-line">{d.description ?? d.short_description}</p>
      </section>

      {(cities ?? []).length > 0 && (
        <section className="container-page pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Explore the city</span>
              <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">Top places in {d.title}</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {cities!.map((c) => (
              <article key={c.id} className="group rounded-2xl bg-card overflow-hidden shadow-card hover:shadow-elegant transition">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {c.featured_image && <img src={c.featured_image} alt={c.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-primary">{c.name}</h3>
                  {c.short_description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{c.short_description}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {(tours ?? []).length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="container-page">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Holiday packages</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary mt-2 mb-8">{d.title} tour packages</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {tours!.map((t) => (
                <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group block rounded-2xl bg-card overflow-hidden shadow-card hover:shadow-elegant transition">
                  <div className="aspect-[4/3] overflow-hidden">{t.featured_image && <img src={t.featured_image} alt={t.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />}</div>
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground">{t.duration_days} days · from {formatPrice(t.price_from ? Number(t.price_from) : null, t.currency)}</div>
                    <h3 className="font-display text-lg font-semibold mt-1">{t.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
