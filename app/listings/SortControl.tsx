"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SortOption, SORT_LABELS } from "./ListingsFilterBar";

/**
 * Standalone "Sort by" dropdown shown at the top of the results column. Writes
 * the `sort` param into the URL (preserving every other filter) so the server
 * page re-sorts. The empty default means "best match" for buyers with matches,
 * otherwise "newest first".
 */
export default function SortControl({ hasMatches }: { hasMatches: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as SortOption | null) ?? "";

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="listings-sort"
        className="whitespace-nowrap text-sm font-medium text-slate-500"
      >
        Sort by
      </label>
      <select
        id="listings-sort"
        value={sort}
        onChange={(e) => update(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">{hasMatches ? "Best match" : "Newest first"}</option>
        {SORT_LABELS.filter((o) => !(o.value === "newest" && !hasMatches)).map(
          (o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}
