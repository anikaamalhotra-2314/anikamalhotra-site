import { execSync } from "child_process";
import FooterMeasure from "./FooterMeasure";

function getLastUpdated(): string {
  try {
    const iso = execSync("git log -1 --format=%cI").toString().trim();
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export default function Footer() {
  const lastUpdated = getLastUpdated();

  return (
    <FooterMeasure className="w-full px-6 md:px-20 py-4 text-xs md:text-sm text-right opacity-60">
      made with &lt;3 by Anika Malhotra · last updated {lastUpdated}
    </FooterMeasure>
  );
}
