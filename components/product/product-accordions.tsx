"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { ARTISAN_PROCESS_CLAIM, BRAND_ORIGIN_COUNTRY } from "@/lib/content/business-claims";
import { productDimensionsText } from "@/lib/content/product-details";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { formatPrice } from "@/lib/utils/format";
import type { ProductDetailDTO } from "@/lib/commerce/types";

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

export function ProductAccordions({ product }: { product: ProductDetailDTO }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="description" className="mt-10">
      <Item value="description" title="Description">
        <p>{product.description}</p>
      </Item>
      <Item value="craftsmanship" title="Craftsmanship">
        <p>
          {ARTISAN_PROCESS_CLAIM.charAt(0).toUpperCase() + ARTISAN_PROCESS_CLAIM.slice(1)} in a small
          workshop in {BRAND_ORIGIN_COUNTRY} — from raw hide to the burnished edge of the final piece.
        </p>
      </Item>
      <Item value="materials" title="Materials">
        <p>{product.materials}</p>
      </Item>
      <Item value="dimensions" title="Dimensions">
        <p>{productDimensionsText(product)}. Measurements are approximate, as expected with handmade pieces.</p>
      </Item>
      <Item value="care" title="Care">
        <p>{product.careInstructions}</p>
      </Item>
      <Item value="shipping" title="Shipping & Returns">
        <p>
          Free shipping within the EU on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.{" "}
          {product.productionTime}. Returns accepted within 14 days of delivery on unused, unworn
          items. See our Shipping and Returns pages for full details.
        </p>
      </Item>
    </Accordion.Root>
  );
}
