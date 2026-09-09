"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ProjectTile from "./ProjectTile";

export type PanelProject = {
  slug: string;
  title: string;
  body: React.ReactNode;
};

export default function ProjectsSection({
  projects,
}: {
  projects: PanelProject[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = openId
    ? projects.find((p) => p.slug === openId) ?? null
    : null;

  // Close on Escape, and lock body scroll while the panel is open.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId]);

  return (
    <section
      id="WORK"
      className="relative min-h-screen flex flex-col items-center scroll-mt-24"
    >

      <div id="projects" className="w-full flex flex-col gap-15 px-6 md:px-10 pb-16 text-sm [&_h1]:text-base [&_h2]:text-sm [&_h1.text-xl]:text-lg">
        {/* 1 & 3 */}
        <div className="flex flex-col md:flex-row justify-between gap-15 md:gap-0">
          <ProjectTile
            id="mongodb-docs"
            onOpen={setOpenId}
            className="flex justify-center gap-3 w-full md:w-5/12"
          >
            <div className="mt-7">
              <Image
                className="-rotate-43"
                src="/leaf-Photoroom.png"
                alt="leaf"
                width={68}
                height={68}
              />
            </div>
            <div className="flex flex-col justify-center gap-2 w-5/12">
              <h1 className="text-xl">01.</h1>
              <h2>DOCS & ENGINEERING @ MONGODB</h2>
              <h2>Leading & creating documentation for Atlas workload resilience and building AI tooling for docs. </h2>
            </div>
          </ProjectTile>
          <ProjectTile
            id="personal-website"
            onOpen={setOpenId}
            className="flex justify-center gap-1 w-full md:w-5/12"
          >
            <div className="-mr-10">
              <Image
                src="/person-website-icon-Photoroom.png"
                alt="personal website"
                width={160}
                height={160}
              />
            </div>
            <div className="flex flex-col justify-center gap-2 w-5/12">
              <h1>PERSONAL WEBSITE</h1>
              <h2>Combining my personal design style and my love for web development to build this site. </h2>
              <h1 className="text-xl">03.</h1>
            </div>
          </ProjectTile>
        </div>

        {/* 2 */}
        <div className="flex justify-center">
          <ProjectTile
            id="vino"
            onOpen={setOpenId}
            className="flex justify-center w-full md:w-1/2"
          >
            <div className="flex flex-col justify-center gap-2 w-1/3 text-right">
              <h1 className="text-xl">02.</h1>
              <h1>VINO</h1>
              <h2>Designing and building a site for an accessible guide to wine for beginners.</h2>
            </div>
            <div>
              <Image
                src="/wine-glass-Photoroom.png"
                alt="red wine glass"
                width={88}
                height={88}
              />
            </div>
          </ProjectTile>
        </div>

        {/* 4 & 5 */}
        <div className="flex flex-col md:flex-row justify-between gap-15 md:gap-0">
          <ProjectTile
            id="omakase-nyc"
            onOpen={setOpenId}
            className="flex justify-center gap-3 w-full md:w-5/12"
          >
            <div className="flex flex-col justify-center gap-2 w-5/12">
              <h1 className="text-xl">04.</h1>
              <h2>OMAKASE NYC</h2>
              <h2>Designing and implementing a website to track and share the best omakase restaurants in NYC. </h2>
              <Image
                className="mt-3"
                src="/omakase.png"
                alt="fish"
                width={176}
                height={176}
              />
            </div>
          </ProjectTile>
          <ProjectTile
            id="tw-internship"
            onOpen={setOpenId}
            className="flex justify-center w-full md:w-1/2"
          >
            <div className="flex flex-col justify-center gap-2 w-1/3 text-right">
              <h1 className="text-xl">05.</h1>
              <h1>MONGODB TECH WRITING INTERNSHIP</h1>
              <h2>Writing and testing React Native code samples for the Realm Database SDK docs.</h2>
            </div>
            <div className="mt-5">
              <Image
                src="/docs-icon-Photoroom.png"
                alt="docs icon"
                width={144}
                height={144}
              />
            </div>
          </ProjectTile>
        </div>

        {/* 6 */}
        <div className="flex justify-center">
          <ProjectTile
            id="ncr"
            onOpen={setOpenId}
            className="flex justify-center w-full md:w-1/2"
          >
            <div className="flex flex-col justify-center gap-2 w-5/12">
              <div>
                <Image
                  src="/ncr.png"
                  alt="100 dollar bill"
                  width={144}
                  height={144}
                />
              </div>
              <h1>NCR SOFTWARE ENGINEERING INTERNSHIP - DIGITAL BANKING</h1>
              <h2>Building microapplications with React and external APIs. Creating a dashboard for API usage metrics to improve developer portal experience.</h2>
              <h1 className="text-xl">06.</h1>
            </div>
          </ProjectTile>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setOpenId(null)}
        className={`fixed inset-0 z-60 bg-black/30 transition-opacity duration-300 ${
          openId ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!openId}
      />

      {/* Side panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!openId}
        aria-label={active ? active.title : undefined}
        className={`fixed top-0 right-0 z-70 h-full w-full md:w-3/4 overflow-y-auto bg-[var(--background)] border-l border-black/10 shadow-xl transition-transform duration-300 ease-out ${
          openId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {active && (
          <div className="flex flex-col gap-6 p-8">
            <button
              onClick={() => setOpenId(null)}
              aria-label="Close panel"
              className="self-end text-2xl leading-none cursor-pointer hover:opacity-60"
            >
              ×
            </button>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-center">{active.title}</h2>
            </div>
            {/* Cap the measure. The panel is ~1080px on desktop, which ran the
                body text to ~109 characters a line — well past the 45-75 that
                stays comfortable to read, and the main reason the panel looked
                like one slab of text. */}
            <div
              data-lightbox-group
              className="flex w-full max-w-[90ch] flex-col gap-4 self-center"
            >
              {active.body}
            </div>
          </div>
        )}
      </aside>
    </section>
  );
}
