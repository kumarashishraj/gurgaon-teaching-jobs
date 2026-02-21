import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, parseInt(id, 10)))
    .get();

  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} at ${job.schoolName}`,
    description: job.description?.slice(0, 160),
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, parseInt(id, 10)))
    .get();

  if (!job) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-sm text-primary hover:text-primary-dark transition-colors"
      >
        &larr; Back to all jobs
      </Link>

      <div className="mt-6 bg-card border border-border rounded-lg p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            <p className="text-lg text-muted mt-1">{job.schoolName}</p>
          </div>
          <Badge text={job.jobType} variant={job.jobType} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
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
          {job.postedDate && (
            <span>
              Posted:{" "}
              {new Date(job.postedDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {job.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Description
            </h2>
            <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {job.applyLink && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Apply Now &rarr;
            </a>
          )}
          {job.applyEmail && (
            <a
              href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
              className="border border-primary text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary-light transition-colors"
            >
              Email: {job.applyEmail}
            </a>
          )}
          {job.sourceUrl && (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border text-muted px-6 py-2.5 rounded-lg font-medium hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              View Original
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted text-sm">
          Want to get notified about new jobs like this?
        </p>
        <Link
          href="/subscribe"
          className="inline-block mt-2 text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Subscribe for Email Alerts &rarr;
        </Link>
      </div>
    </div>
  );
}
