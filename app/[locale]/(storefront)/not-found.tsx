import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";

export default async function StorefrontNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container-page flex flex-col items-center gap-4 py-32 text-center">
      <p className="font-serif-display text-7xl text-camel">404</p>
      <h1 className="font-serif-display text-2xl text-charcoal">{t("title")}</h1>
      <p className="max-w-sm text-sm text-muted">{t("body")}</p>
      <ButtonLink href="/" className="mt-2">
        {t("backHome")}
      </ButtonLink>
    </div>
  );
}
