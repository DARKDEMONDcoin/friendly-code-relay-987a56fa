## Desktop redesign — Manus dual workspace

Direction locked: **v3 "Manus dual workspace"** (cream `#FDFCFB`, ink `#1A1A17`, Instrument Serif headings, Inter body, JetBrains Mono captions, 480px chat rail + flexible canvas workspace, floating action bar).

Scope is **desktop only (≥ lg)**. Mobile keeps its current shell. No backend/business‑logic changes.

### 1. Design tokens (new)

- Add `src/styles/manus-theme.css` with cream/ink palette, the three font families (via `@fontsource/instrument-serif`, `@fontsource/inter`, `@fontsource/jetbrains-mono`), and helper classes (`.manus-surface`, `.manus-canvas`, `.manus-rail`, `.manus-serif`, `.manus-mono`, ink button styles, hairline borders).
- Register fonts in `src/main.tsx`. Extend `tailwind.config.ts` with `fontFamily.serif = ['"Instrument Serif"', ...]`, `fontFamily.mono`, and `colors.manus.{cream, canvas, ink, hairline, muted}` mapped to CSS vars.
- The tokens are gated behind a `[data-shell="manus"]` attribute on the shell root so they never leak into mobile or marketing pages.

### 2. New desktop shell component

Create `src/pages/chat/components/desktop/ManusDesktopShell.tsx`:

```text
┌─────────────────────────────────────────────────────────────┐
│ ManusDesktopShell  data-shell="manus"                       │
│ ┌──────────────┐ ┌────────────────────────────────────────┐ │
│ │  Rail 480px  │ │  Canvas (flex-1, bg cream-canvas)      │ │
│ │  - Brand     │ │  ┌──────────────────────────────────┐  │ │
│ │  - Greeting  │ │  │ Browser-chrome card              │  │ │
│ │    (serif)   │ │  │  • tab strip / url pill          │  │ │
│ │  - Messages  │ │  │  • content slot (mode-aware:     │  │ │
│ │  - Composer  │ │  │    media grid / slides / docs /  │  │ │
│ │    (Cmd+Ent) │ │  │    research / operator preview)  │  │ │
│ │              │ │  └──────────────────────────────────┘  │ │
│ │              │ │  Floating: Export Draft + Settings     │ │
│ └──────────────┘ └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

The shell is a thin presentational wrapper: it receives `messagesSlot`, `composerSlot`, `canvasSlot`, `headerSlot` as props and applies the new chrome. **All existing chat logic, hooks, services, and state in `ChatPage.tsx` stay untouched.**

### 3. Mount path

In `ChatPage.tsx`, when `!isMobile`, render `ManusDesktopShell` instead of the current desktop layout and pass the existing `ChatMessagesArea`, `ChatComposerSection`, `DesktopChatHeader`, and the operator/media/slides preview (existing `OperatorWorkspace` inline) into the canvas slot. The mobile branch is untouched.

### 4. Per-mode canvas content

The right "browser card" picks content from the active mode (already known via `useChatModeState`):
- chat → conversation summary card with metric tiles styled as in the prototype, plus inline operator/tool activity.
- images / videos → media gallery in cream cards.
- slides → live slide preview.
- deep research → research outline + sources.
- learning → study material.

Each maps to the **existing** preview components — only the wrapper chrome changes.

### 5. Landing and other site pages

User said "كل صفحات الموقع" earlier but now clarified "للكومبيوتر فقط". I'll start with the **desktop chat shell** (highest‑traffic surface) in this pass. After approval I'll roll the same tokens into `LandingPage`, `PricingPage`, `SettingsPage`, and `BillingPage` on desktop in follow‑up passes.

### Files to add / edit

| Action | Path |
| --- | --- |
| add | `src/styles/manus-theme.css` |
| add | `src/pages/chat/components/desktop/ManusDesktopShell.tsx` |
| add | `src/pages/chat/components/desktop/ManusBrowserCard.tsx` |
| add | `src/pages/chat/components/desktop/ManusFloatingActions.tsx` |
| edit | `src/main.tsx` (font imports + css import) |
| edit | `tailwind.config.ts` (font families + manus colors) |
| edit | `src/pages/chat/ChatPage.tsx` (desktop branch only — swap layout wrapper) |

### Out of scope (this pass)

- Mobile chat surface
- Marketing / settings / billing pages (next pass after approval)
- Any backend, edge-function, or model logic
- Logo asset change (kept current Megsy mark)

### Risk

`ChatPage.tsx` is large; I will keep edits confined to the JSX that picks desktop vs mobile, so the existing 1700‑line state graph is preserved verbatim.
