"use client";

import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";

// A small live analog + digital clock, always showing New York time
// regardless of the visitor's own timezone — this is Anika's site, so "nyc"
// is a fixed label, not something that needs to adapt to the viewer.
const HOUR_LEN = 34;
const MINUTE_LEN = 46;
const SECOND_LEN = 50;

function nycParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const get = (type: string) =>
    Number(fmt.formatToParts(date).find((p) => p.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}

function nycLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export default function ClockWidget({
  titleBarProps,
}: {
  titleBarProps?: HTMLAttributes<HTMLDivElement>;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // The 0ms timeout (not an immediate call) defers this first tick out of
    // the effect's own synchronous body — calling setState directly inside
    // an effect risks cascading renders, so the update needs to happen in a
    // later callback even when "later" is effectively instant.
    const initial = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  if (!visible || !now) return null;

  const { hour, minute, second } = nycParts(now);
  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  return (
    <div className="w-full h-full rounded-lg border border-black/10 bg-white shadow-xl overflow-hidden flex flex-col">
      <div
        {...titleBarProps}
        className="flex items-center justify-end px-2 py-1.5 border-b border-black/10 bg-neutral-50 shrink-0"
      >
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close clock"
          className="text-neutral-400 hover:text-neutral-700 leading-none text-sm w-4 h-4 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-24 h-24">
          {/* Same technique as the splash spinner's ticks (SplashScreen.tsx):
              positioned at the container's edge, with transform-origin set
              to a point on the OPPOSITE side (the container's center) so a
              single rotate() sweeps it around a full circle. Two chained
              transform functions (translate then rotate) would compose
              instead of that — the translate shifts the element before the
              rotate has a chance to place it around the center, bunching
              every tick near the same spot rather than spacing them out. */}
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-0 w-px h-2 bg-[#1d3fd6]/70"
              style={{
                transformOrigin: "50% 3rem",
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
          <span
            className="absolute left-1/2 top-1/2 w-0.5 -ml-px bg-[#1d3fd6] rounded-full"
            style={{
              height: `${HOUR_LEN}px`,
              marginTop: `-${HOUR_LEN}px`,
              transformOrigin: "50% 100%",
              transform: `rotate(${hourDeg}deg)`,
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 w-0.5 -ml-px bg-[#1d3fd6] rounded-full"
            style={{
              height: `${MINUTE_LEN}px`,
              marginTop: `-${MINUTE_LEN}px`,
              transformOrigin: "50% 100%",
              transform: `rotate(${minuteDeg}deg)`,
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 w-px -ml-px bg-[#d6291d]"
            style={{
              height: `${SECOND_LEN}px`,
              marginTop: `-${SECOND_LEN}px`,
              transformOrigin: "50% 100%",
              transform: `rotate(${secondDeg}deg)`,
            }}
          />
          <span className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#1d3fd6]" />
        </div>
      </div>

      <div className="flex justify-between px-3 pb-2.5 text-xs text-[#1d3fd6] shrink-0">
        <span>nyc</span>
        <span>{nycLabel(now)}</span>
      </div>
    </div>
  );
}
