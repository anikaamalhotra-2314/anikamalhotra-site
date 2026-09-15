import Image from "next/image";
import Link from "next/link";

type GridProject = {
  id: string;
  number: string;
  icon: { src: string; alt: string; size?: number };
  description: string;
};

// The 6 real projects, in display order. Index within GRID_SIZE below is
// what actually places each one among the "00" filler cells — see PROJECTS.
// `id` doubles as the slug of its /WORK/[slug] page (see src/content/projects).
const GRID_PROJECTS: GridProject[] = [
  {
    id: "mongodb-docs",
    number: "01",
    icon: { src: "/leaf-Photoroom.png", alt: "leaf" },
    description:
      "building ai-powered tools, writing code examples, and leading docs creation at mongodb. main tech: typescript, python, rst/mdx, git/github.",
  },
  {
    id: "vino",
    number: "02",
    icon: { src: "/wine-glass-Photoroom.png", alt: "red wine glass", size: 72 },
    description:
      "designing and building a site for an accessible guide to wine for beginners.",
  },
  {
    id: "personal-website",
    number: "03",
    icon: { src: "/person-website-icon-Photoroom.png", alt: "personal website" },
    description:
      "combining my personal design style and my love for web development to build this site.",
  },
  {
    id: "omakase-nyc",
    number: "04",
    icon: { src: "/omakase.png", alt: "fish", size: 72 },
    description:
      "designing and implementing a website to track and share the best omakase restaurants in nyc.",
  },
  {
    id: "tw-internship",
    number: "05",
    icon: { src: "/docs-icon-Photoroom.png", alt: "docs icon" },
    description:
      "writing and testing react native code samples for the realm database sdk docs.",
  },
  {
    id: "ncr",
    number: "06",
    icon: { src: "/ncr.png", alt: "100 dollar bill", size: 72 },
    description:
      "building microapplications with react and external apis. creating a dashboard for api usage metrics to improve developer portal experience.",
  },
];

// A 5-wide, 6-row grid of "00" filler cells with the 6 real projects
// scattered through it (indices below), evoking a spreadsheet that's mostly
// empty rows with a few filled in — plain grid-auto-flow, so it reflows
// sanely at any column count instead of needing per-breakpoint coordinates.
const GRID_COLUMNS = 5;
const GRID_SIZE = 25;
const PROJECT_AT_INDEX: Record<number, GridProject> = {
  1: GRID_PROJECTS[0],
  3: GRID_PROJECTS[1],
  5: GRID_PROJECTS[2],
  12: GRID_PROJECTS[3],
  15: GRID_PROJECTS[4],
  18: GRID_PROJECTS[5],
};

export default function ProjectsSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-10">
      <div className="w-full flex flex-col lg:flex-row gap-0 px-6 md:px-10 pb-16">
        {/* The grid: mostly decorative "00" cells, with the real projects'
            number + icon standing in for a handful of them. Extra left
            padding here (beyond the section's own) so the grid doesn't sit
            flush against it — it's the widest, busiest thing on the page. */}
        <div
          className="grid flex-1 gap-x-4 gap-y-10 pl-8 md:pl-16 text-sm text-black select-none"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID_SIZE }, (_, i) => {
            const project = PROJECT_AT_INDEX[i];
            if (!project) {
              return (
                <div key={i} aria-hidden="true">
                  00
                </div>
              );
            }
            const size = project.icon.size ?? 56;
            return (
              <Link
                key={i}
                href={`/WORK/${project.id}`}
                // p-2 for a bigger hover/hit target, cancelled by -m-2 so the
                // number still lines up with the padding-less "00" cells.
                className="flex flex-col items-start gap-2 text-black -m-2 p-2 rounded-lg transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              >
                <span className="text-sm">{project.number}</span>
                <div className="w-full flex justify-center">
                  <Image
                    src={project.icon.src}
                    alt={project.icon.alt}
                    width={size}
                    height={size}
                    className="object-contain"
                    style={{ width: size, height: size }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* The list: same 6 projects, described in full — lowercase to match
            the grid's own "00"/number styling rather than the Title Case
            headings each project's own page uses. */}
        <ol className="flex flex-col gap-8 w-full lg:w-[20rem] shrink-0 mt-10 lg:-ml-10 text-sm lowercase">
          {GRID_PROJECTS.map((project, i) => (
            <li key={project.id}>
              <Link
                href={`/WORK/${project.id}`}
                className="flex gap-3 text-left hover:opacity-60"
              >
                <span className="text-black shrink-0">
                  [{String(i + 1).padStart(3, "0")}]
                </span>
                <span>{project.description}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
