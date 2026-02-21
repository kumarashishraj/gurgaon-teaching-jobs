"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { JOB_TYPES, BOARDS, SOURCES, RELEVANCE_TIERS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "relevance", label: "Relevance" },
] as const;

type FilterState = {
  type: string[];
  board: string[];
  source: string[];
  relevance: string[];
  sort: string;
};

function parseFiltersFromParams(searchParams: URLSearchParams): FilterState {
  return {
    type: searchParams.get("type")?.split(",").filter(Boolean) || [],
    board: searchParams.get("board")?.split(",").filter(Boolean) || [],
    source: searchParams.get("source")?.split(",").filter(Boolean) || [],
    relevance: searchParams.get("relevance")?.split(",").filter(Boolean) || [],
    sort: searchParams.get("sort") || "newest",
  };
}

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appliedFilters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);
  const [draft, setDraft] = useState<FilterState>(appliedFilters);

  // Sync draft when URL changes externally (e.g. back/forward navigation)
  const appliedKey = JSON.stringify(appliedFilters);
  const [lastAppliedKey, setLastAppliedKey] = useState(appliedKey);
  if (appliedKey !== lastAppliedKey) {
    setDraft(appliedFilters);
    setLastAppliedKey(appliedKey);
  }

  const toggleFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setDraft((prev) => {
        const current = prev[key] as string[];
        const idx = current.indexOf(value);
        const next = idx >= 0
          ? current.filter((_, i) => i !== idx)
          : [...current, value];
        return { ...prev, [key]: next };
      });
    },
    []
  );

  const setSort = useCallback((value: string) => {
    setDraft((prev) => ({ ...prev, sort: value }));
  }, []);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Set filter params
    for (const key of ["type", "board", "source", "relevance"] as const) {
      if (draft[key].length > 0) {
        params.set(key, draft[key].join(","));
      } else {
        params.delete(key);
      }
    }

    // Set sort
    if (draft.sort && draft.sort !== "newest") {
      params.set("sort", draft.sort);
    } else {
      params.delete("sort");
    }

    params.delete("page");
    router.push(`/?${params.toString()}`);
  }, [router, searchParams, draft]);

  const clearAll = useCallback(() => {
    setDraft({ type: [], board: [], source: [], relevance: [], sort: "newest" });
    router.push("/");
  }, [router]);

  // Check if draft differs from applied (to show Apply button)
  const isDirty = JSON.stringify(draft) !== JSON.stringify(appliedFilters);

  const hasActiveFilters =
    draft.type.length > 0 ||
    draft.board.length > 0 ||
    draft.source.length > 0 ||
    draft.relevance.length > 0 ||
    searchParams.get("q");

  return (
    <div className="space-y-4">
      {/* Sort + Clear row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted">Sort:</label>
          <select
            value={draft.sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border rounded-lg px-3 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-sm text-muted hover:text-foreground font-medium transition-colors"
            >
              Clear all
            </button>
          )}
          {isDirty && (
            <button
              onClick={applyFilters}
              className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter groups */}
      <FilterGroup
        label="Job Type"
        items={JOB_TYPES as unknown as string[]}
        activeItems={draft.type}
        filterKey="type"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Board"
        items={BOARDS as unknown as string[]}
        activeItems={draft.board}
        filterKey="board"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Relevance"
        items={RELEVANCE_TIERS as unknown as string[]}
        activeItems={draft.relevance}
        filterKey="relevance"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Source"
        items={SOURCES as unknown as string[]}
        activeItems={draft.source}
        filterKey="source"
        onToggle={toggleFilter}
      />
    </div>
  );
}

function FilterGroup({
  label,
  items,
  activeItems,
  filterKey,
  onToggle,
}: {
  label: string;
  items: string[];
  activeItems: string[];
  filterKey: keyof FilterState;
  onToggle: (key: keyof FilterState, value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted w-16 shrink-0">
        {label}:
      </span>
      {items.map((item) => {
        const isActive = activeItems.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(filterKey, item)}
            className={`pill-toggle inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
              isActive
                ? "active border-primary"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
          >
            {item}
            {isActive && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
