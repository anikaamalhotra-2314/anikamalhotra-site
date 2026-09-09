"use client";

import { useEffect, useRef } from "react";

// Publishes the footer's real rendered height as a CSS var, the same way
// Nav.tsx does for the nav — so a page section can size itself to exactly
// one viewport minus nav *and* footer instead of guessing both heights with
// fixed rem values that drift out of sync whenever either one's content or
// padding changes.
export default function FooterMeasure({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--footer-h",
        `${el.offsetHeight}px`
      );
    };
    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className={className}>
      {children}
    </footer>
  );
}
