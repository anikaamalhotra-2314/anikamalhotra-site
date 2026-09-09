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
  // Metadata block that opens a project panel: <Meta role="..." time="..." />.
  // Pass only the fields a project has — each one is optional, and they render
  // in the fixed order below so every panel opens the same way.
  Meta: ({
    role,
    team,
    stack,
    time,
  }: {
    role?: string;
    team?: string;
    stack?: string;
    time?: string;
  }) => {
    const rows = [
      ["Role", role],
      ["Team", team],
      ["Stack", stack],
      ["Time", time],
    ].filter(([, value]) => value) as [string, string][];

    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-lg border border-black/10 px-5 py-4 mb-6">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-sm uppercase tracking-[0.2em] opacity-50">
              {label}
            </dt>
            <dd className="text-base">{value}</dd>
          </div>
        ))}
      </dl>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
