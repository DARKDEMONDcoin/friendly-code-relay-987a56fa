// blog-generate
// Generates ONE high-quality English blog post from a topic and inserts
// it into blog_posts as the "original" of a new translation group.
// Designed for Google's helpful-content & E-E-A-T criteria: clear author
// signals, FAQ schema, depth ~2000-2800 words, original analysis.
//
// POST body: { topic: string, angle?: string, requested_by?: string }
// Returns:    { ok, post_id, translation_group_id, slug }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getLLM } from "../_shared/llm-router.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function ensureUniqueSlug(base: string, lang = "en"): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .eq("language", lang)
      .maybeSingle();
    if (!data) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

function readingMinutes(md: string): number {
  const words = md.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}

interface GenResult {
  title: string;
  slug_suggestion: string;
  meta_description: string;
  excerpt: string;
  content_md: string;        // 2000-2800 words, markdown
  keywords: string[];
  tags: string[];
  category: string;
  faq: { q: string; a: string }[];
  author_name: string;
}

const SYSTEM = `You are a senior content strategist writing for Megsy AI — an all-in-one AI creation platform.
You write for Google's Helpful-Content guidelines: original insight, first-hand examples, real numbers, and a clear point of view.
NEVER fabricate statistics, names, dates, or quotes. If you'd need a source you don't have, leave it out.
Use second-person voice ("you"), short paragraphs (2-3 sentences max), descriptive H2 / H3, and concrete examples.
Length target: 2200-2800 English words.`;

const USER_TEMPLATE = (topic: string, angle?: string) => `Write a high-quality, original SEO blog post for Megsy AI.

TOPIC: ${topic}
${angle ? `ANGLE / KEY ARGUMENT: ${angle}` : ""}

Return a single JSON object — no markdown fences, no commentary — with this exact shape:
{
  "title": "compelling 50-65 char title with primary keyword early",
  "slug_suggestion": "kebab-case-slug-under-80-chars",
  "meta_description": "140-158 char meta description with primary keyword + benefit + soft CTA",
  "excerpt": "2-sentence hook for cards",
  "content_md": "FULL markdown body, 2200-2800 words, starting with one strong opening paragraph (NO H1 — the page renders the title separately). Use H2 sections, occasional H3, bullet lists, and at least one comparison table in markdown. Include at least one concrete workflow example with steps. End with a 'Key takeaways' section.",
  "keywords": ["5-10 SEO keywords, primary first"],
  "tags": ["3-6 short tags"],
  "category": "AI Guides | AI Tools | Productivity | Creator Economy | SEO | Tutorials",
  "faq": [{"q":"natural question","a":"40-80 word answer"}, ...4-6 items],
  "author_name": "Megsy Editorial"
}

Hard rules:
- Do NOT use the phrase "in today's world", "in the rapidly evolving", "in the digital age" or any AI-cliché opener.
- Do NOT invent stats. If you'd cite a number, phrase it as a range or qualitative observation.
- Do NOT mention competitors by name negatively.
- Output MUST be a single valid JSON object and nothing else.`;

async function callLLM(topic: string, angle?: string): Promise<GenResult> {
  const llm = await getLLM();
  if (!llm) throw new Error("no LLM provider available");

  const body = {
    // Force Qwen-Max (highest Alibaba model) for SEO-grade English originals.
    model: llm.mapModel("qwen-max"),
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: USER_TEMPLATE(topic, angle) },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  };

  const res = await fetch(llm.url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${llm.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`LLM failed ${res.status}: ${txt.slice(0, 400)}`);
  }
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(cleaned) as GenResult;

  // Defensive defaults
  parsed.keywords = Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 12) : [];
  parsed.tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [];
  parsed.faq = Array.isArray(parsed.faq) ? parsed.faq.slice(0, 8) : [];
  if (!parsed.slug_suggestion) parsed.slug_suggestion = slugify(parsed.title);
  return parsed;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405, headers: cors });

  try {
    const { topic, angle, requested_by } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const gen = await callLLM(topic.trim(), angle?.trim());
    const slug = await ensureUniqueSlug(slugify(gen.slug_suggestion || gen.title), "en");
    const groupId = crypto.randomUUID();

    const contentMd = `$$md$$\n${gen.content_md}\n$$md$$`;

    const { data: inserted, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: gen.title,
        meta_description: gen.meta_description,
        excerpt: gen.excerpt,
        content_md: contentMd,
        keywords: gen.keywords,
        tags: gen.tags,
        category: gen.category || "AI Guides",
        author_name: gen.author_name || "Megsy Editorial",
        language: "en",
        status: "published",
        published_at: new Date().toISOString(),
        reading_minutes: readingMinutes(gen.content_md),
        translation_group_id: groupId,
        is_original: true,
        faq: gen.faq,
        jsonld: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: gen.title,
          description: gen.meta_description,
          keywords: gen.keywords.join(", "),
          inLanguage: "en",
          author: { "@type": "Organization", name: gen.author_name || "Megsy Editorial" },
          publisher: { "@type": "Organization", name: "Megsy AI" },
        },
      })
      .select("id")
      .single();

    if (error) throw error;
    if (requested_by) {
      await supabase.from("blog_topic_queue").update({
        status: "done",
        done_at: new Date().toISOString(),
        result_post_id: inserted!.id,
      }).eq("topic", topic).eq("status", "picked").limit(1);
    }

    return new Response(JSON.stringify({ ok: true, post_id: inserted!.id, translation_group_id: groupId, slug }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("blog-generate error", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
