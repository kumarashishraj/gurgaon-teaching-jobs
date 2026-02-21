import { Suspense } from "react";
import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { desc, eq, and, sql, SQL } from "drizzle-orm";
import JobList from "@/components/JobList";
import SearchBar from "@/components/SearchBar";
import JobFilters from "@/components/JobFilters";
import Pagination from "@/components/Pagination";
import { JOBS_PER_PAGE } from "@/lib/constants";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; source?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * JOBS_PER_PAGE;

  const conditions: SQL[] = [eq(jobs.isActive, true)];

  if (params.q) {
    const q = `%${params.q}%`;
    conditions.push(
      sql`(${jobs.title} LIKE ${q} OR ${jobs.schoolName} LIKE ${q} OR ${jobs.description} LIKE ${q})`
    );
  }
  if (params.type) {
    conditions.push(eq(jobs.jobType, params.type as "TGT" | "PGT" | "OTHER"));
  }
  if (params.source) {
    conditions.push(eq(jobs.source, params.source));
  }

  const where = and(...conditions);

  const [jobRows, countResult] = await Promise.all([
    db
      .select()
      .from(jobs)
      .where(where)
      .orderBy(desc(jobs.postedDate), desc(jobs.scrapedAt))
      .limit(JOBS_PER_PAGE)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(where),
  ]);

  const totalJobs = countResult[0].count;
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Maths Teaching Jobs in Gurgaon
        </h1>
        <p className="mt-2 text-muted max-w-2xl mx-auto">
          TGT &amp; PGT Mathematics openings across Gurgaon&apos;s top private
          schools. Updated every 6 hours.
        </p>
        <Link
          href="/subscribe"
          className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Get Email Alerts
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <JobFilters />
        </Suspense>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-4">
        Showing {jobRows.length} of {totalJobs} jobs
      </p>

      {/* Job listings */}
      <JobList jobs={jobRows} />

      {/* Pagination */}
      <Suspense>
        <Pagination totalPages={totalPages} currentPage={page} />
      </Suspense>
    </div>
  );
}
