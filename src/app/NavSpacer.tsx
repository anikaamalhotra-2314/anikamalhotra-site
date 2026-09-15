"use client";

import { usePathname } from "next/navigation";
import { hidesNav } from "./routeChrome";

// Reserves room for the fixed Nav via the --nav-h CSS var Nav.tsx publishes
// (see there) — except on routes where Nav hides itself, where this skips
// the padding entirely instead of relying on that var.
//
// It has to decide that the same way, in the same render pass, as Nav
// itself: both read usePathname() and run the same hidesNav() check, so
// there's never a frame where Nav has already unmounted but this is still
// reserving space for it (or vice versa). Splitting the decision across a
// shared CSS variable instead — Nav writing 0px in an effect once it knows
// it's hidden, this component reading that var — left exactly that gap:
// effects run after paint, so the old (nonzero) --nav-h value was still in
// effect for the first frame or two of the new route, and the content
// visibly jumped once the var caught up. Deriving `hidden` here directly
// removes the race instead of just narrowing it.
export default function NavSpacer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidden = hidesNav(pathname ?? "");

  return (
    <div
      className="flex-1"
      style={hidden ? undefined : { paddingTop: "var(--nav-h, 4.75rem)" }}
    >
      {children}
    </div>
  );
}
