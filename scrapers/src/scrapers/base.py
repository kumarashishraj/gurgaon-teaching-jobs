import re
from abc import ABC, abstractmethod
from typing import List

from src.models import JobListing


MATHS_KEYWORDS = [
    "math", "maths", "mathematics", "mathematical",
]

GURGAON_KEYWORDS = [
    "gurgaon", "gurugram",
]


class BaseScraper(ABC):
    name: str = "base"

    @abstractmethod
    def scrape(self) -> List[JobListing]:
        pass

    @staticmethod
    def is_maths_related(text: str) -> bool:
        text_lower = text.lower()
        return any(kw in text_lower for kw in MATHS_KEYWORDS)

    @staticmethod
    def is_gurgaon_related(text: str) -> bool:
        text_lower = text.lower()
        return any(kw in text_lower for kw in GURGAON_KEYWORDS)

    @staticmethod
    def extract_email(text: str) -> str | None:
        match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
        return match.group(0) if match else None
