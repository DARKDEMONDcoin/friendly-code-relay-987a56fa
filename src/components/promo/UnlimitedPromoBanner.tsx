import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X, Zap } from "lucide-react";
import { usePromoCountdown } from "@/hooks/usePromoCountdown";

const pad = (n: number) => String(n).padStart(2, "0");
const DISMISS_KEY = "promo-banner-dismissed-v5";
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

  const goPricing = () => navigate("/pricing");
  const urgent = days === 0 && hours < 12;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="عرض الاشتراك المحدود"
      dir="rtl"
      className="relative z-40 w-full overflow-hidden bg-background"
    >
      {/* Referral-style ambient primary glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(70% 140% at 50% 0%, hsl(var(--primary) / 0.28), transparent 70%)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Bottom primary hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.55), transparent)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl items-center gap-2.5 px-3 py-2.5 pl-10 sm:gap-3 sm:px-4 sm:pl-12">
        {/* Avatar-style icon with primary glow halo — matches referral hero */}
        <div className="relative shrink-0">
          <div
            aria-hidden
            className="absolute -inset-1.5 rounded-full blur-md"
            style={{ background: "hsl(var(--primary) / 0.55)" }}
          />
          <div
            className="relative flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-border"
            style={{ background: "hsl(var(--card))" }}
          >
            <Zap
              className="h-3.5 w-3.5"
              style={{ color: "hsl(var(--primary))" }}
              strokeWidth={2.5}
              fill="currentColor"
            />
          </div>
        </div>

        {/* Copy stack — dark-psych */}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] font-semibold text-foreground sm:text-sm">
            وفّر 50% — أو ادفع الضعف لاحقاً
          </span>
          <span className="hidden truncate text-[11px] text-muted-foreground sm:block">
            آلاف اشتركوا الأسبوع ده · العرض بينتهي وما بيرجعش
          </span>
        </div>

        {/* Gift-card style code pill — matches referral welcome gift */}
        <div
          dir="ltr"
          className="hidden shrink-0 items-center gap-2 rounded-full px-2.5 py-1 ring-1 ring-border backdrop-blur-sm md:inline-flex"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--muted) / 0.6))",
          }}
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            CODE
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px] text-primary-foreground"
            style={{ background: "hsl(var(--primary))" }}
          >
            {PROMO_CODE}
          </span>
        </div>

        {/* Countdown — mono, turns red+pulse in final 12h */}
        <div
          dir="ltr"
          className={`shrink-0 font-mono tabular-nums text-[12px] font-semibold ${
            urgent ? "animate-pulse text-red-400" : "text-foreground/90"
          }`}
          aria-live="polite"
        >
          {days > 0 ? `${days}d ` : ""}
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>

        {/* CTA — matches referral primary gradient button */}
        <button
          type="button"
          onClick={goPricing}
          className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground transition active:scale-[0.97] hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.75) 100%)",
            boxShadow: "0 8px 28px -8px hsl(var(--primary) / 0.65)",
          }}
        >
          ثبّت السعر
        </button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="إغلاق"
          className="absolute left-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UnlimitedPromoBanner;
