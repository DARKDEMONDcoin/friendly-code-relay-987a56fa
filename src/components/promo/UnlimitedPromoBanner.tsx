import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import MegsyStar from "@/components/files/MegsyStar";
import { usePromoCountdown } from "@/hooks/usePromoCountdown";

const pad = (n: number) => String(n).padStart(2, "0");

const UnlimitedPromoBanner = () => {
  const navigate = useNavigate();
  const { active, days, hours, minutes, seconds } = usePromoCountdown();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!active || !el) {
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
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Limited time offer"
      className="relative z-40 w-full bg-[hsl(var(--brand-ink))] border-b border-white/10"
    >
      <button
        type="button"
        onClick={() => navigate("/pricing")}
        className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[13px] font-medium tracking-tight text-white hover:brightness-110 transition"
      >
        <span className="inline-flex items-center gap-2">
          <span className="font-semibold">
            50% OFF + Unlimited Chat, Images & Videos
          </span>
          <span className="text-white/50">—</span>
          <span className="text-white/70">first month free</span>
        </span>

        <span aria-hidden className="hidden sm:block w-px h-3 bg-white/10" />

        <span className="inline-flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-white/50 text-[12px] uppercase tracking-wider font-medium">
              offer ends in
            </span>
            <span
              className="inline-flex items-center gap-1 text-amber-400 font-medium tabular-nums"
              aria-live="polite"
            >
              <span>{pad(days)}</span>
              <span className="text-white/40">d</span>
              <span className="text-white/30" aria-hidden>
                :
              </span>
              <span>{pad(hours)}</span>
              <span className="text-white/40">h</span>
              <span className="text-white/30" aria-hidden>
                :
              </span>
              <span>{pad(minutes)}</span>
              <span className="text-white/40">m</span>
              <span className="text-white/30" aria-hidden>
                :
              </span>
              <span>{pad(seconds)}</span>
              <span className="text-white/40">s</span>
            </span>
          </span>

          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold group">
            Claim now
            <MegsyStar
              size={14}
              static
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </span>
      </button>
    </div>
  );
};

export default UnlimitedPromoBanner;
