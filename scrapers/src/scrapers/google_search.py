import time
from typing import List

import requests

from config.settings import (
    GOOGLE_CSE_API_KEY,
    GOOGLE_CSE_CX,
    REQUEST_TIMEOUT,
    REQUEST_DELAY,
    SEARCH_QUERIES,
)
from src.models import JobListing
from src.scrapers.base import BaseScraper


class GoogleSearchScraper(BaseScraper):
    name = "google_cse"

    def scrape(self) -> List[JobListing]:
        if not GOOGLE_CSE_API_KEY or not GOOGLE_CSE_CX:
            print("  Google CSE credentials not configured, skipping")
            return []

        jobs: List[JobListing] = []

        for query in SEARCH_QUERIES:
            print(f"  Searching: {query}")
            try:
                results = self._search(query)
                for item in results:
                    job = self._parse_result(item)
                    if job:
                        jobs.append(job)
            except Exception as e:
                print(f"  Error searching '{query}': {e}")

            time.sleep(REQUEST_DELAY)

        print(f"  Google CSE found {len(jobs)} potential jobs")
        return jobs

    def _search(self, query: str) -> list:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": GOOGLE_CSE_API_KEY,
            "cx": GOOGLE_CSE_CX,
            "q": query,
            "num": 10,
        }
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        return data.get("items", [])

    def _parse_result(self, item: dict) -> JobListing | None:
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        link = item.get("link", "")
        combined = f"{title} {snippet}"

        if not self.is_maths_related(combined):
            return None

        # Determine source from URL
        source = "Google"
        if "linkedin.com" in link:
            source = "LinkedIn"
        elif "naukri.com" in link:
            source = "Naukri"
        elif "indeed.co" in link:
            source = "Indeed"

        # Try to extract school name from title/snippet
        school_name = self._extract_school_name(title, snippet)

        return JobListing(
            title=title.strip(),
            school_name=school_name,
            source=source,
            description=snippet.strip(),
            source_url=link,
            apply_link=link,
            apply_email=self.extract_email(snippet),
        )

    def _extract_school_name(self, title: str, snippet: str) -> str:
        school_indicators = [
            "school", "academy", "vidyalaya", "institute", "international",
        ]
        combined = f"{title} {snippet}"

        for indicator in school_indicators:
            idx = combined.lower().find(indicator)
            if idx != -1:
                # Try to extract a reasonable school name around the indicator
                start = max(0, combined.rfind(" ", 0, max(0, idx - 20)))
                end = combined.find(",", idx)
                if end == -1:
                    end = combined.find(".", idx)
                if end == -1:
                    end = min(len(combined), idx + 40)
                name = combined[start:end].strip(" -|,.")
                if len(name) > 3:
                    return name

        return "Unknown School"
