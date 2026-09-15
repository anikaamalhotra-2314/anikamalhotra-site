"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

// Keyed by pathname so each route change gets its own transition, matching
// the pattern React's docs use for same-route content swaps (crossfading by
// `key`), applied here to whole-page navigations instead.
//
// The inner div's opaque background is load-bearing, not decoration: the
// page-wipe CSS (globals.css, targeting ::view-transition-old/new(page))
// only ever sees whatever this element itself paints — backgrounds from
// ancestors outside the ViewTransition boundary aren't part of what gets
// snapshotted. Without a background painted in here, the snapshot has
// transparent pixels wherever the page doesn't paint (margins, gaps),
// letting the other page show through the still-unwiped portion mid-wipe.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ViewTransition name="page" key={pathname}>
      <div className="bg-[var(--background)]">{children}</div>
    </ViewTransition>
  );
}
