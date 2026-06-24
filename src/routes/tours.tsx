import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: `Tours — ${SITE.name}` },
      { name: "description", content: "Browse our curated collection of luxury European escorted tours and tailor-made holidays." },
      { property: "og:title", content: `Tours — ${SITE.name}` },
      { property: "og:url", content: "/tours" },
    ],
    links: [{ rel: "canonical", href: "/tours" }],
  }),
  component: () => <Outlet />,
});

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-page py-20 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">{eyebrow}</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl mx-auto opacity-85">{subtitle}</p>}
      </div>
    </section>
  );
}
