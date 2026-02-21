import Link from "next/link";
import Badge from "./Badge";
import type { Job } from "@/lib/schema";

function getAccentClass(relevance: string | null): string {
  switch (relevance) {
    case "Hot":
      return "accent-hot card-hot-bg";
    case "Top School":
      return "accent-top-school card-top-school-bg";
    case "New":
      return "accent-new";
    case "Featured":
      return "accent-featured";
    default:
      return "";
  }
}

export default function JobCard({ job }: { job: Job }) {
  const postedAgo = job.postedDate
    ? formatRelativeDate(job.postedDate)
    : "Recently";

  const accentClass = getAccentClass(job.relevance);

  return (
    <div
      className={`bg-card border border-border rounded-xl p-6 card-hover ${accentClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/jobs/${job.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            {job.relevance && <Badge text={job.relevance} variant={job.relevance} />}
          </div>
          <p className="text-muted mt-1.5 text-sm">{job.schoolName}</p>
        </div>
        <Badge text={job.jobType} variant={job.jobType} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        {job.salaryInfo && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salaryInfo}
          </span>
        )}
        {job.board && <Badge text={job.board} variant="board" />}
        <Badge text={job.source} variant="source" />
      </div>

      {(job.contactPhone || job.contactEmail) && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {job.contactPhone && (
            <a
              href={`tel:${job.contactPhone}`}
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {job.contactPhone}
            </a>
          )}
          {job.contactEmail && (
            <a
              href={`mailto:${job.contactEmail}`}
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {job.contactEmail}
            </a>
          )}
        </div>
      )}

      {job.description && (
        <p className="mt-3 text-sm text-foreground/70 line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted">{postedAgo}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
