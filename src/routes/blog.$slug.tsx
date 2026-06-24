import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

async function fetchPost(slug: string) {
  const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) throw error;
  return data;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const p = await fetchPost(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title} — ${SITE.name}` },
      { name: "description", content: loaderData?.seo_description ?? loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${params.slug}` },
      ...(loaderData?.featured_image ? [{ property: "og:image", content: loaderData.featured_image }] : []),
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  errorComponent: ({ error }) => <div className="container-page py-20">{error.message}</div>,
  notFoundComponent: () => <SiteLayout><div className="container-page py-20 text-center">Post not found.</div></SiteLayout>,
  component: BlogDetail,
});

function BlogDetail() {
  const p = Route.useLoaderData();
  return (
    <SiteLayout>
      <article className="container-page py-16 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:text-gold mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>
        <div className="text-xs text-muted-foreground">{p.author_name} · {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2">{p.title}</h1>
        {p.featured_image && (
          <img src={p.featured_image} alt={p.title} className="w-full aspect-[16/9] object-cover rounded-2xl mt-8" />
        )}
        <div className="prose prose-lg mt-8 max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
          {p.content}
        </div>
      </article>
    </SiteLayout>
  );
}
