// Public dynamic sitemap for blog posts.
// Google crawlers fetch this — it includes every DB-published post so daily
// AI-generated articles get indexed automatically. Static file in public/
// can't track DB rows, so this endpoint is the source of truth.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://megsyai.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

function xmlEscape(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug,title,published_at,updated_at,hero_image_url")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5000);

    const urls = (posts || []).map((p: any) => {
      const lastmod = (p.updated_at || p.published_at || new Date().toISOString()).slice(0, 10);
      const img = p.hero_image_url
        ? `\n    <image:image><image:loc>${xmlEscape(p.hero_image_url)}</image:loc><image:title>${xmlEscape(p.title || "")}</image:title></image:image>`
        : "";
      return `  <url>
    <loc>${SITE_URL}/blog/${xmlEscape(p.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${img}
  </url>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
    });
  } catch (e) {
    return new Response(`<!-- sitemap error: ${String(e)} -->`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
