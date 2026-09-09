import Image from "next/image";
import Art from "@/content/art.mdx";

export default function ArtPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-10 pb-16">
      <Image
        className="absolute top-1/8 left-1/50 -z-10 -rotate-20 star-a w-13 md:w-24 h-auto"
        src="/red_stars-removebg-preview.png"
        alt="red stars"
        width={120}
        height={120}
      />
      <Image
        className="absolute bottom-6 right-6 md:right-16 -z-10 rotate-45 star-c w-10 md:w-16 h-auto"
        src="/stars-removebg-preview.png"
        alt="stars"
        width={80}
        height={80}
      />
      <div className="flex flex-col gap-4 mx-60 md:px-20 [&_h2]:mt-8 [&_h2:first-child]:mt-0">
        <Art />
      </div>
    </main>
  );
}
