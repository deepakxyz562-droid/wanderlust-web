import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Award, Calendar, Compass, Crown, Quote, Star } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VariationSwitcher } from "@/components/site/VariationSwitcher";
import { Button } from "@/components/ui/button";
import { formatPrice, SITE } from "@/lib/site";
import {
  useFeaturedDestinations,
  useFeaturedTours,
  useLatestBlogs,
} from "@/lib/home-data";
import heroEurope from "@/assets/hero-europe.jpg";
import destItaly from "@/assets/dest-italy.jpg";
import destParis from "@/assets/dest-paris.jpg";
import destSwitzerland from "@/assets/dest-switzerland.jpg";

export const Route = createFileRoute("/home/luxury")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Private Luxury Journeys of Europe` },
      { name: "description", content: SITE.description },
    ],
  }),
  component: LuxuryHome,
});

const GALLERY = [destParis, destItaly, destSwitzerland, heroEurope, destItaly, destParis];

function LuxuryHome() {
  const tours = useFeaturedTours(6);
  const destinations = useFeaturedDestinations(6);
  const blogs = useLatestBlogs(3);

  return (
    <SiteLayout>
      {/* HERO — single statement image, gold rule, serif headline */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-[#0a0f1e]">
        <img
          src={heroEurope}
          alt="Europe"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/80" />
        <div className="relative h-full w-full px-6 lg:px-16 flex flex-col">
          <div className="flex-1 grid place-items-center text-center text-white">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 text-gold text-[11px] tracking-[0.4em] uppercase">
                <span className="h-px w-10 bg-gold/60" /> Est. 2008 — Europe Specialists <span className="h-px w-10 bg-gold/60" />
              </div>
              <h1 className="mt-8 font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.02] tracking-tight">
                The art of <span className="italic text-gold-gradient">slow travel</span><br />
                through Europe.
              </h1>
              <p className="mt-8 text-base md:text-lg text-white/75 max-w-xl mx-auto leading-relaxed font-light">
                Privately escorted journeys. Five-star residences. Itineraries written by hand, for travellers who measure time in moments.
              </p>
              <div className="mt-10 flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-8 rounded-none font-semibold tracking-wide">
                  <Link to="/tours">View collection</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-none border-white/40 bg-transparent text-white hover:bg-white hover:text-primary">
                  <Link to="/contact">Speak to a designer</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="pb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-white border-t border-white/15 pt-6">
            {[
              { k: "15+", v: "Years curating" },
              { k: "30", v: "Countries" },
              { k: "5★", v: "Average stay" },
              { k: "24/7", v: "Concierge" },
            ].map((s) => (
              <div key={s.v} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-gold font-light">{s.k}</div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO — quiet, editorial */}
      <section className="bg-[#fbf8f3] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Crown className="h-6 w-6 text-gold mx-auto" />
          <p className="mt-8 font-display text-2xl md:text-3xl text-primary leading-snug font-light italic">
            "We do not sell holidays. We compose them — one private terrace, one Michelin table, one
            quiet morning in Florence at a time."
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">— The Founders</p>
        </div>
      </section>

      {/* DESTINATIONS — large editorial */}
      <section className="bg-[#fbf8f3] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 border-b border-primary/15 pb-6">
            <div>
              <div className="text-[11px] tracking-[0.35em] uppercase text-gold">01 — Destinations</div>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-light text-primary">Luxury Europe</h2>
            </div>
            <Link to="/destinations" className="text-sm text-primary border-b border-gold pb-0.5 hover:text-gold">All destinations</Link>
          </div>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {(destinations.data ?? []).slice(0, 4).map((d, i) => (
              <Link
                key={d.id}
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className={`group block ${i % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {d.featured_image && (
                    <img src={d.featured_image} alt={d.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{d.country}</div>
                    <h3 className="font-display text-3xl font-light text-primary mt-1">{d.title}</h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary group-hover:text-gold transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE JOURNEYS — list with numbering */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 border-b border-white/15 pb-6">
            <div>
              <div className="text-[11px] tracking-[0.35em] uppercase text-gold">02 — Signature Journeys</div>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-light">Featured tours</h2>
            </div>
            <Link to="/tours" className="text-sm border-b border-gold pb-0.5 hover:text-gold">All journeys</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(tours.data ?? []).slice(0, 3).map((t, i) => (
              <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-white/5 mb-5">
                  {t.featured_image ? (
                    <img src={t.featured_image} alt={t.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                  ) : (
                    <img src={GALLERY[i % GALLERY.length]} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                  )}
                </div>
                <div className="text-gold text-xs tracking-[0.3em]">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 font-display text-2xl font-light group-hover:text-gold transition">{t.title}</h3>
                <div className="mt-3 flex items-center justify-between text-xs text-white/60 uppercase tracking-widest">
                  <span>{t.duration_days} days</span>
                  <span className="text-gold">from {formatPrice(t.price_from ? Number(t.price_from) : null, t.currency)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#fbf8f3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold">03 — The Difference</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-light text-primary">Why travel with us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Crown, t: "Private by design", s: "Every journey is yours alone. No groups, no compromises." },
              { icon: Award, t: "Quiet luxury", s: "Suites, villas and estates that belong to families, not chains." },
              { icon: Compass, t: "Local conscience", s: "Guides chosen for their stories, not their scripts." },
            ].map((f) => (
              <div key={f.t} className="text-center">
                <f.icon className="h-7 w-7 text-gold mx-auto" />
                <h3 className="mt-5 font-display text-2xl font-light text-primary">{f.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative py-32 overflow-hidden">
        <img src={destItaly} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <Quote className="h-8 w-8 text-gold mx-auto" />
          <p className="mt-8 font-display text-2xl md:text-4xl font-light italic leading-snug">
            "Twelve days that re-arranged how we measure time. From a private morning at the Vatican
            to a starlit dinner above Lake Como — every detail considered."
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
          </div>
          <div className="mt-4 text-[11px] tracking-[0.3em] uppercase text-white/70">Mr & Mrs A. — London</div>
        </div>
      </section>

      {/* POPULAR COUNTRIES */}
      <section className="bg-[#fbf8f3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[11px] tracking-[0.35em] uppercase text-gold text-center">04 — Popular Countries</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-light text-primary text-center">Where to begin</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(destinations.data ?? []).slice(0, 8).map((d) => (
              <Link key={d.id} to="/destinations/$slug" params={{ slug: d.slug }} className="group relative aspect-square overflow-hidden">
                {d.featured_image && (
                  <img src={d.featured_image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-display text-xl font-light">{d.title}</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mt-1">{d.country}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-primary py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[11px] tracking-[0.35em] uppercase text-gold text-center">05 — Moments</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-light text-primary-foreground text-center">A travel diary</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((src, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 || i === 4 ? "md:row-span-2 md:aspect-auto aspect-square" : "aspect-square"}`}>
                <img src={src} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-[#fbf8f3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold">06 — The Process</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-light text-primary">From idea to itinerary</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "I", t: "Discovery", s: "A relaxed call to learn what moves you." },
              { n: "II", t: "Design", s: "A bespoke itinerary, drafted within 72 hours." },
              { n: "III", t: "Refine", s: "Adjust pace, properties and tables." },
              { n: "IV", t: "Travel", s: "On-the-ground concierge from arrival to departure." },
            ].map((p) => (
              <div key={p.n} className="border-t border-gold pt-6">
                <div className="font-display text-3xl text-gold font-light">{p.n}</div>
                <h3 className="mt-2 font-display text-xl text-primary">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="bg-[#fbf8f3] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 border-b border-primary/15 pb-6">
            <div>
              <div className="text-[11px] tracking-[0.35em] uppercase text-gold">07 — Journal</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-light text-primary">Editor's notes</h2>
            </div>
            <Link to="/blog" className="text-sm text-primary border-b border-gold pb-0.5 hover:text-gold">All posts</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(blogs.data ?? []).map((b) => (
              <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block">
                <div className="aspect-[4/3] overflow-hidden mb-5">
                  {b.featured_image && <img src={b.featured_image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> {b.published_at ? new Date(b.published_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : ""}
                </div>
                <h3 className="mt-3 font-display text-2xl font-light text-primary group-hover:text-gold transition">{b.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[11px] tracking-[0.35em] uppercase text-gold">08 — Newsletter</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-light">A quarterly letter</h2>
          <p className="mt-3 text-white/70 text-sm">Quiet recommendations, never noise.</p>
          <form className="mt-8 flex max-w-md mx-auto border-b border-gold pb-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-white/40 px-2" />
            <button className="text-gold text-xs uppercase tracking-[0.3em] hover:text-white">Subscribe</button>
          </form>
        </div>
      </section>

      <VariationSwitcher />
    </SiteLayout>
  );
}
