"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { JOB_TYPES, BOARDS, SOURCES } from "@/lib/constants";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";
  const activeBoard = searchParams.get("board") || "";
  const activeSource = searchParams.get("source") || "";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Job Type
        </label>
        <select
          value={activeType}
          onChange={(e) => setFilter("type", e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Board
        </label>
        <select
          value={activeBoard}
          onChange={(e) => setFilter("board", e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Boards</option>
          {BOARDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Source
        </label>
        <select
          value={activeSource}
          onChange={(e) => setFilter("source", e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {(activeType || activeBoard || activeSource || searchParams.get("q")) && (
        <div className="flex items-end">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:text-primary-dark font-medium px-3 py-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
