import { Suspense } from "react";
import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { desc, asc, eq, and, sql, inArray, SQL } from "drizzle-orm";
import JobList from "@/components/JobList";
import SearchBar from "@/components/SearchBar";
import JobFilters from "@/components/JobFilters";
import Pagination from "@/components/Pagination";
import { JOBS_PER_PAGE } from "@/lib/constants";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; board?: string; source?: string; relevance?: string; page?: string; sort?: string }>;
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

  // Multiselect filters: comma-separated values → inArray
  if (params.type) {
    const types = params.type.split(",").filter(Boolean);
    if (types.length === 1) {
      conditions.push(eq(jobs.jobType, types[0] as "TGT" | "PGT" | "OTHER"));
    } else if (types.length > 1) {
      conditions.push(inArray(jobs.jobType, types as ("TGT" | "PGT" | "OTHER")[]));
    }
  }
  if (params.board) {
    const boards = params.board.split(",").filter(Boolean);
    if (boards.length === 1) {
      conditions.push(eq(jobs.board, boards[0]));
    } else if (boards.length > 1) {
      conditions.push(inArray(jobs.board, boards));
    }
  }
  if (params.source) {
    const sources = params.source.split(",").filter(Boolean);
    if (sources.length === 1) {
      conditions.push(eq(jobs.source, sources[0]));
    } else if (sources.length > 1) {
      conditions.push(inArray(jobs.source, sources));
    }
  }
  if (params.relevance) {
    const relevances = params.relevance.split(",").filter(Boolean);
    if (relevances.length === 1) {
      conditions.push(eq(jobs.relevance, relevances[0]));
    } else if (relevances.length > 1) {
      conditions.push(inArray(jobs.relevance, relevances));
    }
  }

  // Sort order
  const sort = params.sort || "newest";
  let orderByClause;
  switch (sort) {
    case "oldest":
      orderByClause = [asc(jobs.postedDate), asc(jobs.scrapedAt)];
      break;
    case "relevance":
      orderByClause = [
        sql`CASE ${jobs.relevance}
          WHEN 'Hot' THEN 1
          WHEN 'Top School' THEN 2
          WHEN 'Featured' THEN 3
          WHEN 'New' THEN 4
          ELSE 5
        END`,
        desc(jobs.postedDate),
      ];
      break;
    case "newest":
    default:
      orderByClause = [desc(jobs.postedDate), desc(jobs.scrapedAt)];
      break;
  }

  const where = and(...conditions);

  const [jobRows, countResult] = await Promise.all([
    db
      .select()
      .from(jobs)
      .where(where)
      .orderBy(...orderByClause)
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
    <div>
      {/* Hero */}
      <div className="hero-gradient text-white py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Maths Teaching Jobs in Gurgaon
          </h1>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            TGT &amp; PGT Mathematics openings across Gurgaon&apos;s top private
            schools. Updated every 5 minutes.
          </p>
          <Link
            href="/subscribe"
            className="inline-block mt-5 bg-white text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Get Email Alerts
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
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
    </div>
  );
}
