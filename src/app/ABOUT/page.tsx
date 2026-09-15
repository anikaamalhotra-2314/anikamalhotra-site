import Image from "next/image";

export default function About() {
  return (
    <div className="relative min-h-[calc(100vh-var(--nav-h,4.75rem)-var(--footer-h,2.5rem))] overflow-hidden flex flex-col md:flex-row items-center justify-center px-6 py-6 md:px-20 lg:px-40 gap-10">
      <div className="flex flex-col gap-4 w-full max-w-md md:max-w-lg lg:w-200">
        <p>I'm an engineer with a love for building beautiful and ethical technologies. I’m currently an Associate Technical Writer at MongoDB, where I build AI workflow tooling to help modernize and optimize the documentation org and craft developer-focused documentation. </p>
        <p>I hold a BA in Computer Science from Barnard College of Columbia University. I’m passionate about building beautiful websites and apps, making space for art & creativity in tech, and learning by doing. </p>
        <p>Previously, I’ve interned as a Software Engineer at NCR and researched the societal impacts of modern digital technologies and the meaning of ethical tech at Computers & Society. </p>
      </div>
      <Image
        className="w-40 h-auto md:w-60 lg:w-[340px]"
        src="/grad-pic.JPG"
        alt="grad-pic"
        width={400}
        height={400}
      />
    </div>
  )
}
