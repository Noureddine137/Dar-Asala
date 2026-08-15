"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FAQ_SECTIONS } from "@/lib/content/faq";

export function FaqAccordion() {
  return (
    <div className="space-y-12">
      {FAQ_SECTIONS.map((section) => (
        <div key={section.heading}>
          <h2 className="mb-2 font-serif-display text-2xl text-charcoal">{section.heading}</h2>
          <Accordion.Root type="single" collapsible>
            {section.items.map((item, i) => (
              <Accordion.Item key={i} value={`${section.heading}-${i}`} className="border-b border-sand/70">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-sm font-medium text-charcoal">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 text-sm leading-relaxed text-charcoal/80 data-[state=open]:animate-fade-in">
                  {item.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      ))}
    </div>
  );
}
