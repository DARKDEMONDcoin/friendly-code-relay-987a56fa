import { motion } from "framer-motion";
import { useMemo } from "react";

interface DesktopGreetingProps {
  userName: string | null | undefined;
  isFirstVisit: boolean;
  returningGreetingIdx: number;
}

/**
 * Desktop empty-state greeting — matches the Referral landing aesthetic:
 * primary radial glow, faint grid overlay, centered mark with blurred halo,
 * bold headline + muted subline, soft gradient panel with ring-border.
 *
 * Mobile is intentionally untouched (`hidden md:flex`); the mobile landing
 * is rendered by `MobileChatLandingMount`.
 */
export const DesktopGreeting = ({
  userName,
  isFirstVisit,
  returningGreetingIdx,
}: DesktopGreetingProps) => {
  const raw = userName || "there";
  const dname = raw.charAt(0).toUpperCase() + raw.slice(1);
  const initial = dname.charAt(0).toUpperCase();

  const now = new Date();
  const h = now.getHours();
  const part =
    h < 5 ? "Still up"
    : h < 12 ? "Good morning"
    : h < 17 ? "Good afternoon"
    : h < 21 ? "Good evening"
    : "Late one";

  const { lead, tail } = useMemo(() => {
    const variants = [
      { lead: part, tail: dname },
      { lead: "What's on your mind", tail: dname },
      { lead: "Where to today", tail: dname },
      { lead: "Ready when you are", tail: dname },
    ];
    const v = isFirstVisit ? variants[0] : variants[returningGreetingIdx % variants.length];
    return v;
  }, [part, dname, isFirstVisit, returningGreetingIdx]);

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative z-10 hidden md:flex items-center justify-center px-6 pt-16 pb-20 md:pt-0 md:pb-[210px] overflow-hidden">
      {/* Ambient primary glow — top + bottom radial wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.25), transparent 70%), radial-gradient(50% 40% at 50% 100%, hsl(var(--primary) / 0.15), transparent 70%)",
        }}
      />

      {/* Faint grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center w-full max-w-md text-center"
      >
        {/* Brand */}
        <div className="flex items-center justify-center pt-2">
          <span className="text-[13px] font-semibold tracking-tight text-muted-foreground">
            Megsy <span className="text-foreground">AI</span>
          </span>
        </div>

        {/* Avatar mark with blurred primary halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="relative mt-8 mb-6"
        >
          <div
            aria-hidden
            className="absolute -inset-2 rounded-full blur-xl"
            style={{ background: "hsl(var(--primary) / 0.45)" }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-card text-2xl font-semibold text-foreground ring-1 ring-border">
            {initial}
          </div>
        </motion.div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full align-middle mr-2"
            style={{ background: "hsl(var(--primary))" }}
          />
          {dateLabel}
        </p>

        {/* Headline */}
        <h1 className="mt-5 text-[34px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          {lead}, <span style={{ color: "hsl(var(--primary))" }}>{tail}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
          One workspace for chat, images, video, code and research — ask anything,
          paste anything, start anywhere.
        </p>

        {/* Soft feature panel — mirrors the referral "gift card" */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 w-full rounded-2xl p-5 ring-1 ring-border backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--card) / 0.9) 0%, hsl(var(--muted) / 0.6) 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Quick start
            </span>
            <span
              dir="ltr"
              className="rounded-full px-2.5 py-0.5 font-mono text-[11px] text-primary-foreground"
              style={{ background: "hsl(var(--primary))" }}
            >
              ⌘ K
            </span>
          </div>
          <p className="mt-3 text-[15px] font-medium text-foreground">
            Type a message below or{" "}
            <span style={{ color: "hsl(var(--primary))" }} className="font-semibold">
              pick a mode
            </span>{" "}
            to begin
          </p>
        </motion.div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Chat · Images · Video · Research · Slides
        </p>
      </motion.div>
    </div>
  );
};

export default DesktopGreeting;
