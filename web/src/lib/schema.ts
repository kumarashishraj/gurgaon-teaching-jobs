import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const jobs = sqliteTable(
  "jobs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    schoolName: text("school_name").notNull(),
    jobType: text("job_type", { enum: ["TGT", "PGT", "OTHER"] })
      .notNull()
      .default("OTHER"),
    subject: text("subject").notNull().default("Mathematics"),
    description: text("description"),
    applyLink: text("apply_link"),
    applyEmail: text("apply_email"),
    source: text("source").notNull(),
    sourceUrl: text("source_url"),
    location: text("location").notNull().default("Gurgaon"),
    salaryInfo: text("salary_info"),
    postedDate: text("posted_date"),
    scrapedAt: text("scraped_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    expiresAt: text("expires_at"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    contentHash: text("content_hash").notNull(),
  },
  (table) => [uniqueIndex("jobs_content_hash_idx").on(table.contentHash)]
);

export const subscribers = sqliteTable(
  "subscribers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    isVerified: integer("is_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    verificationToken: text("verification_token").notNull(),
    unsubscribeToken: text("unsubscribe_token").notNull(),
    preferences: text("preferences", { mode: "json" }).$type<{
      jobTypes?: string[];
      schools?: string[];
    }>(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    verifiedAt: text("verified_at"),
  },
  (table) => [uniqueIndex("subscribers_email_idx").on(table.email)]
);

export const notificationsLog = sqliteTable(
  "notifications_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    subscriberId: integer("subscriber_id")
      .notNull()
      .references(() => subscribers.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    sentAt: text("sent_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    status: text("status", { enum: ["sent", "failed"] })
      .notNull()
      .default("sent"),
  },
  (table) => [
    uniqueIndex("notifications_subscriber_job_idx").on(
      table.subscriberId,
      table.jobId
    ),
  ]
);

export const scraperRuns = sqliteTable("scraper_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  scraperName: text("scraper_name").notNull(),
  startedAt: text("started_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  finishedAt: text("finished_at"),
  jobsFound: integer("jobs_found").notNull().default(0),
  jobsNew: integer("jobs_new").notNull().default(0),
  status: text("status", { enum: ["running", "success", "failed"] })
    .notNull()
    .default("running"),
  errorMessage: text("error_message"),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
