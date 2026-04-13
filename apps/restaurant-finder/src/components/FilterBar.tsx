import { Button } from '@heroui/react';

import { ActiveFilters, FilterOptions } from '../types/restaurant';

type FilterBarProps = {
  filters: ActiveFilters;
  options: FilterOptions;
  onChange: (filters: ActiveFilters) => void;
};

export const FilterBar = ({ filters, options, onChange }: FilterBarProps) => {
  return (
    <div className="rounded-[2rem] border border-sky-100 bg-[linear-gradient(180deg,#fbfdff,#f3f8ff)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700/80">
            Refine results
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Narrow the list with cleaner filters for cuisine and price range. The controls are
            intentionally larger here so they are easier to scan and use.
          </p>
        </div>

        <Button
          className="self-start"
          radius="full"
          size="sm"
          variant="flat"
          onPress={() =>
            onChange({
              cuisine: '',
              priceRange: '',
            })
          }
        >
          Reset filters
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Cuisine</span>
          <select
            aria-label="Cuisine filter"
            className="h-16 w-full rounded-[1.35rem] border border-sky-100 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            value={filters.cuisine}
            onChange={(event) =>
              onChange({
                ...filters,
                cuisine: event.target.value,
              })
            }
          >
            <option value="">All cuisines</option>
            {options.cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Price range</span>
          <select
            aria-label="Price range filter"
            className="h-16 w-full rounded-[1.35rem] border border-sky-100 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            value={filters.priceRange}
            onChange={(event) =>
              onChange({
                ...filters,
                priceRange: event.target.value,
              })
            }
          >
            <option value="">All price ranges</option>
            {options.priceRanges.map((priceRange) => (
              <option key={priceRange} value={priceRange}>
                {priceRange}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
