"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { JOB_TYPES, BOARDS, SOURCES, RELEVANCE_TIERS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "relevance", label: "Relevance" },
] as const;

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTypes = searchParams.get("type")?.split(",").filter(Boolean) || [];
  const activeBoards = searchParams.get("board")?.split(",").filter(Boolean) || [];
  const activeSources = searchParams.get("source")?.split(",").filter(Boolean) || [];
  const activeRelevances = searchParams.get("relevance")?.split(",").filter(Boolean) || [];
  const activeSort = searchParams.get("sort") || "newest";

  const toggleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const idx = current.indexOf(value);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(value);
      }
      if (current.length > 0) {
        params.set(key, current.join(","));
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "newest") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const hasActiveFilters =
    activeTypes.length > 0 ||
    activeBoards.length > 0 ||
    activeSources.length > 0 ||
    activeRelevances.length > 0 ||
    searchParams.get("q");

  return (
    <div className="space-y-4">
      {/* Sort + Clear row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted">Sort:</label>
          <select
            value={activeSort}
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
        {hasActiveFilters && (
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter groups */}
      <FilterGroup
        label="Job Type"
        items={JOB_TYPES as unknown as string[]}
        activeItems={activeTypes}
        filterKey="type"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Board"
        items={BOARDS as unknown as string[]}
        activeItems={activeBoards}
        filterKey="board"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Relevance"
        items={RELEVANCE_TIERS as unknown as string[]}
        activeItems={activeRelevances}
        filterKey="relevance"
        onToggle={toggleFilter}
      />
      <FilterGroup
        label="Source"
        items={SOURCES as unknown as string[]}
        activeItems={activeSources}
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
  filterKey: string;
  onToggle: (key: string, value: string) => void;
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
