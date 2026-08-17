import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Materials & Care",
  description: "The leather, hardware and linings we use, and how to care for a Dar Asala bag.",
};

// DEMO CONTENT — sourcing/process claims below (tannery origin, hardware
// casting, thread type) are illustrative and unverified. Confirm against
// your actual suppliers before launch. The equivalent claims used elsewhere
// on the site (origin, workshop locations, leather/process claims) are
// centralized in Store Settings → Business Claims, editable from /admin.
const MATERIALS = [
  {
    title: "Full-Grain Leather",
    copy: "We work almost exclusively in full-grain, vegetable-tanned leather sourced from Moroccan tanneries — the least processed, most durable grade of hide, which develops a deeper patina over years of use.",
  },
  {
    title: "Brass Hardware",
    copy: "Clasps, rings and feet are cast in solid brass or finished in antique brass, hand-fitted by our metalworkers rather than pressed from sheet metal.",
  },
  {
    title: "Cotton-Twill Lining",
    copy: "Interiors are lined in a durable cotton-twill, chosen for structure and to protect the leather from the inside as much as the outside.",
  },
  {
    title: "Waxed Thread",
    copy: "Seams are saddle-stitched by hand using waxed linen thread — two needles, one thread, pulled taut with every pass for a seam that holds even if a single stitch is cut.",
  },
];

const CARE = [
  "Wipe clean with a soft, dry cloth after each use.",
  "Condition the leather every few months with a natural, colorless leather balm.",
  "Avoid prolonged exposure to direct sun, rain and high humidity.",
  "Store stuffed with tissue in the dust bag when not in use, away from direct heat.",
  "Allow a wet bag to air dry naturally — never use direct heat to speed up drying.",
];

export default function MaterialsPage() {
  return (
    <div>
      <PageHeader
        title="Materials & Care"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Our Story", href: "/about" }, { label: "Materials" }]}
      />

      <div className="container-page grid gap-16 pb-16 md:grid-cols-2 md:gap-20 md:pb-24">
        <div>
          <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">What we use</h2>
          <div className="mt-6 space-y-6">
            {MATERIALS.map((m) => (
              <div key={m.title}>
                <h3 className="font-medium text-charcoal">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/80">{m.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">Care Guide</h2>
          <ol className="mt-6 space-y-3">
            {CARE.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-charcoal/80">
                <span className="font-serif-display text-camel">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
