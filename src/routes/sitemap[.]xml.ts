import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; lastmod?: string }[] = [
          { path: "/" },
          { path: "/tours" },
          { path: "/destinations" },
          { path: "/blog" },
          { path: "/about" },
          { path: "/contact" },
        ];
        const [{ data: tours }, { data: dests }, { data: posts }] = await Promise.all([
          supabase.from("tours").select("slug,updated_at").eq("is_published", true),
          supabase.from("destinations").select("slug,updated_at").eq("is_published", true),
          supabase.from("blogs").select("slug,updated_at").eq("is_published", true),
        ]);
        (tours ?? []).forEach((t) => entries.push({ path: `/tours/${t.slug}`, lastmod: t.updated_at ?? undefined }));
        (dests ?? []).forEach((d) => entries.push({ path: `/destinations/${d.slug}`, lastmod: d.updated_at ?? undefined }));
        (posts ?? []).forEach((p) => entries.push({ path: `/blog/${p.slug}`, lastmod: p.updated_at ?? undefined }));

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
          .map((e) => `  <url><loc>${BASE_URL}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
