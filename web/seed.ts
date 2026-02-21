import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { jobs } from "./src/lib/schema";
import { createHash } from "crypto";

const client = createClient({ url: "file:local.db" });
const db = drizzle(client);

function hash(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

const seedJobs = [
  {
    title: "PGT Mathematics Teacher",
    schoolName: "DPS Gurgaon",
    jobType: "PGT" as const,
    subject: "Mathematics",
    description:
      "Delhi Public School, Gurgaon is looking for an experienced PGT Mathematics teacher. Must have M.Sc. Mathematics with B.Ed and minimum 5 years of teaching experience in CBSE curriculum. Strong knowledge of NCF 2023 framework preferred.",
    applyLink: "https://dpsgurgaon.org/careers",
    source: "School Website",
    sourceUrl: "https://dpsgurgaon.org/careers/pgt-maths-2024",
    location: "Sector 45, Gurgaon",
    salaryInfo: "8-12 LPA",
    postedDate: "2026-02-15",
    contentHash: hash("PGT Mathematics Teacher|DPS Gurgaon|https://dpsgurgaon.org/careers/pgt-maths-2024"),
  },
  {
    title: "TGT Mathematics",
    schoolName: "The Shri Ram School, Aravali",
    jobType: "TGT" as const,
    subject: "Mathematics",
    description:
      "The Shri Ram School Aravali invites applications for TGT Mathematics. Candidates should have B.Sc./M.Sc. Mathematics with B.Ed. Experience with CBSE curriculum for classes VI-X. Should be passionate about innovative teaching methodologies.",
    applyLink: "https://tsrs.org/careers",
    source: "School Website",
    sourceUrl: "https://tsrs.org/careers/tgt-maths",
    location: "Aravali, Gurgaon",
    salaryInfo: "6-9 LPA",
    postedDate: "2026-02-10",
    contentHash: hash("TGT Mathematics|The Shri Ram School, Aravali|https://tsrs.org/careers/tgt-maths"),
  },
  {
    title: "PGT Maths Teacher - Senior Secondary",
    schoolName: "Pathways School Gurgaon",
    jobType: "PGT" as const,
    subject: "Mathematics",
    description:
      "Pathways School Gurgaon requires a PGT Mathematics teacher for IB Diploma Programme. Must have M.Sc. Mathematics with teaching experience in IB/IGCSE curriculum. Knowledge of GeoGebra and Desmos preferred.",
    applyEmail: "hr@pathways.in",
    source: "Naukri",
    sourceUrl: "https://naukri.com/job/pgt-maths-pathways",
    location: "Sector 100, Gurgaon",
    salaryInfo: "10-15 LPA",
    postedDate: "2026-02-18",
    contentHash: hash("PGT Maths Teacher - Senior Secondary|Pathways School Gurgaon|https://naukri.com/job/pgt-maths-pathways"),
  },
  {
    title: "Mathematics Teacher (Classes IX-XII)",
    schoolName: "Scottish High International School",
    jobType: "PGT" as const,
    subject: "Mathematics",
    description:
      "Scottish High International School is hiring a Mathematics teacher for senior classes. M.Sc. in Mathematics with B.Ed required. Minimum 3 years experience. Must be comfortable with smart classroom technology and online teaching tools.",
    applyLink: "https://scottishigh.com/careers",
    source: "Indeed",
    sourceUrl: "https://indeed.co.in/job/maths-teacher-scottish-high",
    location: "Sector 57, Gurgaon",
    postedDate: "2026-02-12",
    contentHash: hash("Mathematics Teacher (Classes IX-XII)|Scottish High International School|https://indeed.co.in/job/maths-teacher-scottish-high"),
  },
  {
    title: "TGT Mathematics - Primary & Middle School",
    schoolName: "Heritage Xperiential Learning School",
    jobType: "TGT" as const,
    subject: "Mathematics",
    description:
      "Heritage School seeks a TGT Maths teacher for primary and middle school sections. B.Sc. Mathematics with B.Ed required. Experience with activity-based learning and NEP 2020 implementation preferred. Excellent communication skills necessary.",
    applyLink: "https://heritageschool.in/work-with-us",
    applyEmail: "careers@heritageschool.in",
    source: "LinkedIn",
    sourceUrl: "https://linkedin.com/jobs/view/tgt-maths-heritage",
    location: "Sector 62, Gurgaon",
    salaryInfo: "5-7 LPA",
    postedDate: "2026-02-08",
    contentHash: hash("TGT Mathematics - Primary & Middle School|Heritage Xperiential Learning School|https://linkedin.com/jobs/view/tgt-maths-heritage"),
  },
];

async function main() {
  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      school_name TEXT NOT NULL,
      job_type TEXT NOT NULL DEFAULT 'OTHER',
      subject TEXT NOT NULL DEFAULT 'Mathematics',
      description TEXT,
      apply_link TEXT,
      apply_email TEXT,
      source TEXT NOT NULL,
      source_url TEXT,
      location TEXT NOT NULL DEFAULT 'Gurgaon',
      salary_info TEXT,
      posted_date TEXT,
      scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      content_hash TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS jobs_content_hash_idx ON jobs(content_hash)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      is_verified INTEGER NOT NULL DEFAULT 0,
      verification_token TEXT NOT NULL,
      unsubscribe_token TEXT NOT NULL,
      preferences TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      verified_at TEXT
    )
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers(email)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS notifications_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscriber_id INTEGER NOT NULL REFERENCES subscribers(id),
      job_id INTEGER NOT NULL REFERENCES jobs(id),
      sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'sent'
    )
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS notifications_subscriber_job_idx ON notifications_log(subscriber_id, job_id)
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS scraper_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scraper_name TEXT NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT,
      jobs_found INTEGER NOT NULL DEFAULT 0,
      jobs_new INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'running',
      error_message TEXT
    )
  `);

  // Seed jobs
  for (const job of seedJobs) {
    await db
      .insert(jobs)
      .values(job)
      .onConflictDoNothing({ target: jobs.contentHash });
  }

  console.log(`Seeded ${seedJobs.length} jobs successfully!`);
  process.exit(0);
}

main().catch(console.error);
