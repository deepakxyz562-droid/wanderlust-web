import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Check, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, whatsappLink, SITE } from "@/lib/site";

async function fetchTour(slug: string) {
  const { data, error } = await supabase
    .from("tours")
    .select("*, destinations(title,slug,country)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ params }) => {
    const tour = await fetchTour(params.slug);
    if (!tour) throw notFound();
    return tour;
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.seo_title ?? loaderData?.title ?? "Tour"} — ${SITE.name}` },
      { name: "description", content: loaderData?.seo_description ?? loaderData?.short_description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "" },
      { property: "og:description", content: loaderData?.short_description ?? "" },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/tours/${params.slug}` },
      ...(loaderData?.featured_image ? [{ property: "og:image", content: loaderData.featured_image }] : []),
    ],
    links: [{ rel: "canonical", href: `/tours/${params.slug}` }],
  }),
  errorComponent: ({ error }) => <div className="container-page py-20">{error.message}</div>,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Tour not found</h1>
        <Link to="/tours" className="mt-4 inline-block text-primary underline">Back to tours</Link>
      </div>
    </SiteLayout>
  ),
  component: TourDetail,
});

function TourDetail() {
  const tour = Route.useLoaderData();
  const { data: related } = useQuery({
    queryKey: ["related-tours", tour.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("tours")
        .select("id,title,slug,featured_image,duration_days,price_from,currency,short_description")
        .eq("is_published", true)
        .neq("id", tour.id)
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        {tour.featured_image && <img src={tour.featured_image} alt={tour.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container-page h-full flex flex-col justify-end pb-12 text-white">
          <Link to="/tours" className="inline-flex items-center gap-2 text-sm opacity-90 hover:text-gold mb-4 self-start">
            <ArrowLeft className="h-4 w-4" /> All tours
          </Link>
          {tour.destinations && (
            <div className="flex items-center gap-1 text-sm text-gold mb-2"><MapPin className="h-4 w-4" /> {tour.destinations.title}, {tour.destinations.country}</div>
          )}
          <h1 className="font-display text-4xl md:text-6xl font-bold max-w-3xl">{tour.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur px-3 py-1 rounded-full"><Calendar className="h-3 w-3" /> {tour.duration_days} days</span>
            <span className="inline-flex items-center gap-1 bg-gold text-gold-foreground px-3 py-1 rounded-full font-semibold">From {formatPrice(tour.price_from ? Number(tour.price_from) : null, tour.currency)}</span>
          </div>
        </div>
      </section>

      <section className="container-page py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-3xl text-primary mb-4">Overview</h2>
            <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{tour.description ?? tour.short_description}</p>
          </div>
          {tour.highlights?.length > 0 && (
            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-3"><Check className="h-5 w-5 text-gold mt-0.5 shrink-0" /> <span>{h}</span></li>
                ))}
              </ul>
            </div>
          )}
          {tour.inclusions?.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl text-primary mb-3">What's included</h3>
                <ul className="space-y-2 text-sm">
                  {tour.inclusions.map((h: string) => <li key={h} className="flex items-start gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> {h}</li>)}
                </ul>
              </div>
              {tour.exclusions?.length > 0 && (
                <div>
                  <h3 className="font-display text-xl text-primary mb-3">Not included</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tour.exclusions.map((h: string) => <li key={h}>— {h}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border bg-card p-6 shadow-card">
            <div className="text-sm text-muted-foreground">From</div>
            <div className="text-3xl font-display font-bold text-primary">{formatPrice(tour.price_from ? Number(tour.price_from) : null, tour.currency)}</div>
            <div className="text-xs text-muted-foreground">per person, twin share</div>
            <Button asChild className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary-glow">
              <Link to="/contact" search={{ tour: tour.slug }}>Enquire about this tour</Link>
            </Button>
            <a
              href={whatsappLink(`Hi! I'd love more details on "${tour.title}".`)}
              target="_blank" rel="noopener noreferrer"
              className="mt-3 block w-full text-center rounded-md bg-[#25D366] text-white py-2.5 text-sm font-medium hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
            <p className="mt-4 text-xs text-muted-foreground">No-obligation quote. Tailor-made variations available.</p>
          </div>
        </aside>
      </section>

      {(related ?? []).length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="container-page">
            <h2 className="font-display text-3xl text-primary mb-8">You may also like</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related!.map((t) => (
                <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group block rounded-2xl bg-card overflow-hidden shadow-card hover:shadow-elegant transition">
                  <div className="aspect-[4/3] overflow-hidden">{t.featured_image && <img src={t.featured_image} alt={t.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />}</div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.short_description}</p>
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
