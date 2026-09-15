// Individual project pages (/WORK/[slug]) render their own full-page chrome
// (see that route) with no room for the site nav, so it's hidden there. Nav.tsx
// and NavSpacer.tsx both need this exact same route match — sharing it keeps
// the two decisions from ever drifting out of sync with each other.
export function hidesNav(pathname: string) {
  return /^\/WORK\/[^/]+/.test(pathname);
}
