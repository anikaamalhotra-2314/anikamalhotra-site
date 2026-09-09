import type { Metadata } from "next";
import { Sometype_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./Nav";
import Footer from "./Footer";
import { GalleryProvider } from "./GalleryContext";
import ScrollReset from "./ScrollReset";

export const metadata: Metadata = {
  title: "ANIKA MALHOTRA",
  description: "A personal website with Anika Malhotra's technical work and art, built from React and Next.js.",
  icons: {
    icon: "/person-website-icon-square.png",
  },
};

const sometypeMono = Sometype_Mono({
  variable: "--font-sometype-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sometypeMono.variable} h-full antialiased`}
    >
      <body className="relative h-screen overflow-y-auto flex flex-col">
        <GalleryProvider>
          <ScrollReset />
          <Nav />
          {/* flex-1 lets short pages' content still push Footer to the
              bottom of the viewport; pages taller than the viewport (e.g.
              home's HOME + WORK sections) just grow past it normally. */}
          <div className="flex-1">{children}</div>
          <Footer />
        </GalleryProvider>
      </body>
    </html>
  );
}
