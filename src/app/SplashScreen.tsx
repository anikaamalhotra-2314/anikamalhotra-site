"use client";

import { useEffect, useState } from "react";

// A full-screen white loader shown on the very first hard load of the site
// (window's "load" event — not Next's client-side route transitions, which
// never re-fire it). The real page renders normally underneath the whole
// time; this only covers it until images/fonts/etc. have actually finished
// loading.
//
// Three phases, each a fade rather than a cut: spinner fades out to a blank
// white beat, then that blank overlay itself fades away to reveal the
// already-fully-rendered page underneath. SPINNER_FADE_MS/OVERLAY_FADE_MS
// drive the setTimeout chain below and must match the duration-[…] classes
// on the elements they fade (Tailwind classes, not inline styles, so
// motion-reduce:duration-0 below can actually override them — an inline
// style's duration can't be beaten by a stylesheet without !important).
const TICK_COUNT = 8;
const CYCLE_MS = 1000;
const MIN_VISIBLE_MS = 400;
const SPINNER_FADE_MS = 400;
const BLANK_MS = 150;
const OVERLAY_FADE_MS = 500;

type Phase = "spinner" | "blank" | "fadeOut" | "done";

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("spinner");

  useEffect(() => {
    const start = Date.now();

    // A minimum visible time keeps a fast/cached load from just blinking the
    // spinner for a frame — smoother than an instant, jarring skip.
    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      setTimeout(() => setPhase("blank"), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  // Each phase change waits out the CSS transition (or pause) it started
  // before advancing to the next one.
  useEffect(() => {
    if (phase === "blank") {
      const t = setTimeout(() => setPhase("fadeOut"), SPINNER_FADE_MS + BLANK_MS);
      return () => clearTimeout(t);
    }
    if (phase === "fadeOut") {
      const t = setTimeout(() => setPhase("done"), OVERLAY_FADE_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "done") return null;

  const overlayVisible = phase === "spinner" || phase === "blank";
  const spinnerVisible = phase === "spinner";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-[500ms] ease-out motion-reduce:duration-0 ${
        overlayVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative w-11 h-11 transition-opacity duration-[400ms] ease-out motion-reduce:duration-0 motion-reduce:opacity-0 ${
          spinnerVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 left-1/2 w-1 h-3 -ml-0.5 rounded-full bg-[#171717]"
            style={{
              transformOrigin: "50% 1.375rem",
              transform: `rotate(${(360 / TICK_COUNT) * i}deg)`,
              animation: `splash-tick ${CYCLE_MS}ms linear infinite`,
              animationDelay: `${(-CYCLE_MS * i) / TICK_COUNT}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
