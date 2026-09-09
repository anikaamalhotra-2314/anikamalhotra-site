"use client";

import Image, { ImageProps } from "next/image";
import { useGalleryOpen } from "./GalleryContext";

// A project screenshot that opens the shared lightbox (see GalleryContext)
// instead of managing its own modal, so images in the same project can be
// browsed with prev/next instead of each acting like an isolated popup.
export default function ExpandableImage(props: ImageProps) {
  const openFrom = useGalleryOpen();
  const src = typeof props.src === "string" ? props.src : "";
  const alt = typeof props.alt === "string" ? props.alt : "";

  return (
    <span className="project-image group relative block w-full aspect-video overflow-hidden rounded-lg">
      <Image
        fill
        sizes="(min-width: 768px) 700px, 100vw"
        className="object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
        data-lightbox-src={src}
        data-lightbox-alt={alt}
        onClick={(e) => openFrom(e.currentTarget)}
        {...props}
      />
      {/* Hint only surfaces on hover, so the gallery reads clean at rest. */}
      <span
        className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full
          bg-black/60 px-3 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity
          duration-200 group-hover:opacity-100"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        click to expand
      </span>
    </span>
  );
}
