import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";
import NavSpacer from "./NavSpacer";
import Footer from "./Footer";
import { GalleryProvider } from "./GalleryContext";
import ScrollReset from "./ScrollReset";
import PageTransition from "./PageTransition";
import SplashScreen from "./SplashScreen";

export const metadata: Metadata = {
  title: "ANIKA MALHOTRA",
  description: "A personal website with Anika Malhotra's technical work and art, built from React and Next.js.",
  icons: {
    icon: "/person-website-icon-square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      // Next 16 stopped forcing an instant scroll during route transitions
      // by default (see its v16 upgrade guide) — without this attribute, the
      // site's global `scroll-behavior: smooth` (globals.css) applies to
      // Next's own scroll-to-top-on-navigation too, so it animates instead
      // of snapping. That's what read as the page "scrolling down slightly"
      // after clicking a project link: a real, visible scroll animation
      // playing out over the transition instead of an instant, invisible
      // reset. This restores the pre-16 instant-reset behavior.
      data-scroll-behavior="smooth"
    >
      <body className="relative h-screen overflow-y-auto flex flex-col">
        <SplashScreen />
        <GalleryProvider>
          <ScrollReset />
          <Nav />
          {/* flex-1 lets short pages' content still push Footer to the
              bottom of the viewport; pages taller than the viewport just
              grow past it normally. NavSpacer compensates for Nav now being
              fixed (see Nav.tsx) rather than sticky — a fixed element is
              taken out of flow entirely, so without this the content would
              start underneath it instead of below it (except on routes
              where Nav hides itself — see NavSpacer.tsx). */}
          <NavSpacer>
            <PageTransition>{children}</PageTransition>
          </NavSpacer>
          <Footer />
        </GalleryProvider>
      </body>
    </html>
  );
}
