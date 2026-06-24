// Megsy AI — Comprehensive Docs page (/docs)
// Cartoon / brand-ink design system, matching the landing page + settings.
// One long, fully-indexed reference for EVERY feature, page, agent, setting,
// integration, plan, policy, route and shortcut on megsyai.com.
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
  ScrollText,
  Wand2,
  Mic,
  Music,
  Languages,
  Building2,
  LayoutGrid,
  Bot,
  ShieldCheck,
  BookOpen,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import SEOHead from "@/components/common/SEOHead";

import pwaIos from "@/assets/docs/pwa-ios.png";
import pwaAndroid from "@/assets/docs/pwa-android.png";
import pwaDesktop from "@/assets/docs/pwa-desktop.png";

const LandingFooter = lazy(() => import("@/components/landing/LandingFooter"));

// Brand tokens — same palette used by settings + landing.
const INK = "hsl(var(--brand-ink))";
const PARCHMENT = "hsl(var(--brand-parchment))";
const ACTION = "hsl(var(--brand-action))";
const MINT = "hsl(var(--brand-mint))";
const BLUSH = "hsl(var(--brand-blush))";

/* ───────────────────────── Doc data model ───────────────────────── */

type DocBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "kv"; rows: { k: string; v: string }[] }
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
  accent?: string; // sticker accent color
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
        accent: ACTION,
        intro:
          "Megsy AI is an all-in-one creative & productivity platform built on a single shared credit balance (Megsy Credits — MC). One subscription unlocks chat, images, video, websites, code, slides, docs, deep research, voice, music, learning and autonomous agents.",
        blocks: [
          { kind: "ul", items: [
            "One unified workspace for every modality — no tool-hopping.",
            "Powered by the Megsy model plus 80+ best-in-class third-party models (GPT, Claude, Gemini, Grok, Qwen, DeepSeek, Llama, Flux, Recraft, Ideogram, Sora, Veo, Kling, Pixverse, Runway and more).",
            "Works in any modern browser; installable as a real app on iPhone, iPad, Android, macOS, Windows and Linux.",
            "Privacy-first — your prompts and outputs are yours, never used to train other companies' models.",
            "Free plan ships with starter credits — no card required.",
          ]},
          { kind: "link", href: "/features-guide", label: "See the full features guide →" },
          { kind: "link", href: "/pricing", label: "Compare plans →" },
        ],
      },
      {
        id: "quickstart",
        title: "Quick start (60 seconds)",
        icon: Rocket,
        accent: MINT,
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com and click Sign in — email, Google, or magic link.",
            "You land in the chat. Type anything, paste a screenshot, or attach a file.",
            "Switch modes from the bar above the composer: Create Website, Images, Videos, Deep Research, Slides, Docs, Learning, Code, Operator.",
            "Open Settings → Customization to pick your accent color.",
            "Install Megsy as an app (see the PWA section) for full-screen, offline-friendly use.",
          ]},
          { kind: "note", text: "Tip: the Free plan gives you starter MC immediately — no card required." },
        ],
      },
      {
        id: "site-map",
        title: "Site map — every public page",
        icon: MapPin,
        accent: BLUSH,
        intro: "A single index of every route on megsyai.com. Click any path to jump straight there.",
        blocks: [
          { kind: "kv", rows: [
            { k: "/", v: "Home — landing & hero" },
            { k: "/chat", v: "Main chat workspace" },
            { k: "/share/:id", v: "Public shared chat link" },
            { k: "/pricing", v: "Plans & MC top-ups" },
            { k: "/features-guide", v: "Full feature tour with comparisons" },
            { k: "/about", v: "About the team & mission" },
            { k: "/enterprise", v: "Sales contact + enterprise features" },
            { k: "/blog", v: "Articles, comparisons, guides" },
            { k: "/docs", v: "This documentation hub" },
            { k: "/support", v: "AI support chat — 24/7" },
            { k: "/contact", v: "Human contact form" },
            { k: "/auth", v: "Sign in / sign up / reset password" },
            { k: "/settings", v: "Settings home (profile, billing, memory…)" },
            { k: "/workspaces", v: "Team workspaces" },
            { k: "/billing/withdraw", v: "Referral cash withdrawals" },
            { k: "/r/:code", v: "Referral redirect link" },
            { k: "/terms · /privacy · /cookies · /refund", v: "Legal & policies" },
            { k: "/security · /trust", v: "Security posture & trust center" },
          ]},
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
        title: "Sign in, sign up & account security",
        icon: Shield,
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "Email + password, Google sign-in, Apple sign-in, or magic link.",
            "Two-Factor Authentication (TOTP) — Settings → Security → Two-Factor.",
            "Active sessions — sign out remote devices from Settings → Security.",
            "Forgot password — request a reset link from /auth.",
            "Change email — Settings → Change Email (confirmation sent to both addresses).",
            "Change password — Settings → Change Password.",
            "Delete account — Settings → Delete Account; data is purged within 30 days per GDPR.",
            "Switch account — Settings → Switch Account to add and toggle multiple accounts.",
          ]},
          { kind: "link", href: "/security", label: "Security & compliance →" },
        ],
      },
      {
        id: "plans",
        title: "Plans, pricing & Megsy Credits (MC)",
        icon: Wallet,
        accent: MINT,
        intro:
          "Every action costs MC. Paid plans add a monthly MC allowance plus unlimited windows on heavy media tools.",
        blocks: [
          { kind: "kv", rows: [
            { k: "Free", v: "Starter MC, Megsy Lite chat, watermarked previews on heavy media." },
            { k: "Pro — $25/mo", v: "Megsy AI unlimited chat, 7-day unlimited window per month for image & video." },
            { k: "Elite — $59/mo", v: "15-day unlimited window, priority queue, higher resolution exports." },
            { k: "Business — $149/mo", v: "All-month unlimited window, team seats, shared workspace credits." },
            { k: "Enterprise", v: "Custom MC, SSO/SAML, DPA, dedicated support — /enterprise." },
            { k: "Top-ups", v: "Buy extra MC any time from Settings → Billing." },
            { k: "Yearly billing", v: "Discounted annual price + larger MC grant on every plan." },
          ]},
          { kind: "link", href: "/pricing", label: "Compare plans →" },
          { kind: "link", href: "/refund", label: "Refund policy →" },
        ],
      },
      {
        id: "billing-settings",
        title: "Billing dashboard",
        icon: ScrollText,
        accent: BLUSH,
        blocks: [
          { kind: "ul", items: [
            "View current plan, renewal date and next charge — Settings → Billing.",
            "Download invoices (PDF) for every payment.",
            "Update card — Stripe, Paddle, Dodo Payments and Apple/Google Pay supported.",
            "Cancel or downgrade any time — access continues until the period ends.",
            "Usage breakdown — MC spent per tool, per day.",
            "Refund requests — within the window described in /refund.",
          ]},
        ],
      },
      {
        id: "referrals",
        title: "Referrals & affiliate program",
        icon: Gift,
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "Friend signs up via your link → friend gets 15 free credits, you also get 15.",
            "Lifetime cash commission: 20% on every payment your referral makes — forever.",
            "Minimum payout: $10 before withdrawing cash.",
            "Withdraw via PayPal, bank transfer, or USDT — /billing/withdraw.",
            "Marketing kit (videos, captions, images) — /settings/referrals/resources.",
            "Dashboard tabs: Dashboard, Program, Tasks, Withdrawals.",
          ]},
          { kind: "link", href: "/settings/referrals", label: "Open the referral dashboard →" },
        ],
      },
    ],
  },

  {
    id: "chat",
    label: "Chat & models",
    sections: [
      {
        id: "chat-basics",
        title: "Chat basics",
        icon: MessageSquare,
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "Type anything — Megsy keeps the full conversation context.",
            "Attach files (PDF, DOCX, XLSX, CSV, images, video, audio, code) via drag-drop or the paperclip.",
            "Voice input via the mic icon; voice replies via the speaker icon.",
            "Edit any message — Megsy regenerates the rest of the thread automatically.",
            "Regenerate, branch, and compare answers from different models on the same prompt.",
            "Pin chats from the sidebar; rename / share / archive / delete from the chat menu.",
            "Folders & tags to organize long histories.",
            "Search across every chat from Cmd/Ctrl + K.",
          ]},
        ],
      },
      {
        id: "models",
        title: "Models & the model picker",
        icon: Brain,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Tap the model name above the composer to switch. Megsy AI is the default and is unlimited on Pro+. Each model shows its strengths, context size and MC cost per message before you send." },
          { kind: "kv", rows: [
            { k: "Megsy Lite", v: "Free tier — fast everyday answers." },
            { k: "Megsy AI", v: "Default flagship reasoning model — unlimited on Pro+." },
            { k: "Megsy Max", v: "Deep reasoning routed to current frontier model." },
            { k: "GPT family", v: "OpenAI's latest chat models — premium tasks." },
            { k: "Claude family", v: "Anthropic — best long-form writing & analysis." },
            { k: "Gemini family", v: "Google — multimodal, web-grounded answers." },
            { k: "Grok, Qwen, DeepSeek, Llama", v: "Open & alternative frontier models." },
          ]},
          { kind: "note", text: "Switching mid-thread keeps your context — the new model sees the whole conversation." },
        ],
      },
      {
        id: "web-search",
        title: "Web search & citations",
        icon: Globe,
        accent: BLUSH,
        blocks: [
          { kind: "p", text: "Toggle the globe icon on the composer to ground answers in live web results. Replies include inline citations you can click." },
        ],
      },
      {
        id: "voice",
        title: "Voice — talk to Megsy",
        icon: Mic,
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "Push-to-talk via the mic; full hands-free voice mode for real conversations.",
            "Multiple natural voices in 30+ languages.",
            "Auto language detection — Megsy replies in your spoken language.",
          ]},
        ],
      },
    ],
  },

  {
    id: "agents",
    label: "Agents & creative tools",
    sections: [
      {
        id: "agents-website",
        title: "Create Website (Megsy Builder)",
        icon: Globe,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Describe what you want and Megsy builds a real, deployable site in seconds. Iterate by chatting — the live preview updates as code is written." },
          { kind: "ul", items: [
            "Production stack: React + Vite + Tailwind + TypeScript.",
            "One-click publish to a free megsy.app subdomain or your own custom domain.",
            "Connect a database, authentication, payments (Stripe / Paddle / Dodo), file storage and edge functions.",
            "Push directly to GitHub.",
            "Built-in SEO, sitemap, robots, OG metadata and accessibility checks.",
          ]},
        ],
      },
      {
        id: "agents-images",
        title: "Images",
        icon: ImageIcon,
        accent: MINT,
        blocks: [
          { kind: "p", text: "State-of-the-art image generation with multiple models (Flux, Recraft, Ideogram, GPT-Image, Google Imagen, ByteDance Seed) in one panel." },
          { kind: "ul", items: [
            "Aspect ratio, resolution and quality controls.",
            "Edit tools: inpaint, outpaint, upscale, background remove, magic erase, style transfer, face swap.",
            "Reference images for character consistency across a series.",
            "Bulk generation for campaigns, product shots and storyboards.",
            "All assets stored in your private library.",
          ]},
        ],
      },
      {
        id: "agents-video",
        title: "Videos & Cinema",
        icon: Video,
        accent: BLUSH,
        blocks: [
          { kind: "p", text: "Generate cinematic clips with Sora, Veo, Kling, Pixverse, Runway, Luma and more. Optional start/end frame, motion control and audio." },
          { kind: "ul", items: [
            "Text-to-video and image-to-video.",
            "Lip-sync: portrait + audio → talking video.",
            "Long-form Cinema mode stitches multi-scene films with consistent characters.",
            "Export MP4 / MOV / WebM up to 4K.",
          ]},
        ],
      },
      {
        id: "agents-research",
        title: "Deep Research",
        icon: Microscope,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Multi-source web research that returns a structured report with citations, charts and a downloadable PDF." },
          { kind: "ul", items: [
            "Picks 30–200 sources depending on depth setting.",
            "Cross-checks claims and flags contradictions.",
            "Generates charts, tables and an executive summary.",
            "Shareable read-only link for stakeholders.",
          ]},
        ],
      },
      {
        id: "agents-slides",
        title: "Slides",
        icon: Presentation,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Generates a full editable presentation from a prompt. Pick a theme, regenerate any slide, edit text inline, export to PPTX or share a live link." },
          { kind: "ul", items: [
            "Dozens of designer themes — corporate, editorial, playful, dark, minimal.",
            "AI image fill per slide.",
            "Speaker notes generated automatically.",
            "Export to .pptx, PDF, or web link.",
          ]},
        ],
      },
      {
        id: "agents-docs",
        title: "Docs",
        icon: FileText,
        accent: BLUSH,
        blocks: [
          { kind: "p", text: "Long-form document writer — proposals, contracts, essays, manuals, resumes, business plans. Export to DOCX, PDF or Google Docs." },
          { kind: "ul", items: [
            "Live A4 preview as you chat.",
            "Tone & length controls.",
            "Insert images, tables and charts inline.",
            "Templates: resume, cover letter, NDA, proposal, brief, research memo.",
          ]},
        ],
      },
      {
        id: "agents-learning",
        title: "Learning",
        icon: GraduationCap,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Adaptive tutor that explains, quizzes, summarises and builds personalised study plans from any source (URL, PDF, video, photo of a textbook)." },
        ],
      },
      {
        id: "agents-operator",
        title: "Operator — autonomous agents (Megsy OS)",
        icon: Workflow,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Hand off multi-step browser & API tasks. Operator opens a virtual browser, logs in (with your approval), fills forms, scrapes data, and reports back." },
          { kind: "ul", items: [
            "Agents run 24/7 — set them, walk away.",
            "Full audit log of every action — /settings/operator/audit.",
            "Pre-built agents for research, lead-gen, monitoring, social posting.",
            "Custom agents — /settings/operator/agents.",
          ]},
        ],
      },
      {
        id: "agents-code",
        title: "Code",
        icon: Code2,
        accent: BLUSH,
        blocks: [
          { kind: "p", text: "Write, debug and refactor code in any language with file-level context. Push to GitHub directly. Pair with Megsy Builder to ship full apps." },
        ],
      },
      {
        id: "agents-music",
        title: "Music & audio",
        icon: Music,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Generate songs, jingles, voiceovers and background scores from a prompt. Adjust mood, tempo, instruments and length. Export WAV / MP3." },
        ],
      },
      {
        id: "agents-skills",
        title: "Custom Skills",
        icon: Wand2,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Package your favourite prompts as reusable Skills with a name, icon and slash trigger. Share with your workspace." },
          { kind: "link", href: "/settings/skills", label: "Manage skills →" },
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
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "A workspace is a shared space with pooled MC, chats, assets and skills.",
            "Roles — Owner, Admin, Member, Viewer.",
            "Invite by email or shareable link from /workspaces/:id.",
            "Switch active workspace from the account switcher in the sidebar.",
            "Workspace-wide memory keeps your team brand voice consistent.",
            "Tasks board per workspace — /workspaces/:id/tasks.",
          ]},
          { kind: "link", href: "/workspaces", label: "Open workspaces →" },
        ],
      },
      {
        id: "sharing",
        title: "Sharing & collaboration",
        icon: Share2,
        accent: BLUSH,
        blocks: [
          { kind: "ul", items: [
            "Share any chat as a read-only public link (revocable any time).",
            "Invite a person to a chat — they can reply alongside you in real-time.",
            "Slides, Docs, research reports and projects all have their own share links.",
            "Export anything to PDF, DOCX, PPTX, MP4 or JSON.",
          ]},
        ],
      },
      {
        id: "integrations",
        title: "Integrations",
        icon: Link2,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Connect Megsy to your stack from /settings/integrations — Gmail, Google Drive, Notion, Slack, GitHub, Linear, Jira, Stripe, Telegram, Zapier, Pipedream and 1,000+ apps via standard connectors. API keys available on Business+." },
        ],
      },
      {
        id: "telegram",
        title: "Telegram bot (optional)",
        icon: Bot,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Connect Megsy to Telegram from Settings → Integrations → Telegram. Get daily blog summaries, run quick tasks, receive job-done pings and chat with Megsy from anywhere." },
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
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Megsy remembers important facts about you across chats — your name, role, projects, preferences, writing style. Review, edit and delete any memory from /settings/memory." },
        ],
      },
      {
        id: "personalization",
        title: "AI personalization",
        icon: SettingsIcon,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Tell Megsy how to talk to you — tone, language, expertise level, formatting preferences. Applies to every chat. /settings/customization." },
        ],
      },
      {
        id: "theme",
        title: "Theme & customization",
        icon: Palette,
        accent: BLUSH,
        blocks: [
          { kind: "ul", items: [
            "17 premium accent colors that also recolor your message bubbles.",
            "Dark theme by default — tuned for long sessions.",
            "Custom name, avatar and pronouns from /settings/profile.",
            "Reduced motion respected automatically when enabled at the OS level.",
          ]},
        ],
      },
      {
        id: "language",
        title: "Language & localization",
        icon: Languages,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Megsy auto-mirrors the language and dialect of your last message. Force a UI language from /settings/language. Supports English, Arabic (including Egyptian dialect), French, Spanish, German, Portuguese, Italian, Turkish, Russian, Hindi, Chinese, Japanese, Korean and more." },
        ],
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: Bell,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Choose what gets a push, email or in-app badge — long jobs finished, credits low, mentions in shared chats, weekly summary, security alerts. /settings/notifications." },
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
        accent: ACTION,
        intro: "Megsy installs as a full-screen iOS app via Safari's Add to Home Screen.",
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com in Safari (iOS only allows PWA installs from Safari).",
            "Tap the Share button at the bottom (square with an arrow pointing up).",
            "Scroll the share sheet down and tap “Add to Home Screen”.",
            "Confirm the name “Megsy AI” and tap Add.",
            "Open it — it runs full-screen with its own splash screen, exactly like a native app.",
          ]},
          { kind: "image", src: pwaIos, alt: "iPhone Safari share sheet with Add to Home Screen highlighted", caption: "iOS — Safari → Share → Add to Home Screen" },
          { kind: "note", text: "On iPadOS the Share button lives in the top toolbar — same flow." },
        ],
      },
      {
        id: "pwa-android",
        title: "Install on Android",
        icon: Smartphone,
        accent: MINT,
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
          { kind: "note", text: "Samsung Internet, Edge, Brave and Firefox all support install — wording is similar." },
        ],
      },
      {
        id: "pwa-desktop",
        title: "Install on Mac, Windows & Linux",
        icon: Monitor,
        accent: BLUSH,
        intro: "Megsy installs as a real desktop app on macOS, Windows and Linux via Chrome, Edge, Brave or Safari.",
        blocks: [
          { kind: "ol", items: [
            "Open megsyai.com in Chrome, Edge or Brave.",
            "Look for the install icon on the right side of the address bar (small monitor with a down arrow).",
            "Click it and confirm “Install”.",
            "Megsy opens in its own window — pin it to your Dock (Mac), Taskbar (Windows) or app menu (Linux).",
            "It launches with its own icon and runs without browser chrome.",
          ]},
          { kind: "image", src: pwaDesktop, alt: "Desktop Chrome address bar with Install Megsy AI icon highlighted", caption: "Desktop — click the install icon in the address bar" },
          { kind: "note", text: "Safari on macOS Sonoma+: File → Add to Dock also installs Megsy as a standalone app." },
        ],
      },
      {
        id: "pwa-features",
        title: "What you get after installing",
        icon: CheckCircle2,
        accent: ACTION,
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
    id: "blog-system",
    label: "Blog & content",
    sections: [
      {
        id: "blog",
        title: "Auto-publishing blog",
        icon: BookOpen,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "/blog publishes new articles automatically every day, translated into every supported language. Topics rotate across product news, comparisons, tutorials and AI deep-dives — fully autonomous, no human queue." },
        ],
      },
      {
        id: "comparisons",
        title: "Comparisons (Megsy vs …)",
        icon: LayoutGrid,
        accent: MINT,
        blocks: [
          { kind: "p", text: "Head-to-head comparisons at /vs/<competitor> — pricing, features, models, quotas, side-by-side outputs. Updated as competitor offerings change." },
        ],
      },
      {
        id: "service-landings",
        title: "Service & feature landings",
        icon: Sparkles,
        accent: BLUSH,
        blocks: [
          { kind: "p", text: "Dedicated SEO landings for every capability: AI image generator, AI video generator, AI website builder, AI slides, AI resume, AI faceswap, AI cover letter, AI translator and dozens more. Each has live demos and CTAs." },
        ],
      },
    ],
  },

  {
    id: "enterprise",
    label: "Enterprise",
    sections: [
      {
        id: "enterprise-overview",
        title: "Enterprise plan",
        icon: Building2,
        accent: ACTION,
        blocks: [
          { kind: "ul", items: [
            "Custom MC pools and seat counts.",
            "SSO via SAML / OIDC, SCIM provisioning.",
            "DPA, MSA, custom contracts, invoicing in any currency.",
            "Dedicated success manager & priority SLA.",
            "Private model routing, region pinning and audit log export.",
          ]},
          { kind: "link", href: "/enterprise", label: "Talk to sales →" },
        ],
      },
      {
        id: "security",
        title: "Security & trust",
        icon: ShieldCheck,
        accent: MINT,
        blocks: [
          { kind: "ul", items: [
            "Data encrypted in transit (TLS 1.3) and at rest (AES-256).",
            "Row-level security on every user-owned table.",
            "Sub-processor list at /legal/subprocessors.",
            "DPA at /legal/dpa.",
            "Vulnerability disclosure: /.well-known/security.txt.",
            "Trust center: /trust.",
          ]},
        ],
      },
    ],
  },

  {
    id: "legal",
    label: "Legal & policies",
    sections: [
      {
        id: "legal-index",
        title: "Every legal page",
        icon: ScrollText,
        accent: ACTION,
        blocks: [
          { kind: "kv", rows: [
            { k: "/terms", v: "Terms of service" },
            { k: "/privacy", v: "Privacy policy" },
            { k: "/cookies", v: "Cookie policy" },
            { k: "/refund", v: "Refund policy" },
            { k: "/acceptable-use", v: "Acceptable use" },
            { k: "/policies/content", v: "Content policy" },
            { k: "/legal/ai-disclaimer", v: "AI disclaimer" },
            { k: "/legal/dmca", v: "DMCA & copyright" },
            { k: "/legal/dpa", v: "Data Processing Addendum" },
            { k: "/legal/affiliate", v: "Affiliate terms" },
            { k: "/legal/moderation", v: "Moderation policy" },
            { k: "/legal/age", v: "Age policy" },
            { k: "/legal/subprocessors", v: "Sub-processor list" },
            { k: "/legal/accessibility", v: "Accessibility statement" },
            { k: "/legal/compliance", v: "Compliance overview" },
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
        accent: BLUSH,
        blocks: [
          { kind: "kv", rows: [
            { k: "Enter", v: "Send message" },
            { k: "Shift + Enter", v: "New line" },
            { k: "Cmd / Ctrl + K", v: "Open command bar / search" },
            { k: "Cmd / Ctrl + /", v: "Focus chat search" },
            { k: "Cmd / Ctrl + N", v: "New chat" },
            { k: "Cmd / Ctrl + B", v: "Toggle sidebar" },
            { k: "Cmd / Ctrl + Shift + L", v: "Switch model" },
            { k: "Esc", v: "Close any modal" },
            { k: "↑ in empty composer", v: "Edit last message" },
          ]},
        ],
      },
      {
        id: "api",
        title: "API access",
        icon: Code2,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Business and Enterprise plans expose REST endpoints for chat, image, video, research and operator. Generate keys in /settings (Developers section). Rate limits scale with your MC pool." },
        ],
      },
      {
        id: "troubleshoot",
        title: "Troubleshooting",
        icon: HelpCircle,
        accent: MINT,
        blocks: [
          { kind: "ul", items: [
            "Page won't load — hard refresh with Cmd/Ctrl + Shift + R.",
            "Installed PWA stuck on an old version — close & relaunch, or visit /?sw=off once to reset the service worker.",
            "Credits look wrong — open /settings/billing → Usage; refresh after 30 seconds.",
            "Generation failed — most failures auto-refund MC. Check the Usage tab for the refund line.",
            "Can't sign in / Google login fails — clear cookies for megsyai.com, try Incognito, or reset password at /auth.",
            "2FA lost — contact support; recovery requires identity verification.",
            "Workspace invite not arriving — resend from /workspaces/:id; check spam.",
            "Still stuck? Use the AI support chat (always live) or email support@megsyai.com.",
          ]},
          { kind: "link", href: "/support", label: "Open AI support →" },
          { kind: "link", href: "/contact", label: "Contact a human →" },
        ],
      },
      {
        id: "status",
        title: "System status",
        icon: CheckCircle2,
        accent: ACTION,
        blocks: [
          { kind: "p", text: "Live status of every Megsy service — chat, image, video, research, builder, integrations — at /settings/system-status." },
        ],
      },
    ],
  },
];

/* ───────────────────────── Page ───────────────────────── */

const SectionFallback = () => (
  <div className="min-h-[200px] w-full px-4 py-16 mx-auto max-w-7xl">
    <div className="h-8 w-48 rounded-md bg-foreground/[0.04] animate-pulse mb-6" />
  </div>
);

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(GROUPS[0].sections[0].id);

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
          if (b.kind === "kv") return b.rows.some((r) => r.k.toLowerCase().includes(q) || r.v.toLowerCase().includes(q));
          if (b.kind === "link") return b.label.toLowerCase().includes(q);
          return false;
        });
      }),
    })).filter((g) => g.sections.length > 0);
  }, [query]);

  // Scroll-spy for the sidebar TOC.
  useEffect(() => {
    const ids = GROUPS.flatMap((g) => g.sections.map((s) => s.id));
    const handler = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target.id) setActiveId(visible[0].target.id);
    };
    const io = new IntersectionObserver(handler, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [filteredGroups]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: INK, color: PARCHMENT }}>
      <SEOHead
        title="Megsy AI Docs — The Complete Product Guide & PWA Install"
        description="The complete Megsy AI documentation: every feature, every agent, every setting, every page — explained. Plus step-by-step PWA install for iPhone, Android, Mac, Windows and Linux."
        path="/docs"
      />
      <LandingNavbar />

      {/* Hero — cartoon sticker style */}
      <header className="relative px-4 pt-28 pb-10 mx-auto max-w-7xl">
        <div
          className="rounded-[32px] p-8 md:p-14 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${PARCHMENT} 0%, #FFE9D6 100%)`,
            border: `2.5px solid ${INK}`,
            boxShadow: `6px 6px 0 ${INK}`,
            color: INK,
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
            style={{ backgroundColor: INK, color: PARCHMENT }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Documentation
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
            Every atom of Megsy AI, <br className="hidden md:block" />
            in one beautiful place.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] md:text-[18px] font-semibold opacity-80">
            Search, browse and install — a complete reference for every feature, every agent, every setting and every page on megsyai.com. Updated continuously.
          </p>

          {/* Search */}
          <div className="mt-7 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: INK, opacity: 0.6 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the docs — try ‘install’, ‘credits’, ‘slides’…"
              className="w-full h-12 pl-11 pr-4 rounded-2xl outline-none text-[15px] font-semibold"
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${INK}`,
                boxShadow: `3px 3px 0 ${INK}`,
                color: INK,
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {GROUPS.slice(0, 6).map((g) => (
              <a
                key={g.id}
                href={`#group-${g.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition active:translate-x-[1px] active:translate-y-[1px]"
                style={{ backgroundColor: "#fff", border: `2px solid ${INK}`, color: INK, boxShadow: `2px 2px 0 ${INK}` }}
              >
                {g.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="px-4 pb-24 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <nav className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.id}>
                <div
                  className="text-[11px] font-black uppercase tracking-widest mb-2 px-2"
                  style={{ color: PARCHMENT, opacity: 0.55 }}
                >
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
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] transition"
                          style={
                            active
                              ? {
                                  backgroundColor: PARCHMENT,
                                  color: INK,
                                  fontWeight: 800,
                                  border: `1.5px solid ${INK}`,
                                  boxShadow: `2px 2px 0 ${INK}`,
                                }
                              : { color: PARCHMENT, opacity: 0.75 }
                          }
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
            <div className="text-center py-24 opacity-70">
              No docs matched “{query}”. Try a different search.
            </div>
          )}

          {filteredGroups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`} className="space-y-10">
              <h2
                id={`group-${group.id}`}
                className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]"
                style={{ color: PARCHMENT, opacity: 0.55 }}
              >
                {group.label}
              </h2>

              {group.sections.map((s) => {
                const Icon = s.icon;
                const accent = s.accent ?? ACTION;
                return (
                  <article
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-28 rounded-[28px] p-6 md:p-8"
                    style={{
                      backgroundColor: "hsl(var(--surface-1))",
                      border: `1.5px solid hsl(var(--surface-4))`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
                        style={{
                          backgroundColor: accent,
                          color: INK,
                          border: `2px solid ${INK}`,
                          boxShadow: `2.5px 2.5px 0 ${INK}`,
                        }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                      <h3 className="text-2xl md:text-[28px] font-black tracking-tight leading-tight">
                        {s.title}
                      </h3>
                    </div>
                    {s.intro && (
                      <p className="text-[15px] leading-7 opacity-80 mb-4 max-w-3xl">{s.intro}</p>
                    )}
                    <div className="space-y-4 max-w-3xl">
                      {s.blocks.map((b, i) => (
                        <BlockView key={i} block={b} accent={accent} />
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          ))}

          {/* Closing CTA */}
          <section
            className="mt-10 rounded-[28px] p-8 md:p-12"
            style={{
              background: `linear-gradient(135deg, ${PARCHMENT} 0%, #FFE0EC 100%)`,
              border: `2.5px solid ${INK}`,
              boxShadow: `5px 5px 0 ${INK}`,
              color: INK,
            }}
          >
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Still have a question?</h3>
            <p className="mt-2 max-w-2xl font-semibold opacity-80">
              Our AI support assistant answers in any language, 24/7 — and it knows every page of this documentation by heart.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-black"
                style={{ backgroundColor: INK, color: PARCHMENT, boxShadow: `3px 3px 0 ${INK}` }}
              >
                Open AI support <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-black"
                style={{ backgroundColor: "#fff", color: INK, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}
              >
                Contact our team
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-black"
                style={{ backgroundColor: "#fff", color: INK, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}
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

/* ───────────────────────── Block renderer ───────────────────────── */

function BlockView({ block, accent }: { block: DocBlock; accent: string }) {
  switch (block.kind) {
    case "p":
      return <p className="text-[15px] leading-7 opacity-90">{block.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-7 opacity-90">
              <CheckCircle2 className="w-4 h-4 mt-1.5 shrink-0" style={{ color: accent }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-7 opacity-90">
              <span
                className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-black mt-0.5"
                style={{ backgroundColor: accent, color: INK, border: `1.5px solid ${INK}` }}
              >
                {i + 1}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
    case "kv":
      return (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1.5px solid hsl(var(--surface-4))` }}
        >
          <dl className="divide-y" style={{ borderColor: "hsl(var(--surface-4))" }}>
            {block.rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[minmax(140px,38%)_1fr] gap-3 px-4 py-3 text-[14px]"
                style={{
                  borderTop: i === 0 ? undefined : `1px solid hsl(var(--surface-4))`,
                }}
              >
                <dt className="font-black" style={{ color: accent }}>{r.k}</dt>
                <dd className="opacity-90">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "code":
      return (
        <pre
          className="rounded-xl p-4 overflow-x-auto text-[13px] leading-6"
          style={{ backgroundColor: "hsl(var(--surface-3))", border: `1px solid hsl(var(--surface-4))` }}
        >
          <code>{block.text}</code>
        </pre>
      );
    case "note":
      return (
        <div
          className="rounded-xl px-4 py-3 text-[14px]"
          style={{
            border: `1.5px solid ${accent}`,
            backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
          }}
        >
          <strong style={{ color: accent }}>Tip · </strong>
          <span className="opacity-90">{block.text}</span>
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
            className="w-full max-w-md mx-auto rounded-2xl"
            style={{ border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, backgroundColor: "#fff" }}
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-[12.5px] opacity-70">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "link":
      return (
        <Link
          to={block.href}
          className="inline-flex items-center gap-1 font-black hover:underline text-[14.5px]"
          style={{ color: accent }}
        >
          {block.label}
        </Link>
      );
  }
}
