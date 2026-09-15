"use client";

import Image from "next/image";
import WordDoc from "./WordDoc";
import PhotoBooth from "./PhotoBooth";
import ClockWidget from "./ClockWidget";
import Draggable from "./Draggable";

// Desktop is a scattered mood-board: every piece absolutely positioned by
// percentage over the section, matching a reference layout, and each piece
// individually click-and-drag repositionable (see Draggable.tsx) — moving
// one is a per-visitor, in-memory rearrangement, not saved anywhere.
// Percentages (not fixed px) so the base arrangement scales with viewport
// instead of breaking at anything other than the exact size it was measured
// from. Mobile drops all of that and just stacks everything in flow order —
// absolute positioning tuned for a wide desktop canvas has nowhere sane to
// go on a narrow phone screen.
export default function Home() {
  return (
    <section
      id="HOME"
      className="relative min-h-[calc(100vh-var(--nav-h,4.75rem))] flex flex-col items-center gap-10 px-6 py-10 md:block md:px-0 md:py-0 scroll-mt-24"
    >
      <Draggable className="w-full max-w-md md:absolute md:top-0 md:left-[8%] md:w-[33%] md:max-w-none">
        {(handle) => <WordDoc titleBarProps={handle} />}
      </Draggable>

      <Draggable className="-mt-12 md:mt-0 md:absolute md:top-[22%] md:left-[43%] md:w-[8%]">
        {(handle) => (
          <Image
            {...handle}
            className="w-36 h-auto md:w-full"
            src="/personal-site-pic.jpeg"
            alt="image of anika malhotra"
            width={514}
            height={1260}
          />
        )}
      </Draggable>

      <Draggable className="md:absolute md:top-[6%] md:left-[68%] md:w-[18%]">
        {(handle) => (
          <Image
            {...handle}
            className="w-56 h-auto md:w-full"
            src="/IMG_0355.JPG"
            alt="screenprinted girl"
            width={3373}
            height={1964}
          />
        )}
      </Draggable>

      <Draggable className="-mt-12 md:mt-0 md:absolute md:top-[15%] md:left-[56%] md:w-[15%]">
        {(handle) => (
          <Image
            {...handle}
            className="w-24 h-auto md:w-full opacity-50"
            src="/girl-2.JPG"
            alt="screenprinted girl"
            width={800}
            height={500}
          />
        )}
      </Draggable>

      <Draggable className="w-full max-w-xs aspect-[6/5] md:absolute md:top-[54%] md:left-[17%] md:w-[22%] md:max-w-none">
        {(handle) => <PhotoBooth titleBarProps={handle} />}
      </Draggable>

      <Draggable className="w-40 aspect-square -mt-12 md:mt-0 md:absolute md:top-[53%] md:left-[71%] md:w-[15%] md:max-w-none">
        {(handle) => <ClockWidget titleBarProps={handle} />}
      </Draggable>
    </section>
  );
}
