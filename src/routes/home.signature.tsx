import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Award, Crown, Diamond, MapPin, Play, Quote, Sparkles, Star } from "lucide-react";
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
import destSwitz from "@/assets/dest-switzerland.jpg";

export const Route = createFileRoute("/home/signature")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Signature Luxury Small Group Journeys` },
      {
        name: "description",
        content:
          "Signature luxury small-group journeys across Europe. Handpicked hotels, exclusive experiences, seamless travel — crafted by our concierge team.",
      },
    ],
  }),
  component: SignatureHome,
});

const PROMISES = [
  { icon: Crown, title: "VIP Door-to-Door", body: "Private transfers, priority check-ins, and a Travelling Concierge who anticipates every detail." },
  { icon: Diamond, title: "Handpicked Hotels", body: "Grand palaces, boutique retreats, and heritage properties in landmark locations." },
  { icon: Sparkles, title: "Signature Experiences", body: "Doors that open only for our guests — private galleries, cellar dinners, cultural encounters." },
  { icon: Award, title: "Small Group, Big Care", body: "Groups capped at 24 travellers. Genuine connection, uncompromised service, room to breathe." },
];

const REGIONS = [
  { label: "Italy & Amalfi", img: destItaly, tours: 18 },
  { label: "France & Provence", img: destParis, tours: 14 },
  { label: "Swiss Alps", img: destSwitz, tours: 9 },
  { label: "Grand Europe", img: heroEurope, tours: 22 },
];

const REVIEWS = [
  { name: "Anita & Rakesh S.", tour: "Italian Concerto, 12 days", quote: "Every hotel, every private tour, every meal exceeded expectation. The Concierge remembered our anniversary with a candlelit dinner on the terrace." },
  { name: "Priya M.", tour: "Swiss Grandeur, 9 days", quote: "The Glacier Express in first class, the Matterhorn at sunrise. Effortless from door to door." },
  { name: "The Kapoor family", tour: "Grand European Odyssey, 21 days", quote: "Three generations, one unforgettable journey. Small group, big personalities, exquisite care." },
];

function SignatureHome() {
  const tours = useFeaturedTours(6);
  const destinations = useFeaturedDestinations(8);
  const blogs = useLatestBlogs(3);
  const list = tours.data ?? [];
  const destList = destinations.data ?? [];

  return (
    <SiteLayout>
      {/* HERO — full-bleed cinematic */}
      <section className="relative h-[94vh] min-h-[680px] w-full overflow-hidden bg-[#0a1024]">
        <img src={heroEurope} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1024]/40 via-[#0a1024]/30 to-[#0a1024]" />
        <div className="absolute inset-x-0 bottom-0 pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-ivory">
            <div className="flex items-center gap-3 text-gold text-[11px] tracking-[0.35em] uppercase mb-6">
              <span className="h-px w-10 bg-gold" /> Signature Collection · 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[92px] leading-[0.95] text-white max-w-5xl">
              The finer art of<br />
              <span className="italic text-gold">travelling Europe.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-white/80">
              Small-group luxury journeys, private departures and tailor-made itineraries — orchestrated end to end so you arrive to nothing but wonder.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-gold text-[#0a1024] hover:bg-gold/90 rounded-none px-8 h-12 tracking-[0.15em] uppercase text-xs font-semibold">
                <Link to="/tours">Explore Journeys</Link>
              </Button>
              <button className="inline-flex items-center gap-3 text-white/90 hover:text-gold transition group">
                <span className="h-11 w-11 rounded-full border border-white/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
                <span className="text-xs tracking-[0.25em] uppercase">Watch the film</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-[#0a1024]/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 text-ivory">
            {[
              ["27+", "Years crafting Europe"],
              ["24", "Guests, maximum"],
              ["120+", "Signature experiences"],
              ["4.9★", "Guest satisfaction"],
            ].map(([n, l]) => (
              <div key={l} className="py-6 px-4 first:pl-0">
                <div className="font-display text-3xl text-gold">{n}</div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE PILLARS */}
      <section className="bg-[#faf7f1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="grid lg:grid-cols-[380px_1fr] gap-14 items-end mb-16">
            <div>
              <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-4">The Signature Difference</div>
              <h2 className="font-display text-4xl md:text-5xl text-[#0a1024] leading-tight">
                Luxury is in the details you never have to think about.
              </h2>
            </div>
            <p className="text-[#0a1024]/70 text-lg leading-relaxed">
              From the private car at your door to the sommelier who already knows your preference — every element of a Signature journey is prepared, rehearsed, and personal.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#0a1024]/10">
            {PROMISES.map((p) => (
              <div key={p.title} className="bg-[#faf7f1] p-8 hover:bg-white transition group">
                <p.icon className="h-8 w-8 text-gold mb-6" strokeWidth={1.25} />
                <h3 className="font-display text-xl text-[#0a1024] mb-3">{p.title}</h3>
                <p className="text-sm text-[#0a1024]/65 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOURNEYS — editorial cards */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">Signature Journeys</div>
              <h2 className="font-display text-4xl md:text-5xl text-[#0a1024]">Trending for 2026</h2>
            </div>
            <Link to="/tours" className="inline-flex items-center gap-2 text-[#0a1024] hover:text-gold text-xs uppercase tracking-[0.25em] border-b border-[#0a1024]/20 hover:border-gold pb-1">
              View all journeys <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {list.slice(0, 6).map((t, i) => (
              <Link key={t.id} to="/tours/$slug" params={{ slug: t.slug }} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f0eadf]">
                  <img
                    src={t.featured_image || [destItaly, destParis, destSwitz, heroEurope][i % 4]}
                    alt={t.title}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-gold text-[#0a1024] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 font-semibold">
                    {t.category || "Signature"}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 text-[#0a1024] text-xs px-3 py-1.5 font-semibold">
                    {t.duration_days ? `${t.duration_days} Days` : "Bespoke"}
                  </div>
                </div>
                <div className="pt-5">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#0a1024]/50 mb-2">
                    Small group · Max 24
                  </div>
                  <h3 className="font-display text-xl text-[#0a1024] group-hover:text-gold transition leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-sm text-[#0a1024]/65 mt-2 line-clamp-2">
                    {t.short_description || "A meticulously curated journey through iconic landscapes and hidden treasures."}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#0a1024]/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-[#0a1024]/50">From</div>
                      <div className="font-display text-lg text-[#0a1024]">
                        {formatPrice(t.price_from, t.currency || "EUR")}
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[#0a1024] group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                </div>
              </Link>
            ))}
            {list.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#f0eadf] animate-pulse" />
              ))}
          </div>
        </div>
      </section>

      {/* REGIONS — dark editorial band */}
      <section className="bg-[#0a1024] text-ivory py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-4">Choose your Europe</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Regions crafted for the <span className="italic text-gold">discerning traveller</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REGIONS.map((r) => (
              <Link key={r.label} to="/destinations" className="group relative aspect-[3/4] overflow-hidden">
                <img src={r.img} alt={r.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1024] via-[#0a1024]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{r.tours} journeys</div>
                  <div className="font-display text-2xl text-white mb-3">{r.label}</div>
                  <div className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-16" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS PILLS */}
      {destList.length > 0 && (
        <section className="bg-[#faf7f1] py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">Every Corner of Europe</div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0a1024] mb-8">
              Where would you like to be transported?
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {destList.map((d) => (
                <Link
                  key={d.id}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="inline-flex items-center gap-2 border border-[#0a1024]/20 hover:border-gold hover:bg-white text-[#0a1024] hover:text-gold px-5 py-2.5 text-sm transition"
                >
                  <MapPin className="h-3.5 w-3.5" /> {d.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-1 text-gold mb-3">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">Loved by Travellers</div>
            <h2 className="font-display text-4xl md:text-5xl text-[#0a1024]">Stories from the road</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((r) => (
              <div key={r.name} className="border-t-2 border-gold pt-8">
                <Quote className="h-8 w-8 text-gold/40 mb-4" />
                <p className="text-[#0a1024] leading-relaxed mb-6 font-display text-lg italic">"{r.quote}"</p>
                <div className="text-sm font-semibold text-[#0a1024]">{r.name}</div>
                <div className="text-xs text-[#0a1024]/50 mt-0.5">{r.tour}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      {(blogs.data?.length ?? 0) > 0 && (
        <section className="bg-[#faf7f1] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">The Signature Journal</div>
                <h2 className="font-display text-4xl md:text-5xl text-[#0a1024]">Inspiration & insight</h2>
              </div>
              <Link to="/blog" className="text-xs uppercase tracking-[0.25em] text-[#0a1024] hover:text-gold border-b border-[#0a1024]/20 hover:border-gold pb-1">
                Read the journal →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.data!.map((b) => (
                <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block">
                  <div className="aspect-[4/3] overflow-hidden mb-5 bg-[#f0eadf]">
                    <img src={b.featured_image || destParis} alt={b.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Journal</div>
                  <h3 className="font-display text-xl text-[#0a1024] group-hover:text-gold transition leading-snug">{b.title}</h3>
                  {b.excerpt && <p className="text-sm text-[#0a1024]/65 mt-2 line-clamp-2">{b.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-[#0a1024] text-ivory py-28 overflow-hidden">
        <img src={destSwitz} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1024] via-[#0a1024]/85 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <Sparkles className="h-8 w-8 text-gold mx-auto mb-6" strokeWidth={1.25} />
          <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">
            Begin your <span className="italic text-gold">Signature</span> story.
          </h2>
          <p className="text-white/75 text-lg mt-6 max-w-xl mx-auto">
            Speak to a Journey Designer. We'll craft an itinerary as considered as you are.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-gold text-[#0a1024] hover:bg-gold/90 rounded-none px-8 h-12 tracking-[0.15em] uppercase text-xs font-semibold">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-[#0a1024] rounded-none px-8 h-12 tracking-[0.15em] uppercase text-xs font-semibold bg-transparent">
              <Link to="/tours">Browse Journeys</Link>
            </Button>
          </div>
        </div>
      </section>

      <VariationSwitcher />
    </SiteLayout>
  );
}
