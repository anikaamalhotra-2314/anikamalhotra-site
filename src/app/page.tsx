import Image from "next/image";
import ProjectsSection from "./ProjectsSection";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      {/* min-h-[100vh-navH] (not h-full) so HOME sizes itself off the
          viewport directly, independent of WORK's own min-h-screen below
          it — the two used to fight over a shared percentage-height
          ancestor, which let HOME's box balloon to include WORK's height
          and pushed the footer partway down the page instead of after
          WORK. --nav-h is measured live from the actual nav (see Nav.tsx)
          so HOME's bottom edge — and the star/scroll-cue pinned to it —
          land exactly at the viewport edge instead of guessing the nav's
          height and running off-screen by the difference. */}
      <section
        id="HOME"
        className="relative min-h-[calc(100vh-var(--nav-h,4.75rem))] flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-8 px-6 py-6 md:py-0 scroll-mt-24 overflow-hidden"
      >
        <div className="flex items-start md:ml-30 -translate-y-6 md:-translate-y-10">
          <div className="md:mt-10">
            <Image
              className="w-28 md:w-55 h-auto"
              src="/IMG_0355.JPG"
              alt="screenprinted girl"
              width={250}
              height={250}
            />
          </div>
          <div className="-ml-6 mt-6 md:mt-0 md:-ml-35">
            <Image
              className="w-25 md:w-37 h-auto"
              src="/personal-site-pic.jpeg"
              alt="image of anika malhotra"
              width={165}
              height={165}
            />
          </div>
        </div>
        <div className="max-w-sm -translate-y-6 md:-translate-y-10">
          <h1 className="text-2xl md:text-3xl text-center md:text-right">
            ANIKA MALHOTRA is a TECHNICAL WRITER / CODER / DESIGN LOVER in NYC.
          </h1>
        </div>
        <div>
          <Image
            className="absolute top-1/8 left-1/50 -z-10 -rotate-20 star-a w-13 md:w-24 h-auto"
            src="/red_stars-removebg-preview.png"
            alt="red stars"
            width={120}
            height={120}
          />
          <Image
            className="absolute bottom-14 right-6 md:right-16 -z-10 rotate-45 star-c w-10 md:w-16 h-auto"
            src="/stars-removebg-preview.png"
            alt="stars"
            width={80}
            height={80}
          />
        </div>

        {/* Scroll cue */}
        <a
          href="#WORK"
          aria-label="Scroll to work"
          className="absolute bottom-1/10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* WORK */}
      <ProjectsSection projects={projects} />
    </div>
  );
}
