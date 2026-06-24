import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Compass, Heart, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${SITE.name}` },
      { name: "description", content: `${SITE.name} is a specialist Europe travel company crafting escorted tours and tailor-made journeys since 2008.` },
      { property: "og:title", content: `About — ${SITE.name}` },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title="Europe is our home." subtitle="A team of specialists devoted to one continent — yours to discover." />
      <section className="container-page py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl text-primary">Curated by Europe specialists</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            Since 2008, the Europe Tourism Bureau has helped travellers from every corner of the world discover the continent
            with depth, taste and effortless logistics. We craft escorted small-group journeys and bespoke private itineraries —
            always with locally-rooted partners and a 24/7 on-trip concierge.
          </p>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            From a sunrise gondola in Venice to a Glacier Express seat with your name on it, every detail matters. That's the
            promise behind every itinerary we send.
          </p>
          <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary-glow">
            <Link to="/contact">Talk to a specialist</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { i: Compass, t: "Specialists", s: "Europe-only since 2008." },
            { i: Heart, t: "Tailor-made", s: "Itineraries built around you." },
            { i: Award, t: "Awarded", s: "Top-rated by travellers worldwide." },
            { i: Users, t: "Small-group", s: "Max 18 guests on escorted tours." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl bg-card p-6 shadow-card">
              <f.i className="h-7 w-7 text-gold" />
              <div className="mt-3 font-display text-lg font-semibold">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.s}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
