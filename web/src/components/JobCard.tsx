import Link from "next/link";
import Badge from "./Badge";
import type { Job } from "@/lib/schema";

export default function JobCard({ job }: { job: Job }) {
  const postedAgo = job.postedDate
    ? formatRelativeDate(job.postedDate)
    : "Recently";

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/jobs/${job.id}`}
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="text-muted mt-1 text-sm">{job.schoolName}</p>
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
        <Badge text={job.source} variant="source" />
      </div>

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
