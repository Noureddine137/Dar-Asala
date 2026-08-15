import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/content/navigation";
import { NewsletterForm } from "@/components/homepage/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-sand/70 bg-cream">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:gap-x-10 md:py-20">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{col.heading}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-charcoal/85 transition-colors hover:text-charcoal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Newsletter</h3>
          <p className="mb-4 text-sm text-charcoal/85">New pieces, artisan stories and private releases.</p>
          <NewsletterForm compact />
        </div>
      </div>

      <div className="border-t border-sand/70">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-charcoal">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>EUR €</span>
            <span>English</span>
            <span>&copy; {new Date().getFullYear()} Dar Asala. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
