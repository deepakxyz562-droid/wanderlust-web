import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: `Destinations — ${SITE.name}` },
      { name: "description", content: "Explore the most iconic European destinations curated by our travel specialists." },
      { property: "og:title", content: `Destinations — ${SITE.name}` },
      { property: "og:url", content: "/destinations" },
    ],
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
  component: () => <Outlet />,
});
