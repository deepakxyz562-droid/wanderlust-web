import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Bus, Train, Plane } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/etb-transports")({
  head: () => ({
    meta: [
      { title: `ETB Transports — Premium Ground Transfers | ${SITE.name}` },
      { name: "description", content: "Chauffeur-driven cars, luxury coaches, rail passes and airport transfers across Europe." },
      { property: "og:title", content: `ETB Transports — ${SITE.name}` },
      { property: "og:description", content: "Premium ground transport across Europe — cars, coaches, rail and airport transfers." },
    ],
    links: [{ rel: "canonical", href: "/etb-transports" }],
  }),
  component: TransportsPage,
});

const SERVICES = [
  { icon: Car, title: "Chauffeur Cars", text: "Mercedes S-Class, executive sedans and luxury SUVs with English-speaking drivers." },
  { icon: Bus, title: "Private Coaches", text: "Modern coaches and minivans for groups of 8 to 50, fully insured across Europe." },
  { icon: Train, title: "Rail Bookings", text: "Eurail passes, first-class TGV, ICE and Glacier Express seats with assistance at stations." },
  { icon: Plane, title: "Airport Transfers", text: "Meet & greet, flight tracking and door-to-door service at every major European hub." },
];

function TransportsPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="On the ground in Europe" title="ETB Transports" subtitle="Premium private transport — by road, rail or runway." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-glow">
            <Link to="/contact">Book a transfer</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
