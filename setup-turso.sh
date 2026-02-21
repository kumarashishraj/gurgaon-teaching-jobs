#!/bin/bash
# Run this after installing Turso CLI and logging in:
#   curl -sSfL https://get.tur.so/install.sh | bash
#   turso auth login

set -e

echo "=== Creating Turso Database ==="
turso db create gurgaon-teaching-jobs

echo ""
echo "=== Database URL ==="
turso db show gurgaon-teaching-jobs --url

echo ""
echo "=== Creating Auth Token ==="
turso db tokens create gurgaon-teaching-jobs

echo ""
echo "=== Creating Tables ==="
turso db shell gurgaon-teaching-jobs <<'SQL'
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
);

CREATE UNIQUE INDEX IF NOT EXISTS jobs_content_hash_idx ON jobs(content_hash);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 0,
  verification_token TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL,
  preferences TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  verified_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers(email);

CREATE TABLE IF NOT EXISTS notifications_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER NOT NULL REFERENCES subscribers(id),
  job_id INTEGER NOT NULL REFERENCES jobs(id),
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'sent'
);

CREATE UNIQUE INDEX IF NOT EXISTS notifications_subscriber_job_idx ON notifications_log(subscriber_id, job_id);

CREATE TABLE IF NOT EXISTS scraper_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scraper_name TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  jobs_found INTEGER NOT NULL DEFAULT 0,
  jobs_new INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'running',
  error_message TEXT
);

.quit
SQL

echo ""
echo "=== Done! ==="
echo "Copy the URL and token above into your Vercel environment variables."
