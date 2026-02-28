import json
import time
from pathlib import Path
from typing import List

import requests
from bs4 import BeautifulSoup

from config.settings import REQUEST_TIMEOUT, REQUEST_DELAY, USER_AGENT
from src.models import JobListing
from src.scrapers.base import BaseScraper


class SchoolPagesScraper(BaseScraper):
    name = "school_pages"

    def __init__(self):
        config_path = Path(__file__).parent.parent.parent / "config" / "schools.json"
        with open(config_path) as f:
            self.schools = json.load(f)

    def scrape(self) -> List[JobListing]:
        jobs: List[JobListing] = []

        for school in self.schools:
            print(f"  Checking: {school['name']}")
            try:
                school_jobs = self._scrape_school(school)
                jobs.extend(school_jobs)
                print(f"    Found {len(school_jobs)} maths-related posting(s)")
            except Exception as e:
                print(f"    Error scraping {school['name']}: {e}")

            time.sleep(REQUEST_DELAY)

        print(f"  School pages found {len(jobs)} total jobs")
        return jobs

    @staticmethod
    def _is_job_posting(text: str) -> bool:
        """Check if the text looks like an actual job posting, not just a page
        that happens to mention maths (e.g. 'Maths Lab', 'Maths Club')."""
        text_lower = text.lower()
        job_indicators = [
            "vacancy", "vacancies", "hiring", "recruit", "apply",
            "application", "walk-in", "walk in", "opening", "openings",
            "position", "required", "requirement", "job", "career",
            "resume", "cv", "interview", "salary", "compensation",
            "tgt", "pgt", "teacher required", "teacher needed",
            "looking for", "we are looking", "invites applications",
        ]
        return any(kw in text_lower for kw in job_indicators)

    def _scrape_school(self, school: dict) -> List[JobListing]:
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(
            school["career_url"], headers=headers, timeout=REQUEST_TIMEOUT
        )
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        selectors = school["selectors"]
        jobs: List[JobListing] = []

        # Try to find job listings using configured selectors
        listings = soup.select(selectors["job_list"])

        if not listings:
            # Fallback: only create a listing if the page clearly advertises
            # a maths teaching vacancy (not just mentions maths in general)
            all_text = soup.get_text()
            if self.is_maths_related(all_text) and self._is_job_posting(all_text):
                jobs.append(
                    JobListing(
                        title=f"Mathematics Teacher - {school['name']}",
                        school_name=school["name"],
                        source="School Website",
                        description=f"Potential mathematics teaching position found on {school['name']} careers page. Visit the page for details.",
                        source_url=school["career_url"],
                        apply_link=school["career_url"],
                        location=school.get("location", "Gurgaon"),
                    )
                )
            return jobs

        for listing in listings:
            title_el = listing.select_one(selectors["title"])
            desc_el = listing.select_one(selectors["description"])

            title = title_el.get_text(strip=True) if title_el else ""
            description = desc_el.get_text(strip=True) if desc_el else ""
            combined = f"{title} {description}"

            if not self.is_maths_related(combined):
                continue

            # Skip non-job pages (maths labs, clubs, facilities, etc.)
            if not self._is_job_posting(combined):
                continue

            # Try to find apply link
            apply_link = None
            link_el = listing.find("a", href=True)
            if link_el:
                href = link_el["href"]
                if href.startswith("/"):
                    from urllib.parse import urljoin
                    href = urljoin(school["career_url"], href)
                apply_link = href

            jobs.append(
                JobListing(
                    title=title or f"Mathematics Teacher - {school['name']}",
                    school_name=school["name"],
                    source="School Website",
                    description=description or None,
                    source_url=school["career_url"],
                    apply_link=apply_link or school["career_url"],
                    apply_email=self.extract_email(combined),
                    location=school.get("location", "Gurgaon"),
                )
            )

        return jobs
