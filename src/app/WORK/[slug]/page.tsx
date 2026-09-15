import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage(props: PageProps<"/WORK/[slug]">) {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) notFound();

  const index = String(project.order).padStart(2, "0");
  const extra = [project.team, project.stack].filter(Boolean).join("  ·  ");

  // Rendered 6 times back to back inside the ticker track (see below,
  // and the .ticker-track comment in globals.css for why 6) — a function
  // rather than a JSX variable so each copy is its own element (a variable
  // would make React reuse/key the very same node in all 6 spots).
  const tickerContent = (key: number) => (
    <span
      key={key}
      aria-hidden={key > 0}
      className="flex items-center gap-12 pr-24 shrink-0"
    >
      <span className="lowercase">{project.title.toLowerCase()}</span>
      {project.role && (
        <span className="lowercase text-black/70">{project.role}</span>
      )}
      {project.time && <span className="text-black/70">{project.time}</span>}
      {extra && (
        <span className="text-xs uppercase tracking-[0.2em] opacity-40">
          {extra}
        </span>
      )}
    </span>
  );

  return (
    <main className="relative min-h-screen pb-16 bg-[#DCFEEB]">
      <div className="flex items-center gap-6 px-6 md:px-10 pt-8">
        <Link
          href="/WORK"
          aria-label="Back to work"
          className="shrink-0 text-xl leading-none hover:opacity-60"
        >
          ←
        </Link>
        {/* overflow-hidden is the mask; the inner track is 6x as wide as it
            needs to be (6 copies of the same content) and slides left by
            exactly 1/6 of its own width on a loop — see .ticker-track. */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex w-max whitespace-nowrap">
            {Array.from({ length: 6 }, (_, i) => tickerContent(i))}
          </div>
        </div>
        <span className="shrink-0">[{index}]</span>
      </div>

      <hr className="mx-6 md:mx-10 mt-6 mb-10 border-black/10" />

      {/* A project with a <Details> block (the collapsible <Section>s) gets
          it as a right-hand column next to <Intro>'s narrative paragraphs;
          a project with only an <Intro> (no expandables yet) just gets that
          one column, full width — has-[[data-details]] is what switches
          between the two without every project needing its own layout.
          mx-auto centers whichever width results in the page. */}
      <div
        data-lightbox-group
        className="mx-auto grid w-full max-w-[90ch] has-[[data-details]]:max-w-5xl grid-cols-1 has-[[data-details]]:md:grid-cols-2 gap-x-12 gap-y-4 px-6 md:px-10"
      >
        {project.body}
      </div>
    </main>
  );
}
