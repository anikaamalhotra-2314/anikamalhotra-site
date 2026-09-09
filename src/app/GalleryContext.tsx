"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type GalleryImage = { src: string; alt: string };
type GalleryState = { images: GalleryImage[]; index: number } | null;

type GalleryContextValue = {
  openFrom: (el: HTMLElement) => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

// How long the fade takes, shared between the overlay's CSS transition and
// the JS delay before the closing overlay actually unmounts.
const FADE_MS = 200;

// One lightbox for the whole app, rather than one per image. Clicking a
// screenshot finds its siblings in the DOM (everything sharing the nearest
// [data-lightbox-group] ancestor) so arrow keys can step through the rest of
// that project's images, then hands the resulting list to a single overlay.
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GalleryState>(null);
  const [closing, setClosing] = useState(false);

  const openFrom = useCallback((el: HTMLElement) => {
    const group = el.closest("[data-lightbox-group]") ?? document.body;
    const items = Array.from(
      group.querySelectorAll<HTMLElement>("[data-lightbox-src]")
    );
    const images = items.map((item) => ({
      src: item.dataset.lightboxSrc!,
      alt: item.dataset.lightboxAlt ?? "",
    }));
    const index = items.indexOf(el);
    if (index === -1) return;
    setClosing(false);
    setState({ images, index });
  }, []);

  // Fade out first, then unmount once the transition has actually finished —
  // otherwise the overlay would just vanish instantly on close.
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setState(null);
      setClosing(false);
    }, FADE_MS);
  }, []);

  const step = useCallback((delta: number) => {
    setState((s) =>
      s
        ? { ...s, index: (s.index + delta + s.images.length) % s.images.length }
        : s
    );
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [state, close, step]);

  return (
    <GalleryContext.Provider value={{ openFrom }}>
      {children}
      {state && (
        <Lightbox
          images={state.images}
          index={state.index}
          closing={closing}
          onClose={close}
          onStep={step}
        />
      )}
    </GalleryContext.Provider>
  );
}

function Lightbox({
  images,
  index,
  closing,
  onClose,
  onStep,
}: {
  images: GalleryImage[];
  index: number;
  closing: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const current = images[index];
  const hasMultiple = images.length > 1;

  // Starts transparent, then flips to opaque a tick after mount so the
  // opacity change is a transition rather than an instant jump.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const shown = visible && !closing;

  return (
    <div
      onClick={onClose}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`fixed inset-0 z-80 flex flex-col items-center justify-center gap-4 bg-black/85 p-6
        cursor-zoom-out transition-opacity ease-out ${shown ? "opacity-100" : "opacity-0"}`}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-5 right-5 text-3xl leading-none text-white/80 hover:text-white cursor-pointer"
      >
        ×
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStep(-1);
          }}
          aria-label="Previous image"
          className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 text-4xl text-white/70 hover:text-white cursor-pointer"
        >
          ‹
        </button>
      )}

      {/* Plain <img>, not next/image: the lightbox needs the picture's own
          aspect ratio, which varies per screenshot, so there's no sane fixed
          width/height (or fill parent) to hand next/image here. Keying by
          src restarts the fade-in animation each time the image changes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current.src}
        src={current.src}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] cursor-default rounded object-contain animate-[lightbox-fade-in_200ms_ease-out]"
      />

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStep(1);
          }}
          aria-label="Next image"
          className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 text-4xl text-white/70 hover:text-white cursor-pointer"
        >
          ›
        </button>
      )}

      {hasMultiple && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-white/70"
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export function useGalleryOpen() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("useGalleryOpen must be used within a GalleryProvider");
  }
  return ctx.openFrom;
}
