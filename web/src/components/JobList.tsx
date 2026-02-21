import JobCard from "./JobCard";
import type { Job } from "@/lib/schema";

export default function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          No jobs found
        </h3>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your search or filters. New jobs are added regularly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
