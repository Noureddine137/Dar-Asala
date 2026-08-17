import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";

export default async function CheckoutCancelPage() {
  const t = await getTranslations("checkout");

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-serif-display text-3xl text-charcoal">{t("orderCancelledTitle")}</h1>
      <p className="max-w-md text-sm text-muted">{t("orderCancelledBody")}</p>
      <ButtonLink href="/cart" className="mt-2">
        {t("backToBag")}
      </ButtonLink>
    </div>
  );
}
