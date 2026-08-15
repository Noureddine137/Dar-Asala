"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterFields, EMPTY_FILTERS, type FilterState } from "./filter-fields";

function readFilters(searchParams: URLSearchParams): FilterState {
  return {
    color: searchParams.getAll("color"),
    size: searchParams.getAll("size"),
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  };
}

function buildQuery(searchParams: URLSearchParams, filters: FilterState) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("color");
  params.delete("size");
  params.delete("minPrice");
  params.delete("maxPrice");
  filters.color.forEach((c) => params.append("color", c));
  filters.size.forEach((s) => params.append("size", s));
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  return params.toString();
}

function useFilterController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = readFilters(searchParams);
  const activeCount = active.color.length + active.size.length + (active.minPrice ? 1 : 0) + (active.maxPrice ? 1 : 0);
  const [draft, setDraft] = useState<FilterState>(active);

  function apply() {
    router.push(`${pathname}?${buildQuery(searchParams, draft)}`, { scroll: false });
  }

  function clearAll() {
    setDraft(EMPTY_FILTERS);
    router.push(`${pathname}?${buildQuery(searchParams, EMPTY_FILTERS)}`, { scroll: false });
  }

  function resync() {
    setDraft(readFilters(searchParams));
  }

  return { draft, setDraft, apply, clearAll, resync, activeCount };
}

export function CollectionFilterSidebar() {
  const { draft, setDraft, apply, clearAll, activeCount } = useFilterController();

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <FilterFields value={draft} onChange={setDraft} />
      <div className="mt-8 flex flex-col gap-2">
        <Button size="sm" onClick={apply}>
          Apply Filters
        </Button>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-left text-xs text-muted underline">
            Clear all
          </button>
        )}
      </div>
    </aside>
  );
}

export function CollectionFilterTrigger() {
  const { draft, setDraft, apply, clearAll, resync, activeCount } = useFilterController();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Dialog.Root
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) resync();
        }}
      >
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-sm border border-sand px-4 py-2 text-sm text-charcoal"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeCount > 0 && <span className="text-xs text-muted">({activeCount})</span>}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-lg bg-ivory p-6 focus:outline-none data-[state=open]:animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="font-serif-display text-xl text-charcoal">Filter</Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close filters" className="text-charcoal">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">Filter products by color, size and price</Dialog.Description>
            <FilterFields value={draft} onChange={setDraft} />
            <div className="mt-8 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  clearAll();
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  apply();
                  setOpen(false);
                }}
              >
                Show Results
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
