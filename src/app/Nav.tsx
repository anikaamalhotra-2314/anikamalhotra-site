"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { hidesNav } from "./routeChrome";

// Underline that wipes in from the left on hover. It's a scaled ::after bar
// rather than a width transition so it animates on the compositor, and it's
// always full-width — so the line can't reflow the text as it grows.
// focus-visible gets the same treatment for keyboard users.
//
// Note transition-[scale], not transition-transform: Tailwind v4 compiles
// scale-x-0 to the standalone `scale` property, so transitioning `transform`
// animates nothing and the bar just sits there fully drawn.
const linkClass =
  "relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 " +
  "after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current " +
  "after:transition-[scale] after:duration-300 after:ease-out after:content-[''] " +
  "hover:after:scale-x-100 focus-visible:after:scale-x-100 " +
  "motion-reduce:after:transition-none";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const hidden = hidesNav(pathname ?? "");

  // Publish the nav's real rendered height as a CSS var so HOME (see
  // page.tsx) can size itself to exactly one viewport minus the nav,
  // instead of guessing its height with a fixed rem value that drifts
  // out of sync whenever the nav's own padding/type size changes. When the
  // nav is hidden, that's 0 — otherwise layout.tsx's pt-[var(--nav-h)]
  // would leave behind a blank gap sized for the previous page's nav.
  useEffect(() => {
    if (hidden) {
      document.documentElement.style.setProperty("--nav-h", "0px");
      return;
    }
    const el = navRef.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.offsetHeight}px`
      );
    };
    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hidden]);

  if (hidden) return null;

  // Always handle the click ourselves so Next's <Link> doesn't also do its own
  // hash scrolling (which double-appends the hash, e.g. /#HOME#HOME).
  const goToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `/#${id}`);
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    // pointer-events-none on the bar itself, re-enabled per link below: nav
    // has no background anymore, but as a fixed, full-width element it still
    // occupies that whole strip for hit-testing — without this, dragging a
    // home-page element up into that strip (see Draggable.tsx) made it
    // ungrabbable again, since clicks on the drag handle landed on empty nav
    // space instead of reaching the element underneath.
    <nav
      ref={navRef}
      className="fixed top-0 left-0 z-50 w-full px-6 md:px-10 text-base md:text-[1.2rem] pointer-events-none"
    >
      {/* items-start, not items-center: work/art stack two lines tall, and
          the title should align with the top of that stack, not its
          vertical middle — matching how this looked when the stack was
          absolutely positioned instead of a real flex item (see below).

          The left-hand spacer is invisible but NOT absolutely positioned —
          it's a real (if invisible) flex item, matching the work/art
          column's own width, so justify-between centers the title against
          the visible content rather than the full nav width. That's also
          what fixes a real bug: the work/art column used to be positioned
          absolutely, which pulled it out of flow entirely, so nav's own
          box was only ever as tall as the single-line title — two lines
          shorter than the stack actually rendered. Scrolled content showed
          through in that gap, under the stack's second line ("art") but
          outside nav's own background. Making the stack a normal flex item
          instead means its height is now what actually sizes nav. */}
      <div className="flex items-start justify-between gap-4">
        <div aria-hidden="true" className="invisible flex flex-col items-end gap-2">
          <span className={linkClass}>work</span>
          <span className={linkClass}>art</span>
          <span className={linkClass}>resume</span>
        </div>
        <Link
          href="/#HOME"
          onClick={goToSection("HOME")}
          className={`${linkClass} mt-1.5 pointer-events-auto`}
        >
          Anika Malhotra
        </Link>
        <div className="flex flex-col items-end gap-0.5">
          <Link href="/WORK" className={`${linkClass} mt-3 pointer-events-auto`}>
            work
          </Link>
          <Link href="/ART" className={`${linkClass} pointer-events-auto`}>
            art
          </Link>
          <a
            href="/Anika_Malhotra_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className={`${linkClass} pointer-events-auto`}
          >
            resume
          </a>
        </div>
      </div>
    </nav>
  );
}
