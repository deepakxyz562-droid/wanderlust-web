import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Camera,
  Compass,
  Heart,
  Instagram,
  MapPin,
  Mountain,
  Play,
  Snowflake,
  Star,
  Train,
  TreePine,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VariationSwitcher } from "@/components/site/VariationSwitcher";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import {
  useFeaturedDestinations,
  useFeaturedTours,
  useLatestBlogs,
} from "@/lib/home-data";
import heroEurope from "@/assets/hero-europe.jpg";
import destItaly from "@/assets/dest-italy.jpg";
import destParis from "@/assets/dest-paris.jpg";
import destSwitzerland from "@/assets/dest-switzerland.jpg";

export const Route = createFileRoute("/home/modern")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Modern Europe Travel` },
      { name: "description", content: SITE.description },
    ],
  }),
  component: ModernHome,
});

const STYLES = [
  { slug: "family", label: "Family", icon: Users, blurb: "Magical for every age" },
  { slug: "honeymoon", label: "Honeymoon", icon: Heart, blurb: "Romance on every corner" },
  { slug: "luxury", label: "Luxury", icon: Star, blurb: "Quiet, private, refined" },
  { slug: "adventure", label: "Group", icon: Mountain, blurb: "Small groups, big stories" },
  { slug: "rail", label: "Rail Tours", icon: Train, blurb: "Window seats with views" },
];

const MAP_REGIONS = [
  { id: "west", label: "Western Europe", countries: ["France", "Spain", "Portugal", "Netherlands"], img: destParis },
  { id: "central", label: "Central Europe", countries: ["Germany", "Switzerland", "Austria", "Czechia"], img: destSwitzerland },
  { id: "south", label: "Southern Europe", countries: ["Italy", "Greece", "Croatia"], img: destItaly },
  { id: "north", label: "Northern Europe", countries: ["Norway", "Sweden", "Finland", "Iceland"], img: heroEurope },
];

function ModernHome() {
  const tours = useFeaturedTours(6);
  const destinations = useFeaturedDestinations(6);
  const blogs = useLatestBlogs(3);
  const [region, setRegion] = useState(MAP_REGIONS[0]);

  return (
    <SiteLayout>
      {/* HERO — full-bleed with floating chips */}
      <section className="relative h-[95vh] min-h-[640px] w-full overflow-hidden bg-black">
        <img src={heroEurope} alt="Europe" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/70" />

        {/* floating image cards */}
        <div className="hidden lg:block absolute top-24 right-12 z-10 rotate-3 w-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90">
          <img src={destItaly} alt="" className="aspect-[3/4] object-cover" />
        </div>
        <div className="hidden lg:block absolute bottom-32 right-40 z-10 -rotate-6 w-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90">
          <img src={destSwitzerland} alt="" className="aspect-square object-cover" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center text-white">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-1.5 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" /> Now booking Spring 2026
          </span>
          <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl font-black leading-[0.92] tracking-tight max-w-4xl">
            See Europe<br />
            <span className="italic font-light text-gold">differently.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/80 max-w-xl">
            Hand-built itineraries that swap tourist queues for golden-hour hideaways.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 items-center">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 h-14 px-8 rounded-full font-semibold text-base">
              <Link to="/tours">Start exploring <ArrowUpRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <button className="inline-flex items-center gap-3 text-white group">
              <span className="h-14 w-14 rounded-full bg-white/15 backdrop-blur grid place-items-center group-hover:bg-white group-hover:text-primary transition">
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </span>
              <span className="text-sm">Watch the film <span className="block text-xs text-white/60">2:14 min</span></span>
            </button>
          </div>

          {/* scroll meter */}
          <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
            <span className="h-px w-12 bg-white/40" /> Scroll to discover
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-primary text-primary-foreground py-6 overflow-hidden border-y border-gold/30">
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-2xl md:text-3xl font-display italic">
          {[..."Paris·Rome·Lucerne·Amsterdam·Vienna·Lisbon·Prague·Barcelona·Reykjavík·Athens·".split("·"), "Paris", "Rome", "Lucerne"].map((c, i) => (
            <span key={i} className="inline-flex items-center gap-12 text-white/90"><MapPin className="h-5 w-5 text-gold" />{c}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </section>

      {/* TOP DESTINATIONS — asymmetric */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">01 / Destinations</div>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">Top of the list</h2>
            </div>
            <Link to="/destinations" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold">All destinations <ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {(destinations.data ?? []).slice(0, 5).map((d, i) => {
              const layout = [
                "col-span-12 md:col-span-7 aspect-[4/3]",
                "col-span-12 md:col-span-5 aspect-[4/3]",
                "col-span-6 md:col-span-4 aspect-square",
                "col-span-6 md:col-span-4 aspect-square",
                "col-span-12 md:col-span-4 aspect-square",
              ];
              return (
                <Link
                  key={d.id}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className={`relative overflow-hidden rounded-3xl group ${layout[i]}`}
                >
                  {d.featured_image && <img src={d.featured_image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
                    <span className="self-end h-10 w-10 rounded-full bg-white/15 backdrop-blur grid place-items-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-gold">{d.country}</div>
                      <div className="font-display text-3xl md:text-4xl font-bold mt-1">{d.title}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP / REGIONS */}
      <section className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">02 / Explore</div>
          <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-none">Pick a region</h2>

          <div className="mt-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div className="space-y-2">
              {MAP_REGIONS.map((r) => {
                const active = r.id === region.id;
                return (
                  <button
                    key={r.id}
                    onMouseEnter={() => setRegion(r)}
                    onFocus={() => setRegion(r)}
                    onClick={() => setRegion(r)}
                    className={`w-full text-left rounded-2xl px-6 py-5 border transition ${
                      active ? "bg-gold text-gold-foreground border-gold" : "border-white/15 hover:border-gold/60 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-display text-2xl font-bold">{r.label}</div>
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div className={`mt-2 text-sm ${active ? "text-gold-foreground/80" : "text-white/60"}`}>
                      {r.countries.join(" · ")}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-3xl overflow-hidden">
              <img src={region.img} alt={region.label} className="absolute inset-0 h-full w-full object-cover transition-all duration-700" key={region.id} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs uppercase tracking-[0.3em] text-gold">Region</div>
                <div className="font-display text-4xl font-bold">{region.label}</div>
                <Button asChild className="mt-4 bg-white text-primary hover:bg-gold hover:text-gold-foreground">
                  <Link to="/destinations">Browse {region.label} <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAVEL STYLES */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">03 / Travel Styles</div>
          <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">How do you travel?</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
            {STYLES.map((s) => (
              <Link key={s.slug} to="/travel-styles/$style" params={{ style: s.slug }} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-primary text-white p-6 flex flex-col justify-between border border-border hover:border-gold transition">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/70 group-hover:from-gold/30 group-hover:via-primary/80 transition" />
                <s.icon className="relative h-8 w-8 text-gold" />
                <div className="relative">
                  <div className="font-display text-2xl font-bold">{s.label}</div>
                  <div className="text-xs text-white/70 mt-1">{s.blurb}</div>
                  <ArrowUpRight className="mt-4 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOP EXPERIENCES */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">04 / Experiences</div>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">Top experiences</h2>
            </div>
            <Link to="/tours" className="hidden md:inline-flex text-sm font-semibold text-primary hover:text-gold items-center gap-1">All experiences <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(tours.data ?? []).slice(0, 3).map((t) => (
              <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group bg-background rounded-3xl overflow-hidden border border-border hover:shadow-elegant transition">
                <div className="relative aspect-[5/6] overflow-hidden">
                  {t.featured_image && <img src={t.featured_image} alt={t.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-background/95 text-foreground text-xs font-bold px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-gold text-gold" /> 4.9
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.duration_days} days</div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-primary group-hover:text-gold transition">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.short_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEASONAL */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <img src={destSwitzerland} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-background/95 px-4 py-2 rounded-full text-sm font-semibold">
              <Snowflake className="h-4 w-4 text-primary" /> Winter 2026
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">05 / Seasonal</div>
            <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">Coming up: Alpine winter & spring tulips</h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">Pre-book the season's most photographed moments — Swiss winter peaks, Amsterdam tulip fields and Italian spring vineyards.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: Snowflake, t: "Dec — Feb", s: "Alpine winter" },
                { icon: TreePine, t: "Apr — May", s: "Tulip season" },
                { icon: Compass, t: "Jun — Aug", s: "Med summer" },
                { icon: Mountain, t: "Sep — Oct", s: "Vineyards" },
              ].map((s) => (
                <div key={s.s} className="rounded-2xl border border-border p-4">
                  <s.icon className="h-5 w-5 text-gold" />
                  <div className="font-semibold text-foreground mt-2">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.s}</div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary-glow">
              <Link to="/tours">View seasonal tours <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GALLERY / INSTAGRAM */}
      <section className="bg-primary py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10 text-white">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">06 / @europetb</div>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-none">From the road</h2>
            </div>
            <a href={SITE.socials.instagram} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold"><Instagram className="h-4 w-4" /> Follow</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {[destParis, destItaly, destSwitzerland, heroEurope, destItaly, destParis, destSwitzerland, heroEurope, destParis, destItaly, destSwitzerland, heroEurope].map((src, i) => (
              <a key={i} href={SITE.socials.instagram} className="group relative aspect-square overflow-hidden">
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition grid place-items-center">
                  <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">07 / Travellers</div>
            <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">Stories from the road</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "Sara · Amsterdam", q: "Felt like every recommendation was chosen for me — not for everyone." },
              { n: "Daniel · Vienna", q: "Brilliant balance of culture and quiet time. Already booking next year." },
              { n: "Maya · Rome", q: "A private cooking class with a nonna in Trastevere — unreal." },
            ].map((t) => (
              <div key={t.n} className="rounded-3xl bg-secondary/40 p-8 border border-border">
                <div className="flex text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-4 font-display text-xl text-foreground leading-snug">"{t.q}"</p>
                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">08 / Journal</div>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold text-primary leading-none">Field notes</h2>
            </div>
            <Link to="/blog" className="hidden md:inline-flex text-sm font-semibold text-primary hover:text-gold items-center gap-1">All posts <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(blogs.data ?? []).map((b) => (
              <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted mb-5">
                  {b.featured_image && <img src={b.featured_image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">{b.published_at ? new Date(b.published_at).toLocaleDateString() : ""}</div>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground group-hover:text-primary">{b.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="relative py-32 overflow-hidden bg-primary">
        <img src={heroEurope} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="font-display text-5xl md:text-7xl font-black leading-none">Where will <span className="italic font-light text-gold">you</span> go next?</h2>
          <p className="mt-6 text-lg text-white/80">Tell us your dream — we'll send back an itinerary within 24 hours.</p>
          <Button asChild size="lg" className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90 h-14 px-8 rounded-full font-semibold text-base">
            <Link to="/contact">Start the conversation <ArrowUpRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <VariationSwitcher />
    </SiteLayout>
  );
}
