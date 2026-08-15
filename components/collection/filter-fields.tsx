"use client";

import { colorLabel, sizeLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const COLORS = ["COGNAC", "DARK_BROWN", "BLACK", "OLIVE", "NATURAL"];
const SIZES = ["MINI", "MEDIUM", "LARGE"];

export type FilterState = {
  color: string[];
  size: string[];
  minPrice: string;
  maxPrice: string;
};

export function FilterFields({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  function toggle(key: "color" | "size", item: string) {
    const set = new Set(value[key]);
    if (set.has(item)) set.delete(item);
    else set.add(item);
    onChange({ ...value, [key]: Array.from(set) });
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Color</legend>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggle("color", c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                value.color.includes(c)
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-sand text-charcoal hover:border-charcoal"
              )}
            >
              {colorLabel(c)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Size</legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle("size", s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                value.size.includes(s)
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-sand text-charcoal hover:border-charcoal"
              )}
            >
              {sizeLabel(s)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Price (EUR)
        </legend>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={value.minPrice}
            onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            className="w-full min-w-0 border-b border-sand bg-transparent px-1 py-1.5 text-sm focus:border-charcoal focus:outline-none"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={value.maxPrice}
            onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            className="w-full min-w-0 border-b border-sand bg-transparent px-1 py-1.5 text-sm focus:border-charcoal focus:outline-none"
          />
        </div>
      </fieldset>
    </div>
  );
}

export const EMPTY_FILTERS: FilterState = { color: [], size: [], minPrice: "", maxPrice: "" };
