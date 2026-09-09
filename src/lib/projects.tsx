import fs from "fs";
import path from "path";
import type { ReactNode } from "react";

export type LoadedProject = {
  slug: string;
  title: string;
  order: number;
  body: ReactNode;
};

const dir = path.join(process.cwd(), "src/content/projects");

// Reads every .mdx file in src/content/projects at build time. Add a project by
// dropping a new .mdx file in that folder — no code changes needed here.
export async function getProjects(): Promise<LoadedProject[]> {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const mod = await import(`../content/projects/${slug}.mdx`);
      const Body = mod.default;
      const metadata = (mod.metadata ?? {}) as {
        title?: string;
        order?: number;
      };
      return {
        slug,
        title: metadata.title ?? slug,
        order: metadata.order ?? 999,
        body: <Body />,
      };
    })
  );

  return projects.sort((a, b) => a.order - b.order);
}
