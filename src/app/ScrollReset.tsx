"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The page scrolls inside `body` (see layout.tsx's `overflow-y-auto`), not
// `window` — so Next's built-in scroll-to-top on navigation, which only
// resets `window`, never touches it. Without this, navigating away from a
// scrolled-down section (e.g. WORK) to another page opens it already
// scrolled by however far the previous page was.
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
