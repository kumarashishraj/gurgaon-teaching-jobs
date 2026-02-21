import time
from typing import List

import requests
from bs4 import BeautifulSoup

from config.settings import REQUEST_TIMEOUT, USER_AGENT, REQUEST_DELAY
from src.models import JobListing
from src.scrapers.base import BaseScraper


class NaukriScraper(BaseScraper):
    name = "naukri"

    SEARCH_URL = "https://www.naukri.com/maths-teacher-jobs-in-gurgaon"

    def scrape(self) -> List[JobListing]:
        jobs: List[JobListing] = []

        try:
            print(f"  Fetching: {self.SEARCH_URL}")
            headers = {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-IN,en;q=0.9",
            }
            resp = requests.get(
                self.SEARCH_URL, headers=headers, timeout=REQUEST_TIMEOUT
            )
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")
            job_cards = soup.select(".srp-jobtuple-wrapper, .jobTuple, article.jobTuple")

            for card in job_cards:
                job = self._parse_card(card)
                if job:
                    jobs.append(job)

            print(f"  Naukri found {len(jobs)} maths teaching jobs")

        except Exception as e:
            print(f"  Naukri scraping failed: {e}")
            print("  Will rely on Google CSE fallback for Naukri results")

        return jobs

    def _parse_card(self, card) -> JobListing | None:
        title_el = card.select_one(".title, .info h2 a, a.title")
        company_el = card.select_one(".comp-name, .subTitle a, a.companyName")
        desc_el = card.select_one(".job-desc, .ellipsis, .job-description")
        salary_el = card.select_one(".sal, .salary, span.salary")
        location_el = card.select_one(".loc, .location, span.location")

        title = title_el.get_text(strip=True) if title_el else ""
        if not title or not self.is_maths_related(title):
            return None

        company = company_el.get_text(strip=True) if company_el else "Unknown School"
        description = desc_el.get_text(strip=True) if desc_el else None
        salary = salary_el.get_text(strip=True) if salary_el else None
        location = location_el.get_text(strip=True) if location_el else "Gurgaon"

        link = None
        if title_el and title_el.get("href"):
            link = title_el["href"]
            if link.startswith("/"):
                link = f"https://www.naukri.com{link}"

        return JobListing(
            title=title,
            school_name=company,
            source="Naukri",
            description=description,
            source_url=link,
            apply_link=link,
            location=location,
            salary_info=salary,
        )
