import { motion } from "framer-motion";
import { useMemo } from "react";

interface DesktopGreetingProps {
  userName: string | null | undefined;
  isFirstVisit: boolean;
  returningGreetingIdx: number;
}

/**
 * Desktop empty-state greeting — "Editorial Quiet".
 * Warm ivory canvas, rotating dotted halo around a coral mark,
 * mixed serif + sans typography, soft date pill, breathing space.
 */
export const DesktopGreeting = ({
  userName,
  isFirstVisit,
  returningGreetingIdx,
}: DesktopGreetingProps) => {
  const raw = userName || "there";
  const dname = raw.charAt(0).toUpperCase() + raw.slice(1);
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
    <div className="relative z-10 hidden md:flex items-center justify-center px-6 pt-16 pb-20 md:pt-0 md:pb-[210px]">
      {/* Soft warm wash behind the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(217,119,87,0.10), transparent 70%), radial-gradient(40% 40% at 80% 70%, rgba(180,150,110,0.08), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center w-full max-w-2xl text-center"
      >
        {/* Date pill */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{
            background: "rgba(60,50,40,0.05)",
            border: "1px solid rgba(60,50,40,0.08)",
            color: "#6b6862",
            fontFamily: '"DM Sans","Inter",system-ui,sans-serif',
            fontSize: 12,
            letterSpacing: "0.02em",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "#d97757" }}
          />
          {dateLabel}
        </motion.div>

        {/* Rotating dotted halo + coral mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="relative mb-8 h-[72px] w-[72px]"
          aria-hidden
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            <svg viewBox="0 0 72 72" className="h-full w-full">
              <circle
                cx="36"
                cy="36"
                r="33"
                fill="none"
                stroke="rgba(60,50,40,0.18)"
                strokeWidth="1"
                strokeDasharray="1 5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <div
            className="absolute inset-[14px] rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #ef8a64, #c8623f 70%)",
              boxShadow:
                "0 6px 18px -6px rgba(200,90,55,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
                <line x1="12" y1="3" x2="12" y2="8" />
                <line x1="12" y1="16" x2="12" y2="21" />
                <line x1="3" y1="12" x2="8" y2="12" />
                <line x1="16" y1="12" x2="21" y2="12" />
                <line x1="5.5" y1="5.5" x2="9" y2="9" />
                <line x1="15" y1="15" x2="18.5" y2="18.5" />
                <line x1="18.5" y1="5.5" x2="15" y2="9" />
                <line x1="9" y1="15" x2="5.5" y2="18.5" />
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Editorial headline: serif lead + italic name */}
        <h1
          className="text-[54px] md:text-[64px] leading-[1.02]"
          style={{
            fontFamily: '"Instrument Serif","Source Serif Pro",Georgia,serif',
            fontWeight: 400,
            color: "#1f1e1c",
            letterSpacing: "-0.02em",
          }}
        >
          {lead},{" "}
          <span style={{ fontStyle: "italic", color: "#c8623f" }}>{tail}</span>
        </h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed"
          style={{
            color: "#6b6862",
            fontFamily: '"DM Sans","Inter",system-ui,sans-serif',
          }}
        >
          A quiet place to think out loud. Ask anything, paste anything,
          start anywhere.
        </motion.p>

        {/* Hairline divider — editorial flourish */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px w-24 origin-center"
          style={{ background: "rgba(60,50,40,0.18)" }}
        />
      </motion.div>
    </div>
  );
};

export default DesktopGreeting;
