import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Users, Award, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/mice")({
  head: () => ({
    meta: [
      { title: `MICE — Corporate & Incentive Travel | ${SITE.name}` },
      { name: "description", content: "Meetings, Incentives, Conferences and Exhibitions across Europe — bespoke programmes for corporate clients." },
      { property: "og:title", content: `MICE — ${SITE.name}` },
      { property: "og:description", content: "Bespoke corporate travel, incentive trips, conferences and exhibitions across Europe." },
    ],
    links: [{ rel: "canonical", href: "/mice" }],
  }),
  component: MicePage,
});

const PILLARS = [
  { icon: Briefcase, title: "Meetings", text: "Board retreats, off-sites and executive workshops in inspiring European venues." },
  { icon: Award, title: "Incentives", text: "Reward your top performers with curated luxury experiences they'll talk about for years." },
  { icon: Users, title: "Conferences", text: "Full-service conference management with on-the-ground coordination across multiple cities." },
  { icon: Sparkles, title: "Exhibitions", text: "End-to-end logistics for trade shows and exhibitions across Europe's leading expo cities." },
];

function MicePage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Corporate Travel" title="MICE in Europe" subtitle="Meetings, Incentives, Conferences and Exhibitions — designed for impact." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-glow">
            <Link to="/contact">Request a proposal</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
