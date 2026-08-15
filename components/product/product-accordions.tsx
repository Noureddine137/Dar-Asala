"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
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
          Hand-cut, hand-stitched and hand-finished by a single artisan in a small Moroccan workshop —
          from raw hide to the burnished edge of the final piece.
        </p>
      </Item>
      <Item value="materials" title="Materials">
        <p>{product.materials}</p>
      </Item>
      <Item value="dimensions" title="Dimensions">
        <p>Approximate dimensions vary by size selection. Full measurements are noted on the packing slip and available on request via our Contact page.</p>
      </Item>
      <Item value="care" title="Care">
        <p>{product.careInstructions}</p>
      </Item>
      <Item value="shipping" title="Shipping & Returns">
        <p>
          Free shipping within the EU on orders over €250. Made-to-order pieces ship in 7–14 business
          days; in-stock pieces ship in 1–3 business days. Returns accepted within 14 days of delivery
          on unused, unworn items. See our Shipping and Returns pages for full details.
        </p>
      </Item>
    </Accordion.Root>
  );
}
