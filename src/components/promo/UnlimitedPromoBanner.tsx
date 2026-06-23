import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePromoCountdown } from "@/hooks/usePromoCountdown";

const pad = (n: number) => String(n).padStart(2, "0");
const DISMISS_KEY = "promo-banner-dismissed-v4";
const PROMO_CODE = "LAST50";

const UnlimitedPromoBanner = () => {
  const navigate = useNavigate();
  const { active, days, hours, minutes, seconds } = usePromoCountdown();
  const ref = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const visible = active && !dismissed;

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!visible || !el) {
      root.style.setProperty("--promo-banner-h", "0px");
      return;
    }
    const update = () => {
      root.style.setProperty("--promo-banner-h", `${el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--promo-banner-h", "0px");
    };
  }, [visible]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (!visible) return null;

  // Urgency level: pulses red the closer we get to expiry
  const urgent = days === 0 && hours < 12;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="عرض الاشتراك المحدود"
      dir="rtl"
      className="relative z-40 w-full overflow-hidden bg-background"
    >
      {/* Primary ambient glow — referral style */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(80% 120% at 50% 0%, hsl(var(--primary) / 0.25), transparent 70%)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Bottom hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-2.5 pl-10 sm:px-4 sm:pl-12">
        {/* LIVE dot + label */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: "hsl(var(--primary))" }}
            />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            LIVE
          </span>
        </div>

        {/* Copy — dark psychology, Arabic */}
        <button
          type="button"
          onClick={() => navigate("/pricing")}
          className="group flex min-w-0 flex-1 items-center gap-2 text-right"
        >
          <span className="truncate text-[13px] font-semibold leading-tight text-foreground sm:text-sm">
            آخر فرصة —{" "}
            <span className="text-muted-foreground font-normal">
              السعر يرجع ضعف بعد العرض
            </span>
          </span>
        </button>

        {/* Promo code pill (referral style) */}
        <div
          dir="ltr"
          className="hidden shrink-0 items-center gap-2 rounded-full px-2.5 py-1 ring-1 ring-border backdrop-blur-sm sm:inline-flex"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--muted) / 0.6))",
          }}
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            CODE
          </span>
          <span
            className="font-mono text-[11px] font-semibold"
            style={{ color: "hsl(var(--primary))" }}
          >
            {PROMO_CODE}
          </span>
        </div>

        {/* Timer */}
        <div
          dir="ltr"
          className={`shrink-0 font-mono tabular-nums text-[12px] font-semibold ${
            urgent ? "text-red-400 animate-pulse" : "text-foreground"
          }`}
          aria-live="polite"
        >
          {days > 0 ? `${days}d ` : ""}
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigate("/pricing")}
          className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground transition active:scale-[0.97] hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.75) 100%)",
            boxShadow: "0 6px 24px -6px hsl(var(--primary) / 0.6)",
          }}
        >
          احجز السعر
        </button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="إغلاق"
          className="absolute left-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UnlimitedPromoBanner;
