"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The page scrolls inside `body` (see layout.tsx's `overflow-y-auto`), not
// `window` — so Next's built-in scroll-to-top on navigation, which only
// resets `window`, never touches it. Without this, navigating away from a
// scrolled-down section (e.g. WORK) to another page opens it already
// scrolled by however far the previous page was.
//
// window.scrollTo(0, 0) runs too: body isn't the ONLY scrollable surface —
// `html` can carry a small amount of its own overflow separately, and a
// hash-carrying navigation (e.g. clicking the nav title, which routes to
// `/#HOME`) makes Next's router try to scroll that hash target into view
// using window scrolling specifically. Resetting only body left a few
// leftover pixels of window scroll behind, just enough to reveal the
// footer's top edge on an otherwise-reset page.
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // The object form with an explicit "instant" behavior, not scrollTo(0, 0):
    // the two-number form still defers to the "auto" behavior, which itself
    // defers to the page's own scroll-behavior CSS (globals.css sets it to
    // "smooth" site-wide for in-page nav) — so without this, this reset was
    // itself animating into place instead of snapping, on every navigation.
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
