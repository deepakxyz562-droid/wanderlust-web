import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Globe, MapPin, ShieldCheck, Star } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Luxury Escorted Tours of Europe` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — Luxury Escorted Tours of Europe` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const tours = useQuery({
    queryKey: ["featured-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("id,title,slug,short_description,duration_days,price_from,currency,featured_image")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const destinations = useQuery({
    queryKey: ["featured-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("id,title,slug,country,short_description,featured_image")
        .eq("is_published", true)
        .eq("is_featured", true)
        .limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });

  const blogs = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id,title,slug,excerpt,featured_image,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
        <img src={heroImg} alt="Sunset over Santorini, Greece" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container-page h-full flex flex-col justify-center text-white">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold border border-white/20">
              <Sparkles className="h-3 w-3" /> Curated since 2008
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
              Unforgettable Journeys <br />
              <span className="text-gold-gradient">across Europe</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
              From Mediterranean coasts to alpine peaks — escorted tours and tailor-made holidays designed by Europe specialists.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-6 text-base font-semibold">
                <Link to="/tours">Explore Tours <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur">
                <Link to="/contact">Plan with an expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-page py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Globe, t: "30+ Countries", s: "Across Europe" },
            { icon: ShieldCheck, t: "ATOL Protected", s: "Travel with confidence" },
            { icon: Star, t: "4.9 / 5", s: "From 2,000+ travellers" },
            { icon: Calendar, t: "24/7 Support", s: "On-trip concierge" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary grid place-items-center">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Signature Journeys</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold text-primary">Featured tours</h2>
          </div>
          <Link to="/tours" className="hidden md:inline-flex text-sm font-medium text-primary hover:text-gold items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(tours.data ?? []).map((t) => (
            <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elegant transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {t.featured_image && (
                  <img src={t.featured_image} alt={t.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.duration_days} days</span>
                  <span className="font-semibold text-primary">from {formatPrice(t.price_from ? Number(t.price_from) : null, t.currency)}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.short_description}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:text-gold">
                  Discover journey <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
          {tours.isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="bg-secondary/40 py-20">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Where to next?</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold text-primary">Iconic destinations</h2>
            <p className="mt-4 text-muted-foreground">Hand-picked corners of Europe, ready for your story.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(destinations.data ?? []).map((d) => (
              <Link key={d.id} to="/destinations/$slug" params={{ slug: d.slug }} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
                {d.featured_image && (
                  <img src={d.featured_image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="text-xs flex items-center gap-1 opacity-80"><MapPin className="h-3 w-3" /> {d.country}</div>
                  <div className="font-display text-2xl font-semibold mt-1">{d.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Travel Journal</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold text-primary">Inspiration & insights</h2>
          </div>
          <Link to="/blog" className="text-sm font-medium text-primary hover:text-gold inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(blogs.data ?? []).map((b) => (
            <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                {b.featured_image && (
                  <img src={b.featured_image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-8 md:px-16 py-16 text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold">Let's design your European journey</h2>
            <p className="mt-4 opacity-90">Speak with a destination specialist and we'll craft an itinerary built around you.</p>
            <Button asChild size="lg" className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-6 font-semibold">
              <Link to="/contact">Start planning <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
