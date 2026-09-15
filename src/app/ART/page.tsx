import Image from "next/image";
import Art from "@/content/art.mdx";

export default function ArtPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-10 pb-16">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-6 md:px-12 lg:px-20">
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            className="w-64 md:w-80 lg:w-full max-w-md h-auto rounded-lg shadow-lg"
            src="/girl-3.jpg"
            alt="girl"
            width={2942}
            height={3226}
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4 [&_h2]:mt-8 [&_h2:first-child]:mt-0">
          <Art />
        </div>
      </div>
    </main>
  );
}
