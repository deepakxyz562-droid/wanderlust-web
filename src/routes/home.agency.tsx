import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Headphones,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VariationSwitcher } from "@/components/site/VariationSwitcher";
import { Button } from "@/components/ui/button";
import { formatPrice, SITE } from "@/lib/site";
import { TOUR_CATEGORIES } from "@/lib/menu";
import {
  useAllTours,
  useFeaturedDestinations,
  useFeaturedTours,
  useLatestBlogs,
} from "@/lib/home-data";
import heroEurope from "@/assets/hero-europe.jpg";

export const Route = createFileRoute("/home/agency")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Europe Tour Packages & Holidays` },
      { name: "description", content: SITE.description },
    ],
  }),
  component: AgencyHome,
});

function AgencyHome() {
  const navigate = useNavigate();
  const featured = useFeaturedTours(6);
  const popular = useAllTours(8);
  const destinations = useFeaturedDestinations(8);
  const blogs = useLatestBlogs(3);
  const [q, setQ] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/tours", search: { q: q.trim() } });
  };

  const faqs = [
    { q: "How early should I book my Europe tour?", a: "We recommend 4–6 months ahead for peak season (May–September). Off-season bookings can be confirmed within weeks." },
    { q: "Are visas and flights included?", a: "Tours include accommodation, transfers and listed experiences. Flights and visas are quoted separately so you stay in control." },
    { q: "Can the itinerary be customised?", a: "Yes. Every package can be tailored — extend nights, swap cities, upgrade hotels or add private guides." },
    { q: "What is your cancellation policy?", a: "Most packages allow free changes up to 60 days before departure. Full terms are shared at booking." },
  ];

  return (
    <SiteLayout>
      {/* HERO with search */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <img src={heroEurope} alt="Europe" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 text-gold border border-gold/30 px-3 py-1 text-xs font-medium">
              <Tag className="h-3 w-3" /> Best Selling Europe Tour Packages 2026
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-tight">
              Plan your dream <br /> <span className="text-gold-gradient">Europe holiday</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              500+ curated packages across 30 countries. Honest prices, expert advisors and 24×7 on-trip support.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={onSearch} className="mt-10 bg-background rounded-2xl shadow-elegant p-3 md:p-2 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2 max-w-4xl">
            <div className="flex items-center gap-2 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search destinations, tours, e.g. ‘Italy’, ‘Rail’…"
                className="bg-transparent text-foreground outline-none flex-1 text-sm"
              />
            </div>
            <select className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border">
              <option>Any duration</option>
              <option>1–6 days</option>
              <option>7–10 days</option>
              <option>11+ days</option>
            </select>
            <select className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border">
              <option>Any category</option>
              {TOUR_CATEGORIES.map((c) => <option key={c.slug}>{c.label}</option>)}
            </select>
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90 h-11 px-6">
              Search <Search className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/85">
            {[
              { icon: CheckCircle2, t: "ATOL Protected" },
              { icon: Star, t: "4.9 / 5 (2,000+ reviews)" },
              { icon: Headphones, t: "24×7 Support" },
              { icon: Users, t: "Family-run since 2008" },
            ].map((b) => (
              <div key={b.t} className="inline-flex items-center gap-2"><b.icon className="h-4 w-4 text-gold" />{b.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="Featured" title="Top Europe tours" link="/tours" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(featured.data ?? []).slice(0, 6).map((t) => (
              <PackageCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      </section>

      {/* MOST POPULAR */}
      <section className="bg-secondary/40 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="Most Booked" title="Most popular packages" link="/tours" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(popular.data ?? []).slice(0, 8).map((t) => (
              <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group block bg-background rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition">
                <div className="relative aspect-[4/3] bg-muted">
                  {t.featured_image && <img src={t.featured_image} alt={t.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <span className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Bestseller</span>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.duration_days ?? "—"} days</div>
                  <h3 className="mt-1 font-semibold text-foreground line-clamp-2 group-hover:text-primary">{t.title}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">from</div>
                    <div className="font-display font-bold text-primary">{formatPrice(t.price_from ? Number(t.price_from) : null, t.currency)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="Destinations" title="Tour by country" link="/destinations" />
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {(destinations.data ?? []).slice(0, 8).map((d) => (
              <Link key={d.id} to="/destinations/$slug" params={{ slug: d.slug }} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
                {d.featured_image && <img src={d.featured_image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs opacity-80 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.country}</div>
                  <div className="font-display text-xl font-bold mt-1">{d.title}</div>
                  <div className="text-xs text-gold mt-1 inline-flex items-center gap-1">Explore packages <ArrowRight className="h-3 w-3" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-secondary/40 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="By Style" title="Tour categories" />
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {TOUR_CATEGORIES.map((c) => (
              <Link key={c.slug} to="/tours/category/$category" params={{ category: c.slug }} className="group bg-background rounded-xl p-6 border border-border hover:border-gold hover:shadow-card transition">
                <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary group-hover:bg-gold group-hover:text-gold-foreground transition">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{c.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.blurb}</p>
                <div className="mt-3 text-xs text-primary group-hover:text-gold inline-flex items-center gap-1">View packages <ArrowRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="Reviews" title="Loved by 10,000+ travellers" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "Priya & Arjun", r: "Honeymoon · Switzerland", q: "Every transfer was on the minute. Our hotel in Lucerne had champagne on arrival." },
              { n: "The Kapoors", r: "Family · Italy", q: "Kids loved the private gondola in Venice. Itinerary perfectly paced for grandparents too." },
              { n: "Rohan M.", r: "Solo · Rail Europe", q: "Brilliant rail itinerary. Felt premium without being stiff. Will book again." },
            ].map((t) => (
              <div key={t.n} className="rounded-xl border border-border p-6 bg-secondary/30">
                <div className="flex text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.q}"</p>
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="font-semibold text-foreground">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="bg-secondary/40 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader kicker="Travel Blog" title="Tips & guides" link="/blog" />
          <div className="grid gap-6 md:grid-cols-3">
            {(blogs.data ?? []).map((b) => (
              <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group bg-background rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition">
                <div className="aspect-[16/10] bg-muted overflow-hidden">
                  {b.featured_image && <img src={b.featured_image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">{b.published_at ? new Date(b.published_at).toLocaleDateString() : ""}</div>
                  <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary line-clamp-2">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader kicker="FAQ" title="Frequently asked" center />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-border bg-secondary/20">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-semibold text-foreground">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Talk to a Europe expert</h2>
            <p className="mt-4 text-white/80">Tell us your dates and dream destinations — get a tailor-made quote within 24 hours.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/contact">Get a free quote <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"><a href={`tel:${SITE.phone}`}><Phone className="mr-2 h-4 w-4" /> Call now</a></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "10K+", v: "Happy travellers" },
              { k: "30", v: "Countries covered" },
              { k: "500+", v: "Packages" },
              { k: "24×7", v: "Support" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="font-display text-3xl text-gold font-bold">{s.k}</div>
                <div className="text-sm text-white/70 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VariationSwitcher />
    </SiteLayout>
  );
}

function SectionHeader({ kicker, title, link, center }: { kicker: string; title: string; link?: string; center?: boolean }) {
  return (
    <div className={`mb-10 flex ${center ? "flex-col items-center text-center" : "items-end justify-between"} gap-4`}>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{kicker}</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-primary">{title}</h2>
      </div>
      {link && !center && <Link to={link} className="text-sm font-semibold text-primary hover:text-gold inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
}

function PackageCard({ tour }: { tour: any }) {
  return (
    <Link to="/tours/$slug" params={{ slug: tour.slug }} className="group bg-background rounded-2xl overflow-hidden border border-border hover:shadow-elegant hover:-translate-y-1 transition">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {tour.featured_image && <img src={tour.featured_image} alt={tour.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">{tour.category ?? "Tour"}</span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-background/95 text-foreground text-xs font-semibold px-2 py-1 rounded">
          <Star className="h-3 w-3 fill-gold text-gold" /> 4.9
        </span>
      </div>
      <div className="p-5">
        <div className="text-xs text-muted-foreground inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {tour.duration_days ?? "—"} days</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Free changes</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-primary line-clamp-2">{tour.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{tour.short_description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="font-display text-xl font-bold text-primary">{formatPrice(tour.price_from ? Number(tour.price_from) : null, tour.currency)}</div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-gold">Details <ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
