import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { PageHeader } from "./tours";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `Travel Journal — ${SITE.name}` },
      { name: "description", content: "Stories, guides and inspiration for your next European journey." },
      { property: "og:title", content: `Travel Journal — ${SITE.name}` },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id,title,slug,excerpt,featured_image,published_at,author_name")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <PageHeader eyebrow="Travel Journal" title="Stories & Guides" subtitle="Inspiration from our destination experts." />
      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[16/10] rounded-2xl bg-muted animate-pulse" />)}
          {(data ?? []).map((b) => (
            <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                {b.featured_image && <img src={b.featured_image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="text-xs text-muted-foreground">{b.author_name} · {b.published_at ? new Date(b.published_at).toLocaleDateString() : ""}</div>
              <h3 className="font-display text-xl font-semibold mt-1 group-hover:text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
