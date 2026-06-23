import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X, Infinity as InfinityIcon } from "lucide-react";
import { usePromoCountdown } from "@/hooks/usePromoCountdown";

const pad = (n: number) => String(n).padStart(2, "0");
const DISMISS_KEY = "promo-banner-dismissed-v3";

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

  const handleClaim = () => navigate("/pricing");

  if (!visible) return null;

  const TimeChip = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center min-w-[28px] rounded-md bg-white/10 px-1.5 py-0.5 leading-none">
      <span className="tabular-nums text-[12px] font-semibold text-white">
        {pad(value)}
      </span>
      <span className="text-[8px] uppercase tracking-wider text-white/60 mt-0.5">
        {label}
      </span>
    </div>
  );

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Unlimited plan limited time offer"
      className="relative z-40 w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(95deg, #1a0f2e 0%, #2a1b4a 45%, #3a1a5a 70%, #1a0f2e 100%)",
      }}
    >
      {/* amber sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 140% at 50% 50%, rgba(251,191,36,0.12), transparent 60%)",
        }}
      />
      {/* bottom hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl items-center gap-2 px-3 py-2 pr-10 sm:gap-3 sm:px-4">
        {/* Icon badge */}
        <span
          aria-hidden
          className="hidden xs:inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-[0_0_18px_rgba(251,191,36,0.35)]"
        >
          <InfinityIcon className="h-3.5 w-3.5" strokeWidth={3} />
        </span>

        {/* Copy */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30">
            50% OFF
          </span>
          <span className="truncate text-[13px] font-semibold text-white sm:text-sm">
            Unlimited{" "}
            <span className="font-normal text-white/70">
              Chat · Images · Videos
            </span>
          </span>
        </div>

        {/* Timer */}
        <div
          className="hidden items-center gap-1 sm:flex"
          aria-live="polite"
        >
          <TimeChip value={days} label="d" />
          <TimeChip value={hours} label="h" />
          <TimeChip value={minutes} label="m" />
          <TimeChip value={seconds} label="s" />
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleClaim}
          className="shrink-0 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-1.5 text-[12px] font-bold text-black shadow-[0_4px_14px_rgba(251,191,36,0.35)] transition-transform active:scale-95 hover:brightness-110"
        >
          Claim
        </button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss offer"
          className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UnlimitedPromoBanner;
