"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg hover:bg-card transition"
        >
          Previous
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              p === currentPage
                ? "bg-primary text-white border-primary"
                : "text-muted hover:text-foreground border-border hover:bg-card"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg hover:bg-card transition"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
