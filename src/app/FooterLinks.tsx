"use client";

import { useState } from "react";

const EMAIL = "aavm07@me.com";

const iconClass = "hover:opacity-60";

export default function FooterLinks() {
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

  return (
    <div className="flex items-center gap-4">
      <a
        href="https://www.linkedin.com/in/anika-malhotra-298056214/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className={iconClass}
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
          className={iconClass}
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
          className={`pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)] transition-opacity duration-200 ${
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
        className={iconClass}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </svg>
      </a>
    </div>
  );
}
