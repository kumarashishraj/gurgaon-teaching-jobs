import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Gurgaon Maths Teaching Jobs - aggregating TGT and PGT Mathematics teaching openings.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">About</h1>

      <div className="mt-6 space-y-6 text-foreground/80 leading-relaxed">
        <p>
          <strong>Gurgaon Maths Teaching Jobs</strong> aggregates TGT and PGT
          Mathematics teaching openings from private schools across Gurgaon
          (Gurugram). Job postings are scattered across school websites,
          LinkedIn, Naukri, and Indeed &mdash; we bring them all to one place.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          How it works
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Our automated scrapers check multiple sources every 6 hours for new
            Maths teaching positions.
          </li>
          <li>
            Jobs are deduplicated and categorized (TGT, PGT) with school name,
            location, and salary information when available.
          </li>
          <li>
            Subscribe to email alerts and get notified as soon as new jobs
            appear &mdash; no more checking multiple websites daily.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          Sources
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>45+ school career pages including DPS, Shri Ram, Pathways, Scottish High, Heritage, Suncity, GD Goenka, Shiv Nadar, Lotus Valley, Lancers, Amity, K.R. Mangalam, Bal Bharati, Presidium, Ryan, DAV, GEMS, Excelsior, VIBGYOR, Blue Bells, Shikshantar, and more</li>
          <li>Naukri.com</li>
          <li>Indeed.co.in</li>
          <li>LinkedIn (via Google search)</li>
          <li>Other job boards via Google Custom Search</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          For schools
        </h2>
        <p>
          If you&apos;d like your school&apos;s Maths teaching openings listed here, or
          if you&apos;d like to update/remove a listing, please email us.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/subscribe"
          className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Subscribe for Job Alerts
        </Link>
      </div>
    </div>
  );
}
