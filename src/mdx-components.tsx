import type { MDXComponents } from "mdx/types";
import { ImageProps } from "next/image";
import ExpandableImage from "./app/ExpandableImage";

// Global styling for markdown rendered from .mdx files. Editing these classes
// restyles every project panel at once — no need to touch the content files.
const components: MDXComponents = {
  h2: ({ children }) => <h2 className="text-xl">{children}</h2>,
  // Subheads sat at text-lg in the same weight and colour as body copy, so they
  // read as another paragraph rather than a break. Smaller, tracked-out, and
  // uppercase gives them contrast without adding visual weight — and matches
  // the uppercase treatment in the nav and project titles.
  h3: ({ children }) => (
    <h3 className="pt-2 text-sm uppercase tracking-[0.2em] opacity-50">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-base leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 flex flex-col gap-1">{children}</ul>
  ),
  a: ({ children, ...props }) => (
    <a className="underline" target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  ),
  // next/image needs intrinsic dimensions to reserve layout space, but a
  // markdown ![]() has no way to pass them. `fill` sidesteps that by having
  // the image size itself to a positioned parent instead. ExpandableImage
  // also makes every project screenshot click-to-enlarge.
  img: (props) => <ExpandableImage {...(props as ImageProps)} />,
  // Collapsible section: <Section title="..."> in any .mdx file, plus `open` to
  // start expanded. Built on <details>, so it needs no JS and the browser opens
  // a collapsed section when you find-in-page.
  //
  // Note: styling has to live on a capitalized component like this one. Writing
  // <details> directly in .mdx bypasses this map and renders unstyled.
  Section: ({
    title,
    open,
    children,
  }: {
    title: string;
    open?: boolean;
    children?: React.ReactNode;
  }) => (
    <details open={open} className="group border-b border-black/10 pb-3">
      {/* `flex` is what hides the native disclosure triangle: it stops the
          summary being a list-item, so there's no ::marker to suppress. */}
      <summary className="flex cursor-pointer list-none items-center gap-2 py-2 text-xl italic hover:opacity-60">
        <span className="transition-transform group-open:rotate-90">›</span>
        {title}
      </summary>
      <div className="flex flex-col gap-4 pt-2">{children}</div>
    </details>
  ),
  // Layout markers, not visual components: <Intro> holds the plain narrative
  // paragraphs, <Details> holds the collapsible <Section>s. The project page
  // (src/app/WORK/[slug]/page.tsx) lays these two out as side-by-side columns
  // via a CSS `:has()` selector keyed on Details' data-details attribute, so
  // a project with no <Details> block (most of them, today) just renders its
  // intro full-width instead of leaving an empty second column.
  Intro: ({ children }: { children?: React.ReactNode }) => (
    <div className="flex flex-col gap-4">{children}</div>
  ),
  Details: ({ children }: { children?: React.ReactNode }) => (
    <div data-details className="flex flex-col gap-3">
      {children}
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
