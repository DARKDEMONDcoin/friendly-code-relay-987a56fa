import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { usePromoCountdown } from "@/hooks/usePromoCountdown";

const pad = (n: number) => String(n).padStart(2, "0");
const DISMISS_KEY = "promo-banner-dismissed-v2";

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

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center leading-none">
      <span className="tabular-nums font-semibold text-white text-[13px]">
        {pad(value)}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">
        {label}
      </span>
    </div>
  );

  const Sep = () => (
    <span aria-hidden className="text-white/20 text-[13px] font-semibold -mt-2">
      :
    </span>
  );

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Limited time offer"
      className="relative z-40 w-full overflow-hidden border-b border-white/[0.08]"
      style={{
        background:
          "linear-gradient(90deg, hsl(var(--brand-ink)) 0%, #1a1530 50%, hsl(var(--brand-ink)) 100%)",
      }}
    >
      {/* subtle glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(251,191,36,0.08), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-center gap-3 px-10 py-2.5">
        <button
          type="button"
          onClick={() => navigate("/pricing")}
          className="group flex items-center gap-3 text-[13px] text-white/90 transition-colors hover:text-white"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/30">
            <Sparkles className="h-3 w-3 text-amber-300" />
          </span>

          <span className="font-semibold tracking-tight">
            50% OFF
          </span>
          <span className="hidden sm:inline text-white/70 font-normal">
            Unlimited Chat, Images & Videos
          </span>

          <span aria-hidden className="hidden md:block h-3.5 w-px bg-white/15" />

          <span
            className="hidden md:flex items-center gap-1.5"
            aria-live="polite"
          >
            <TimeUnit value={days} label="d" />
            <Sep />
            <TimeUnit value={hours} label="h" />
            <Sep />
            <TimeUnit value={minutes} label="m" />
            <Sep />
            <TimeUnit value={seconds} label="s" />
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-black transition-transform group-hover:translate-x-0.5">
            Claim
            <ArrowRight className="h-3 w-3" />
          </span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss offer"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default UnlimitedPromoBanner;
