"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { productDimensionsText } from "@/lib/content/product-details";
import { formatPrice } from "@/lib/utils/format";
import type { ProductDetailDTO } from "@/lib/commerce/types";
import type { Locale } from "@/i18n/routing";

function Item({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <Accordion.Item value={value} className="border-b border-sand/70">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-sm font-medium text-charcoal">
          {title}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden pb-4 text-sm leading-relaxed text-charcoal/80 data-[state=open]:animate-fade-in">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}

type Props = {
  product: ProductDetailDTO;
  originCountry: string;
  artisanProcessClaim: string;
  freeShippingThreshold: number;
};

export function ProductAccordions({ product, originCountry, artisanProcessClaim, freeShippingThreshold }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const claim = artisanProcessClaim.charAt(0).toUpperCase() + artisanProcessClaim.slice(1);

  return (
    <Accordion.Root type="single" collapsible defaultValue="description" className="mt-10">
      <Item value="description" title={t("description")}>
        <p>{product.description}</p>
      </Item>
      <Item value="craftsmanship" title={t("craftsmanship")}>
        <p>{t("craftsmanshipBody", { claim, country: originCountry })}</p>
      </Item>
      <Item value="materials" title={t("materials")}>
        <p>{product.materials}</p>
      </Item>
      <Item value="dimensions" title={t("dimensions")}>
        <p>
          {productDimensionsText(product, locale)}. {t("dimensionsNote")}
        </p>
      </Item>
      <Item value="care" title={t("care")}>
        <p>{product.careInstructions}</p>
      </Item>
      <Item value="shipping" title={t("shippingReturns")}>
        <p>
          {t("shippingReturnsBody", {
            threshold: formatPrice(freeShippingThreshold, product.currency, locale),
            productionTime: product.productionTime,
          })}
        </p>
      </Item>
    </Accordion.Root>
  );
}
