// blog-daily-publish
// Cron entry point — runs once a day at 06:00 UTC.
// Pipeline:
//   1. Pick up to 3 topics: prioritize 'telegram' queued topics, then
//      'auto' fallback topics generated on the fly by the LLM.
//   2. For each: call blog-generate (English), then blog-translate (24 langs).
//   3. Ping Google + Bing IndexNow with the new URLs so they get crawled fast.
//
// Safe to invoke manually too: POST {} returns { picked, results }.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getLLM } from "../_shared/llm-router.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://megsyai.com";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

const POSTS_PER_DAY = 3;

const FALLBACK_TOPICS: { topic: string; angle: string }[] = [
  { topic: "How to generate consistent character images with AI in 2026", angle: "step-by-step workflow using Megsy AI image models with seed control and reference images" },
  { topic: "AI video generation comparison: Veo 3 vs Kling 2 vs Pixverse in 2026", angle: "side-by-side test with same prompt, latency, cost, and output quality" },
  { topic: "Prompt engineering patterns that actually work in 2026", angle: "5 reusable templates for image, video, and long-form writing with real examples" },
  { topic: "Building a creator stack with one AI platform instead of ten", angle: "cost breakdown, switching friction, and which tools to consolidate first" },
  { topic: "AI slides generation: from outline to deck in under 2 minutes", angle: "concrete walkthrough with Megsy AI slides, including image agent and export to PPTX" },
  { topic: "Faceswap and AI portraits: ethical use cases creators are paid for in 2026", angle: "client-work scenarios, consent checklist, and platform policy overview" },
  { topic: "Using AI to translate and localize a blog into 25 languages automatically", angle: "the pipeline, hreflang, quality control, and SEO impact after 90 days" },
  { topic: "Long-context AI coding agents vs Cursor in 2026", angle: "task-by-task benchmark on a real React + Supabase repo" },
  { topic: "AI image upscaling and restoration: which model wins in 2026", angle: "blind test across 4 upscalers on portraits, product shots, and old photos" },
  { topic: "From idea to monetized AI workflow in one weekend", angle: "concrete revenue path: niche, deliverable, pricing, first 5 clients" },
];

function pickFallback(n: number): { topic: string; angle: string }[] {
  const shuffled = [...FALLBACK_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function autoTopics(n: number): Promise<{ topic: string; angle?: string }[]> {
  const llm = await getLLM();
  if (!llm) { console.warn("autoTopics: no LLM available, using fallback"); return pickFallback(n); }
  try {
    const res = await fetch(llm.url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${llm.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: llm.mapModel("google/gemini-2.5-flash"),
        messages: [
          { role: "system", content: "You suggest SEO-strong blog topics for Megsy AI (all-in-one AI platform for image, video, chat, code, slides). Topics must reflect 2026 reader intent, have search volume potential, and never duplicate evergreen clichés. Always reply with valid JSON only." },
          { role: "user", content: `Return JSON with this exact shape: {"topics":[{"topic":"...","angle":"..."}]}. Provide ${n} items.\nFocus mix: practical tutorials, comparison breakdowns, workflow guides, AI industry analysis. No generic listicles.` },
        ],
        temperature: 0.9,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.warn("autoTopics: LLM HTTP", res.status, await res.text().catch(() => ""));
      return pickFallback(n);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const topics = Array.isArray(parsed.topics) ? parsed.topics.slice(0, n) : [];
    if (topics.length === 0) { console.warn("autoTopics: empty topics array, using fallback"); return pickFallback(n); }
    return topics;
  } catch (e) {
    console.warn("autoTopics error:", (e as Error).message);
    return pickFallback(n);
  }
}


async function callEdge(name: string, body: unknown): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text, status: res.status }; }
}

async function pingIndexNow(urls: string[]): Promise<void> {
  // IndexNow is honored by Bing, Yandex, Seznam, Naver and proxied to others.
  // Google does NOT participate but auto-discovers via sitemap ping below.
  const key = Deno.env.get("INDEXNOW_KEY");
  if (!key || urls.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
    });
  } catch (e) { console.warn("indexnow ping failed", e); }
}

async function pingGoogleSitemap(): Promise<void> {
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap-index.xml`)}`);
  } catch (e) { console.warn("google sitemap ping failed", e); }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    // 1. Pick queued telegram/manual topics first
    const { data: queued } = await supabase
      .from("blog_topic_queue")
      .select("id, topic, angle, requested_by")
      .eq("status", "queued")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(POSTS_PER_DAY);

    let topics: { id?: string; topic: string; angle?: string; requested_by?: string }[] = queued || [];

    if (topics.length < POSTS_PER_DAY) {
      const auto = await autoTopics(POSTS_PER_DAY - topics.length);
      topics = [...topics, ...auto.map((a) => ({ topic: a.topic, angle: a.angle }))];
    }

    if (topics.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: "no topics" }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Mark queued rows as picked
    const queuedIds = topics.map((t) => t.id).filter(Boolean) as string[];
    if (queuedIds.length) {
      await supabase.from("blog_topic_queue").update({ status: "picked", picked_at: new Date().toISOString() }).in("id", queuedIds);
    }

    const results: any[] = [];
    const newUrls: string[] = [];

    for (const t of topics) {
      try {
        const gen = await callEdge("blog-generate", { topic: t.topic, angle: t.angle, requested_by: t.requested_by });
        if (!gen?.post_id) { results.push({ topic: t.topic, ok: false, step: "generate", error: gen?.error || "unknown" }); continue; }
        newUrls.push(`${SITE_URL}/blog/${gen.slug}`);

        // Translate in chunks of 8 langs per invocation to stay within worker
        // resource limits; loop until no more pending langs (or 5 max passes).
        let translatedTotal = 0;
        for (let pass = 0; pass < 5; pass++) {
          const tr = await callEdge("blog-translate", { post_id: gen.post_id, max_langs: 8 });
          const okLangs = (tr?.results || []).filter((r: any) => r.ok).map((r: any) => r.lang);
          translatedTotal += okLangs.length;
          if (!tr?.results || tr.results.length === 0) break;
        }
        results.push({ topic: t.topic, ok: true, post_id: gen.post_id, slug: gen.slug, translated: translatedTotal });


        // Mark queue row done if it was a queued topic
        if (t.id) {
          await supabase.from("blog_topic_queue").update({
            status: "done", done_at: new Date().toISOString(), result_post_id: gen.post_id,
          }).eq("id", t.id);
        }
      } catch (e) {
        console.error("daily publish step failed", e);
        results.push({ topic: t.topic, ok: false, error: String(e?.message || e) });
        if (t.id) {
          await supabase.from("blog_topic_queue").update({
            status: "failed", error: String(e?.message || e),
          }).eq("id", t.id);
        }
      }
    }

    // 3. Notify search engines
    await Promise.all([pingGoogleSitemap(), pingIndexNow(newUrls)]);

    return new Response(JSON.stringify({ ok: true, picked: topics.length, results }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("blog-daily-publish error", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
