import sqlite3
from datetime import datetime, timedelta
from typing import Optional

import libsql_experimental as libsql

from config.settings import TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, JOB_EXPIRY_DAYS
from src.models import JobListing


def get_connection():
    if TURSO_DATABASE_URL.startswith("file:"):
        path = TURSO_DATABASE_URL.replace("file:", "")
        return libsql.connect(path)
    return libsql.connect(TURSO_DATABASE_URL, auth_token=TURSO_AUTH_TOKEN)


def init_db():
    conn = get_connection()
    conn.execute("""
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
    """)
    conn.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS jobs_content_hash_idx ON jobs(content_hash)
    """)
    conn.execute("""
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
    """)
    conn.commit()
    return conn


def insert_job(conn, job: JobListing) -> bool:
    """Insert a job. Returns True if it was new (not a duplicate)."""
    expires_at = (datetime.utcnow() + timedelta(days=JOB_EXPIRY_DAYS)).isoformat()
    try:
        conn.execute(
            """
            INSERT OR IGNORE INTO jobs
                (title, school_name, job_type, subject, description,
                 apply_link, apply_email, source, source_url, location,
                 salary_info, posted_date, expires_at, content_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                job.title,
                job.school_name,
                job.job_type,
                job.subject,
                job.description,
                job.apply_link,
                job.apply_email,
                job.source,
                job.source_url,
                job.location,
                job.salary_info,
                job.posted_date,
                expires_at,
                job.content_hash,
            ),
        )
        conn.commit()
        return conn.execute("SELECT changes()").fetchone()[0] > 0
    except Exception as e:
        print(f"  Error inserting job: {e}")
        return False


def start_scraper_run(conn, scraper_name: str) -> int:
    conn.execute(
        "INSERT INTO scraper_runs (scraper_name) VALUES (?)", (scraper_name,)
    )
    conn.commit()
    return conn.execute("SELECT last_insert_rowid()").fetchone()[0]


def finish_scraper_run(
    conn,
    run_id: int,
    jobs_found: int,
    jobs_new: int,
    status: str = "success",
    error_message: Optional[str] = None,
):
    conn.execute(
        """
        UPDATE scraper_runs
        SET finished_at = datetime('now'), jobs_found = ?, jobs_new = ?,
            status = ?, error_message = ?
        WHERE id = ?
        """,
        (jobs_found, jobs_new, status, error_message, run_id),
    )
    conn.commit()


def deactivate_expired_jobs(conn):
    conn.execute(
        """
        UPDATE jobs SET is_active = 0
        WHERE expires_at < datetime('now') AND is_active = 1
        """
    )
    conn.commit()
