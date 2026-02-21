"""Main orchestrator for all scrapers."""

import sys
import requests

from config.settings import NOTIFY_URL, NOTIFY_API_SECRET
from src.db import (
    init_db,
    insert_job,
    start_scraper_run,
    finish_scraper_run,
    deactivate_expired_jobs,
)
from src.dedup import deduplicate_jobs
from src.scrapers.google_search import GoogleSearchScraper
from src.scrapers.school_pages import SchoolPagesScraper
from src.scrapers.naukri import NaukriScraper
from src.scrapers.indeed import IndeedScraper


SCRAPERS = [
    GoogleSearchScraper(),
    SchoolPagesScraper(),
    NaukriScraper(),
    IndeedScraper(),
]


def run_all():
    print("=" * 60)
    print("Gurgaon Maths Teaching Jobs - Scraper Run")
    print("=" * 60)

    conn = init_db()

    # Deactivate expired jobs first
    deactivate_expired_jobs(conn)

    total_found = 0
    total_new = 0

    for scraper in SCRAPERS:
        print(f"\n--- {scraper.name} ---")
        run_id = start_scraper_run(conn, scraper.name)

        try:
            jobs = scraper.scrape()
            jobs = deduplicate_jobs(jobs)

            new_count = 0
            for job in jobs:
                if insert_job(conn, job):
                    new_count += 1
                    print(f"    + NEW: {job.title} @ {job.school_name}")

            finish_scraper_run(conn, run_id, len(jobs), new_count)
            total_found += len(jobs)
            total_new += new_count

            print(f"  Results: {len(jobs)} found, {new_count} new")

        except Exception as e:
            print(f"  FAILED: {e}")
            finish_scraper_run(conn, run_id, 0, 0, "failed", str(e))

    print(f"\n{'=' * 60}")
    print(f"Total: {total_found} jobs found, {total_new} new")
    print(f"{'=' * 60}")

    # Trigger notifications if there are new jobs
    if total_new > 0 and NOTIFY_URL and NOTIFY_API_SECRET:
        print("\nTriggering notifications...")
        try:
            resp = requests.post(
                NOTIFY_URL,
                headers={"Authorization": f"Bearer {NOTIFY_API_SECRET}"},
                timeout=30,
            )
            print(f"  Notify response: {resp.status_code} - {resp.json()}")
        except Exception as e:
            print(f"  Notify failed: {e}")

    return total_new


if __name__ == "__main__":
    new_jobs = run_all()
    sys.exit(0 if new_jobs >= 0 else 1)
