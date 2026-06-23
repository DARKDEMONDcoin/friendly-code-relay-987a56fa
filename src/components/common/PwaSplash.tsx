import { useEffect, useState } from "react";

/**
 * Animated splash screen shown on first paint when the app is launched
 * as a PWA (installed on iOS/Android home screen). Falls back to invisible
 * in regular browsers so it doesn't flash on every page load.
 *
 * Uses pure CSS animations (no framer-motion) so it renders before any
 * React lazy chunk loads — instantly visible.
 */
export default function PwaSplash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    // Only show in standalone / installed mode
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari legacy
      (window.navigator as any).standalone === true;
    return standalone;
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeT = window.setTimeout(() => setFading(true), 1200);
    const hideT = window.setTimeout(() => setShow(false), 1700);
    return () => {
      window.clearTimeout(fadeT);
      window.clearTimeout(hideT);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 480ms ease-out",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes megsy-spin {
          0%   { transform: rotate(0deg)   scale(0.85); opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: rotate(180deg) scale(1.08); }
          100% { transform: rotate(360deg) scale(1);    opacity: 1; }
        }
        @keyframes megsy-pulse {
          0%,100% { transform: scale(1);    opacity: 0.55; }
          50%     { transform: scale(1.35); opacity: 0;    }
        }
        .megsy-splash-star {
          animation: megsy-spin 1.4s cubic-bezier(.2,.7,.2,1) infinite;
          transform-origin: 50% 50%;
          filter: drop-shadow(0 0 24px rgba(201,168,76,0.45));
        }
        .megsy-splash-ring {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.55);
          animation: megsy-pulse 1.8s ease-out infinite;
        }
      `}</style>
      <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
        <div className="megsy-splash-ring" />
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="megsy-splash-star"
        >
          <path
            d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z"
            fill="#c9a84c"
          />
        </svg>
      </div>
    </div>
  );
}