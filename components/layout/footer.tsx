import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/content/navigation";
import { NewsletterForm } from "@/components/homepage/newsletter-form";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";

export async function Footer() {
  const [tNav, tFooter] = await Promise.all([getTranslations("nav"), getTranslations("footer")]);

  return (
    <footer className="border-t border-sand/70 bg-cream">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-4 md:gap-x-10 md:py-20">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.headingKey}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {tFooter(col.headingKey)}
            </h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1.5 text-sm text-charcoal/85 transition-colors hover:text-charcoal"
                  >
                    {tNav(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {tFooter("newsletter")}
          </h3>
          <p className="mb-4 text-sm text-charcoal/85">{tFooter("newsletterBody")}</p>
          <NewsletterForm compact />
        </div>
      </div>

      <div className="border-t border-sand/70">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="inline-block py-1 hover:text-charcoal">
                {tFooter(link.labelKey)}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>EUR €</span>
            <LanguageSwitcher id="language-switcher-footer" className="text-xs" />
            <span>{tFooter("rightsReserved", { year: new Date().getFullYear() })}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
