import time
from typing import List

import requests
from bs4 import BeautifulSoup

from config.settings import REQUEST_TIMEOUT, USER_AGENT
from src.models import JobListing
from src.scrapers.base import BaseScraper


class IndeedScraper(BaseScraper):
    name = "indeed"

    SEARCH_URL = "https://in.indeed.com/jobs"

    def scrape(self) -> List[JobListing]:
        jobs: List[JobListing] = []

        try:
            print(f"  Fetching Indeed results...")
            headers = {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-IN,en;q=0.9",
            }
            params = {
                "q": "maths teacher",
                "l": "Gurgaon, Haryana",
            }
            resp = requests.get(
                self.SEARCH_URL,
                params=params,
                headers=headers,
                timeout=REQUEST_TIMEOUT,
            )
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")
            job_cards = soup.select(".job_seen_beacon, .jobsearch-ResultsList > li, div.cardOutline")

            for card in job_cards:
                job = self._parse_card(card)
                if job:
                    jobs.append(job)

            print(f"  Indeed found {len(jobs)} maths teaching jobs")

        except Exception as e:
            print(f"  Indeed scraping failed: {e}")
            print("  Will rely on Google CSE fallback for Indeed results")

        return jobs

    def _parse_card(self, card) -> JobListing | None:
        title_el = card.select_one("h2.jobTitle a, a[data-jk], .jobTitle span")
        company_el = card.select_one(".companyName, span.css-63koeb, [data-testid='company-name']")
        location_el = card.select_one(".companyLocation, [data-testid='text-location']")
        salary_el = card.select_one(".salary-snippet-container, .estimated-salary, [data-testid='attribute_snippet_testid']")
        desc_el = card.select_one(".job-snippet, .underShelfFooter, ul")

        title = title_el.get_text(strip=True) if title_el else ""
        if not title or not self.is_maths_related(title):
            return None

        company = company_el.get_text(strip=True) if company_el else "Unknown School"
        location = location_el.get_text(strip=True) if location_el else "Gurgaon"
        salary = salary_el.get_text(strip=True) if salary_el else None
        description = desc_el.get_text(strip=True) if desc_el else None

        # Extract job link
        link = None
        link_el = card.select_one("a[data-jk], h2.jobTitle a")
        if link_el and link_el.get("href"):
            href = link_el["href"]
            if href.startswith("/"):
                href = f"https://in.indeed.com{href}"
            link = href

        return JobListing(
            title=title,
            school_name=company,
            source="Indeed",
            description=description,
            source_url=link,
            apply_link=link,
            location=location,
            salary_info=salary,
        )
