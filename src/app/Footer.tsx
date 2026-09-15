import FooterMeasure from "./FooterMeasure";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const now = new Date();
  const lastUpdated = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const year = now.getFullYear();

  return (
    <FooterMeasure className="w-full bg-black px-6 md:px-20 py-6 text-sm md:text-base text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <span>© {year} Anika Malhotra</span>
        <FooterLinks />
        <span>last updated {lastUpdated}</span>
      </div>
    </FooterMeasure>
  );
}
