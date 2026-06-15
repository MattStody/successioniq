"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type SortOption =
  | "match"
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "revenue_desc"
  | "ebitda_desc"
  | "profit_desc"
  | "margin_desc";

const SORT_LABELS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "revenue_desc", label: "Revenue: high to low" },
  { value: "ebitda_desc", label: "EBITDA: high to low" },
  { value: "profit_desc", label: "Profit: high to low" },
  { value: "margin_desc", label: "Margin: high to low" },
];

export default function ListingsFilterBar({
  regions,
  hasMatches,
}: {
  regions: string[];
  hasMatches: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for the debounced search box so typing stays snappy.
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const firstRender = useRef(true);

  // Keep the input in sync if the URL changes from elsewhere (e.g. Clear).
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Debounce search updates into the URL.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const handle = setTimeout(() => {
      if ((searchParams.get("q") ?? "") !== search) {
        updateParams({ q: search || null });
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [search, searchParams, updateParams]);

  const region = searchParams.get("region") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minRevenue = searchParams.get("minRevenue") ?? "";
  const sort = (searchParams.get("sort") as SortOption | null) ?? "";

  const activeFilterCount = [
    searchParams.get("q"),
    searchParams.get("industry") &&
    searchParams.get("industry") !== "All Industries"
      ? searchParams.get("industry")
      : null,
    region || null,
    minPrice || null,
    maxPrice || null,
    minRevenue || null,
  ].filter(Boolean).length;

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Search row */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, industry, region, or keyword…"
            className={`${inputClass} pl-9`}
            aria-label="Search listings"
          />
        </div>
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => updateParams({ region: e.target.value || null })}
            className={inputClass}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Min price
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value || null })}
            placeholder="$0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Max price
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
            placeholder="Any"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Min revenue
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            value={minRevenue}
            onChange={(e) =>
              updateParams({ minRevenue: e.target.value || null })
            }
            placeholder="$0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value || null })}
            className={inputClass}
          >
            {hasMatches && <option value="">Best match</option>}
            {!hasMatches && <option value="">Newest first</option>}
            {SORT_LABELS.filter(
              (o) => !(o.value === "newest" && !hasMatches)
            ).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {activeFilterCount} active filter
            {activeFilterCount !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={() =>
              router.push(pathname, { scroll: false })
            }
            className="text-xs font-medium text-blue-700 hover:text-blue-900"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
