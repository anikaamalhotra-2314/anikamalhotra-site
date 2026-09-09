"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EMAIL = "aavm07@me.com";

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
  const [emailCopied, setEmailCopied] = useState(false);

  // mailto: does nothing visible on a machine with no default mail app
  // registered (no error, no tab — it just silently no-ops), which is common
  // for visitors on webmail. Copying the address as a fallback means the
  // click is useful either way, and the confirmation tells people who *do*
  // have a mail app that something happened.
  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — mailto: still fires normally.
    }
  };

  // Publish the nav's real rendered height as a CSS var so HOME (see
  // page.tsx) can size itself to exactly one viewport minus the nav,
  // instead of guessing its height with a fixed rem value that drifts
  // out of sync whenever the nav's own padding/type size changes.
  useEffect(() => {
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
  }, []);

  // Always handle the click ourselves so Next's <Link> doesn't also do its own
  // hash scrolling (which double-appends the hash, e.g. /#WORK#WORK).
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
    <nav
      ref={navRef}
      className="sticky top-0 z-50 w-full flex justify-between md:justify-start gap-4 md:gap-40 px-6 md:px-20 py-6 md:py-8 text-base md:text-[1.2rem] bg-[var(--background)]/90 backdrop-blur-sm"
    >
      <Link href="/#HOME" onClick={goToSection("HOME")} className={linkClass}>
        AM
      </Link>
      <Link href="/#WORK" onClick={goToSection("WORK")} className={linkClass}>
        WORK
      </Link>
      <Link href="/ART" className={linkClass}>
        ART
      </Link>
      <Link href="/ABOUT" className={linkClass}>
        ABOUT
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <a
          href="https://www.linkedin.com/in/anika-malhotra-298056214/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="hover:opacity-60"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21v-6a4 4 0 0 0-8 0v6" />
            <path d="M4 9v12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <span className="relative">
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            aria-label="Email"
            className="hover:opacity-60"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 6-10 7L2 6" />
            </svg>
          </a>
          <span
            role="status"
            className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)] transition-opacity duration-200 ${
              emailCopied ? "opacity-100" : "opacity-0"
            }`}
          >
            email copied
          </span>
        </span>
        <a
          href="https://github.com/anikaamalhotra-2314?tab=repositories"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="hover:opacity-60"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55
              0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69
              1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7
              0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0
              c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25
              5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12
              C23.5 5.73 18.27.5 12 .5Z" />
          </svg>
        </a>
        <a
          href="/Anika_Malhotra_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          aria-label="Resume"
          className="hover:opacity-60"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
