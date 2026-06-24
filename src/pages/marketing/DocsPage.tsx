// Megsy AI — Comprehensive Docs page (/docs)
// One long, fully-indexed reference for every feature on the site, plus
// PWA install instructions for iOS, Android, and Desktop with screenshots.
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Presentation,
  FileText,
  Microscope,
  Globe,
  Code2,
  GraduationCap,
  Users,
  Share2,
  Bell,
  Brain,
  Palette,
  Shield,
  Wallet,
  Gift,
  Link2,
  Smartphone,
  Monitor,
  Apple,
  Keyboard,
  HelpCircle,
  Rocket,
  Search,
  ChevronRight,
  CheckCircle2,
  Workflow,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import SEOHead from "@/components/common/SEOHead";

import pwaIos from "@/assets/docs/pwa-ios.png";
import pwaAndroid from "@/assets/docs/pwa-android.png";
import pwaDesktop from "@/assets/docs/pwa-desktop.png";

const LandingFooter = lazy(() => import("@/components/landing/LandingFooter"));

/* ─────────────────────────────────────────────────────────────────────── */
/* Data — every doc section in one structured list so the TOC, search and  */
/* page body stay in sync forever.                                         */
/* ─────────────────────────────────────────────────────────────────────── */

type DocBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; text: string; lang?: string }
  | { kind: "note"; text: string }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "link"; href: string; label: string };

interface DocSection {
  id: string;
  title: string;
  icon: LucideIcon;
  intro?: string;
  blocks: DocBlock[];
}

interface DocGroup {
  id: string;
  label: string;
  sections: DocSection[];
}

const GROUPS: DocGroup[] = [
  {
    id: "intro",
    label: "Introduction",
    sections: [
      {
        id: "overview",
        title: "What is Megsy AI?",
        icon: Sparkles,
        intro:
          "Megsy AI is an all-in-one creative & productivity platform built on a single shared credit balance (MC). One subscription unlocks chat, images, video, websites, code, presentations, documents, research, voice, music and more.",
        blocks: [
          { kind: "ul", items: [
            "One unified workspace for every modality — no tool-hopping.",
            "Powered by Megsy AI (our model) plus 80+ best-in-class third-party models.",
            "Works in any browser, installable as an app on iOS, Android, macOS, Windows and Linux.",
            "Privacy-first — your prompts and outputs are yours, never used to train other companies' models.",
          ]},
          { kind: "link", href: "/features-guide", label: "See the full features guide →" },
        ],
      },
      {
        id: "quickstart",
        title: "Quick start (60 seconds)",
        icon: Rocket,
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com and click Sign in. Use email or Google.",
            "You land in the chat. Type anything — ask a question, paste a screenshot, or attach a file.",
            "Switch modes from the bar above the composer: Create Website, Images, Videos, Deep Research, Slides, Docs, Learning.",
            "Open Settings → Customization to pick your accent color and theme.",
            "Install Megsy as an app (see the PWA section below) for a full-screen, offline-friendly experience.",
          ]},
          { kind: "note", text: "Tip: the Free plan gives you starter credits immediately — no card needed." },
        ],
      },
    ],
  },

  {
    id: "account",
    label: "Account & billing",
    sections: [
      {
        id: "auth",
        title: "Sign in, sign up & security",
        icon: Shield,
        blocks: [
          { kind: "ul", items: [
            "Email + password, Google sign-in, or magic link.",
            "Two-Factor Authentication (2FA) — Settings → Security → Two-Factor.",
            "Sessions — sign out remote devices from Settings → Security.",
            "Forgot password — request a reset link from the sign-in screen.",
            "Delete account — Settings → Delete Account; data is purged within 30 days.",
          ]},
          { kind: "link", href: "/security", label: "Security & compliance →" },
        ],
      },
      {
        id: "plans",
        title: "Plans, pricing & Megsy Credits (MC)",
        icon: Wallet,
        intro:
          "Every action costs MC. Paid plans add a monthly MC allowance plus unlimited windows on heavy tools.",
        blocks: [
          { kind: "ul", items: [
            "Free — starter MC, Megsy Lite chat, watermarked previews on heavy media.",
            "Pro ($25/mo) — Megsy AI unlimited, 7-day unlimited window per month on image & video.",
            "Elite ($59/mo) — 15-day unlimited window, priority queue, higher resolution.",
            "Business ($149/mo) — all-month unlimited window, team seats, shared workspace credits.",
            "Top-ups — buy extra MC any time from Settings → Billing.",
          ]},
          { kind: "link", href: "/pricing", label: "Compare plans →" },
        ],
      },
      {
        id: "referrals",
        title: "Referrals & affiliate program",
        icon: Gift,
        blocks: [
          { kind: "ul", items: [
            "Earn MC + cash when friends subscribe through your link.",
            "Withdraw cash to PayPal, bank, or USDT — Settings → Billing → Withdraw.",
            "Affiliate dashboard tracks clicks, signups, conversions and lifetime revenue.",
          ]},
          { kind: "link", href: "/billing/referrals", label: "Open the referral dashboard →" },
        ],
      },
    ],
  },

  {
    id: "chat",
    label: "Chat & agents",
    sections: [
      {
        id: "chat-basics",
        title: "Chat basics",
        icon: MessageSquare,
        blocks: [
          { kind: "ul", items: [
            "Type anything — Megsy keeps the full conversation context.",
            "Attach files (PDF, DOCX, images, video, audio, code) by drag-drop or the paperclip.",
            "Voice input via the mic icon; voice replies via the speaker icon.",
            "Edit any message — Megsy regenerates the rest of the thread automatically.",
            "Pin chats from the sidebar; rename / share / delete from the chat menu.",
          ]},
        ],
      },
      {
        id: "models",
        title: "Models & model picker",
        icon: Brain,
        blocks: [
          { kind: "p", text: "Tap the model name above the composer to switch. Megsy AI is the default and is unlimited on Pro+. You can also pick GPT, Claude, Gemini, Grok, Qwen, DeepSeek, Llama and more — credit costs vary by model." },
        ],
      },
      {
        id: "agents-website",
        title: "Create Website",
        icon: Globe,
        blocks: [
          { kind: "p", text: "Describe what you want and Megsy builds a real, deployable site in seconds. Iterate by chatting — the live preview updates as code is written." },
          { kind: "ul", items: [
            "Production stack: React + Vite + Tailwind + TypeScript.",
            "One-click publish to a free megsy.app subdomain or your custom domain.",
            "Connect a database, auth, payments (Stripe / Paddle), storage and edge functions.",
          ]},
        ],
      },
      {
        id: "agents-images",
        title: "Images",
        icon: ImageIcon,
        blocks: [
          { kind: "p", text: "State-of-the-art image generation with multiple models (Flux, Recraft, Ideogram, GPT-Image, Google, ByteDance) in one panel." },
          { kind: "ul", items: [
            "Aspect ratio, resolution and quality controls.",
            "Edit tools: inpaint, outpaint, upscale, background remove, magic erase, style transfer, face swap.",
            "Reference images for character consistency.",
            "Bulk generation for campaigns and product shots.",
          ]},
        ],
      },
      {
        id: "agents-video",
        title: "Videos & Cinema",
        icon: Video,
        blocks: [
          { kind: "p", text: "Generate cinematic clips with Sora, Veo, Kling, Pixverse, Runway and more. Optional start/end frame, motion control and audio." },
          { kind: "ul", items: [
            "Text-to-video and image-to-video.",
            "Lip-sync: portrait + audio → talking video.",
            "Long-form cinema mode for multi-scene films.",
          ]},
        ],
      },
      {
        id: "agents-research",
        title: "Deep Research",
        icon: Microscope,
        blocks: [
          { kind: "p", text: "Multi-source web research that returns a structured report with citations, charts and a downloadable PDF." },
          { kind: "ul", items: [
            "Picks 30–200 sources depending on depth setting.",
            "Cross-checks claims and flags contradictions.",
            "Shareable read-only link for stakeholders.",
          ]},
        ],
      },
      {
        id: "agents-slides",
        title: "Slides",
        icon: Presentation,
        blocks: [
          { kind: "p", text: "Generates a full editable presentation from a prompt. Pick a theme, regenerate any slide, export to PPTX or share a live link." },
        ],
      },
      {
        id: "agents-docs",
        title: "Docs",
        icon: FileText,
        blocks: [
          { kind: "p", text: "Long-form document writer — proposals, contracts, essays, manuals. Export to DOCX, PDF or Google Docs." },
        ],
      },
      {
        id: "agents-learning",
        title: "Learning",
        icon: GraduationCap,
        blocks: [
          { kind: "p", text: "Adaptive tutor that explains, quizzes, summarises and builds personalised study plans from any source." },
        ],
      },
      {
        id: "agents-operator",
        title: "Operator (autonomous agent)",
        icon: Workflow,
        blocks: [
          { kind: "p", text: "Hand off multi-step browser & API tasks. Operator opens a virtual browser, logs in (with your approval), fills forms, scrapes data, and reports back." },
        ],
      },
      {
        id: "agents-code",
        title: "Code",
        icon: Code2,
        blocks: [
          { kind: "p", text: "Write, debug and refactor code in any language with file-level context. Push to GitHub directly." },
        ],
      },
    ],
  },

  {
    id: "workspace",
    label: "Workspaces & sharing",
    sections: [
      {
        id: "workspaces",
        title: "Workspaces & teams",
        icon: Users,
        blocks: [
          { kind: "ul", items: [
            "A workspace is a shared space with pooled credits and content.",
            "Roles — Owner, Admin, Member, Viewer.",
            "Invite by email or shareable link from Settings → Workspaces.",
            "Switch active workspace from the account switcher in the sidebar.",
          ]},
        ],
      },
      {
        id: "sharing",
        title: "Sharing & collaboration",
        icon: Share2,
        blocks: [
          { kind: "ul", items: [
            "Share any chat as a read-only public link (revocable any time).",
            "Invite a person to a chat — they can reply alongside you.",
            "Slides, research reports and projects all have their own share links.",
          ]},
        ],
      },
      {
        id: "telegram",
        title: "Telegram bot (optional)",
        icon: Link2,
        blocks: [
          { kind: "p", text: "Connect Megsy to Telegram from Settings → Integrations → Telegram. Get daily summaries, run quick tasks, and receive notifications from anywhere." },
        ],
      },
    ],
  },

  {
    id: "personalize",
    label: "Personalization",
    sections: [
      {
        id: "memory",
        title: "Memory",
        icon: Brain,
        blocks: [
          { kind: "p", text: "Megsy remembers important facts about you across chats — your name, role, projects, preferences. Review and edit from Settings → Memory." },
        ],
      },
      {
        id: "personalization",
        title: "AI personalization",
        icon: SettingsIcon,
        blocks: [
          { kind: "p", text: "Tell Megsy how to talk to you — tone, language, expertise level, formatting preferences. Applies to every chat." },
        ],
      },
      {
        id: "theme",
        title: "Theme & customization",
        icon: Palette,
        blocks: [
          { kind: "ul", items: [
            "17 premium accent colors that also recolor your message bubble.",
            "Dark theme by default — tuned for long sessions.",
            "Custom name, avatar and pronouns from Settings → Profile.",
          ]},
        ],
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: Bell,
        blocks: [
          { kind: "p", text: "Choose what gets a push, email or in-app badge — long jobs finished, credits low, mentions in shared chats, weekly summary." },
        ],
      },
    ],
  },

  {
    id: "pwa",
    label: "Install as an app (PWA)",
    sections: [
      {
        id: "pwa-ios",
        title: "Install on iPhone & iPad",
        icon: Apple,
        intro: "Megsy installs as a full-screen iOS app via Safari's Add to Home Screen.",
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com in Safari (not Chrome — iOS only allows installs from Safari).",
            "Tap the Share button at the bottom (square with an arrow pointing up).",
            "Scroll the share sheet down and tap “Add to Home Screen”.",
            "Confirm the name “Megsy AI” and tap Add. The icon appears on your home screen.",
            "Open it — it now runs full-screen with its own splash screen, exactly like a native app.",
          ]},
          { kind: "image", src: pwaIos, alt: "iPhone Safari share sheet with Add to Home Screen highlighted", caption: "iOS — Safari → Share → Add to Home Screen" },
          { kind: "note", text: "On iPadOS the Share button lives in the top toolbar — same flow." },
        ],
      },
      {
        id: "pwa-android",
        title: "Install on Android",
        icon: Smartphone,
        intro: "On Android, Chrome (and most Chromium browsers) offer one-tap install.",
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com in Chrome.",
            "Tap the three-dot menu in the top-right.",
            "Tap “Install app” (or “Add to Home screen”).",
            "Confirm. Megsy is added to your home screen and your app drawer.",
            "Optional: long-press the icon → Add to Home for one-tap launch.",
          ]},
          { kind: "image", src: pwaAndroid, alt: "Android Chrome menu showing Install app option", caption: "Android — Chrome → ⋮ → Install app" },
          { kind: "note", text: "Samsung Internet, Edge, Brave and Firefox all support install — the menu wording is similar." },
        ],
      },
      {
        id: "pwa-desktop",
        title: "Install on Mac, Windows & Linux",
        icon: Monitor,
        intro: "Megsy installs as a real desktop app on macOS, Windows and Linux via Chrome, Edge or Brave.",
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com in Chrome, Edge or Brave.",
            "Look for the install icon on the right side of the address bar (a small monitor with a down arrow).",
            "Click it and confirm “Install”.",
            "Megsy opens in its own window — pin it to your Dock (Mac), Taskbar (Windows) or app menu (Linux).",
            "It launches with its own icon and runs without browser chrome.",
          ]},
          { kind: "image", src: pwaDesktop, alt: "Desktop Chrome address bar with Install Megsy AI icon highlighted", caption: "Desktop — click the install icon in the address bar" },
          { kind: "note", text: "Safari on macOS: File → Add to Dock also installs Megsy as a standalone app (macOS Sonoma+)." },
        ],
      },
      {
        id: "pwa-features",
        title: "What you get after installing",
        icon: CheckCircle2,
        blocks: [
          { kind: "ul", items: [
            "Full-screen experience, no browser tabs or address bar.",
            "Dedicated app icon and animated Megsy splash on launch.",
            "Faster start-up — assets are cached locally.",
            "Push notifications for finished jobs, mentions and updates.",
            "Works on poor connections — recent chats stay readable offline.",
          ]},
        ],
      },
    ],
  },

  {
    id: "advanced",
    label: "Advanced",
    sections: [
      {
        id: "shortcuts",
        title: "Keyboard shortcuts",
        icon: Keyboard,
        blocks: [
          { kind: "ul", items: [
            "Enter — send message · Shift+Enter — new line.",
            "Cmd / Ctrl + K — open command bar.",
            "Cmd / Ctrl + / — focus search.",
            "Cmd / Ctrl + N — new chat.",
            "Cmd / Ctrl + B — toggle sidebar.",
            "Esc — close any modal.",
          ]},
        ],
      },
      {
        id: "integrations",
        title: "Integrations & API",
        icon: Link2,
        blocks: [
          { kind: "p", text: "Connect Megsy to your stack — GitHub, Google Drive, Notion, Slack, Telegram, Zapier, Pipedream and 1,000+ apps via our standard connectors. API keys are available on Business plans." },
        ],
      },
      {
        id: "troubleshoot",
        title: "Troubleshooting",
        icon: HelpCircle,
        blocks: [
          { kind: "ul", items: [
            "Page won't load — hard refresh with Cmd/Ctrl + Shift + R.",
            "Installed app is stuck on an old version — close & relaunch, or visit /?sw=off in your browser once.",
            "Credits look wrong — open Settings → Billing → Usage; refresh after 30 seconds.",
            "Generation failed — most failures auto-refund MC. Check Settings → Billing → Usage for the refund line.",
            "Still stuck? Use the AI support chat (always live) or email support.",
          ]},
          { kind: "link", href: "/support", label: "Open AI support →" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ─────────────────────────────────────────────────────────────────────── */

const SectionFallback = () => (
  <div className="min-h-[200px] w-full px-4 py-16 mx-auto max-w-7xl">
    <div className="h-8 w-48 rounded-md bg-foreground/[0.04] animate-pulse mb-6" />
  </div>
);

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(GROUPS[0].sections[0].id);

  // Filter sections by query (matches title or section id or any block text).
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      sections: g.sections.filter((s) => {
        if (s.title.toLowerCase().includes(q)) return true;
        if ((s.intro || "").toLowerCase().includes(q)) return true;
        return s.blocks.some((b) => {
          if (b.kind === "p" || b.kind === "note" || b.kind === "code") return b.text.toLowerCase().includes(q);
          if (b.kind === "ul" || b.kind === "ol") return b.items.some((i) => i.toLowerCase().includes(q));
          if (b.kind === "link") return b.label.toLowerCase().includes(q);
          return false;
        });
      }),
    })).filter((g) => g.sections.length > 0);
  }, [query]);

  // Scroll-spy
  useEffect(() => {
    const ids = GROUPS.flatMap((g) => g.sections.map((s) => s.id));
    const observers: IntersectionObserver[] = [];
    const handler = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveId(visible[0].target.id);
    };
    const io = new IntersectionObserver(handler, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    observers.push(io);
    return () => observers.forEach((o) => o.disconnect());
  }, [filteredGroups]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Megsy AI Docs — Complete Product Guide & PWA Install"
        description="The complete Megsy AI documentation: every feature explained, plus step-by-step instructions to install Megsy as an app on iPhone, Android, Mac, Windows and Linux."
        path="/docs"
      />
      <LandingNavbar />

      {/* Hero */}
      <header className="relative px-4 pt-28 pb-12 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Documentation
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
          Everything Megsy AI can do, <br className="hidden md:block" />
          in one place.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Search, browse and install — a complete reference for every feature, every agent and every setting in Megsy AI.
          Updated continuously.
        </p>

        {/* Search */}
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the docs — try ‘install’, ‘credits’, ‘slides’…"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card border border-border focus:border-primary outline-none transition-colors text-[15px]"
          />
        </div>
      </header>

      {/* Body */}
      <main className="px-4 pb-24 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <nav className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.id}>
                <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">
                  {group.label}
                </div>
                <ul className="space-y-0.5">
                  {group.sections.map((s) => {
                    const Icon = s.icon;
                    const active = s.id === activeId;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13.5px] transition-colors ${
                            active
                              ? "bg-primary/10 text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{s.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-16">
          {filteredGroups.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              No docs matched “{query}”. Try a different search.
            </div>
          )}

          {filteredGroups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`} className="space-y-12">
              <h2 id={`group-${group.id}`} className="text-xs font-bold uppercase tracking-widest text-primary">
                {group.label}
              </h2>

              {group.sections.map((s) => {
                const Icon = s.icon;
                return (
                  <article key={s.id} id={s.id} className="scroll-mt-28">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                        <Icon className="w-4.5 h-4.5" />
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight">{s.title}</h3>
                    </div>
                    {s.intro && (
                      <p className="text-[15px] text-muted-foreground mb-4 max-w-3xl">{s.intro}</p>
                    )}
                    <div className="space-y-4 max-w-3xl">
                      {s.blocks.map((b, i) => (
                        <BlockView key={i} block={b} />
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          ))}

          {/* Closing CTA */}
          <section className="mt-20 rounded-3xl border border-border bg-card p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Still have a question?</h3>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Our AI support assistant answers in any language, 24/7 — and it knows every page of this documentation by heart.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                Open AI support <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border font-semibold hover:bg-foreground/[0.04] transition"
              >
                Contact our team
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border font-semibold hover:bg-foreground/[0.04] transition"
              >
                See plans
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Suspense fallback={<SectionFallback />}>
        <LandingFooter />
      </Suspense>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function BlockView({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "p":
      return <p className="text-[15px] leading-7 text-foreground/85">{block.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-7 text-foreground/85">
              <CheckCircle2 className="w-4 h-4 mt-1.5 shrink-0 text-primary" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-7 text-foreground/85">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[12px] font-bold mt-0.5">
                {i + 1}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre className="rounded-xl bg-foreground/[0.05] border border-border p-4 overflow-x-auto text-[13px] leading-6">
          <code>{block.text}</code>
        </pre>
      );
    case "note":
      return (
        <div className="rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3 text-[14px] text-foreground/85">
          <strong className="text-primary">Tip · </strong>{block.text}
        </div>
      );
    case "image":
      return (
        <figure className="my-2">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full max-w-md mx-auto rounded-2xl border border-border bg-card shadow-sm"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-[12.5px] text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "link":
      return (
        <Link
          to={block.href}
          className="inline-flex items-center gap-1 text-primary font-semibold hover:underline text-[14.5px]"
        >
          {block.label}
        </Link>
      );
  }
}
