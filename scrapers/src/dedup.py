from difflib import SequenceMatcher
from typing import List

from config.settings import FUZZY_MATCH_THRESHOLD
from src.models import JobListing


def is_fuzzy_duplicate(
    new_job: JobListing, existing_jobs: List[JobListing]
) -> bool:
    """Check if a job is a fuzzy duplicate of any existing job."""
    new_key = f"{new_job.title} {new_job.school_name}".lower()

    for existing in existing_jobs:
        existing_key = f"{existing.title} {existing.school_name}".lower()
        ratio = SequenceMatcher(None, new_key, existing_key).ratio()
        if ratio >= FUZZY_MATCH_THRESHOLD:
            return True

    return False


def deduplicate_jobs(jobs: List[JobListing]) -> List[JobListing]:
    """Remove fuzzy duplicates from a list of jobs, keeping the first occurrence."""
    unique: List[JobListing] = []

    for job in jobs:
        if not is_fuzzy_duplicate(job, unique):
            unique.append(job)

    removed = len(jobs) - len(unique)
    if removed > 0:
        print(f"  Fuzzy dedup removed {removed} duplicate(s)")

    return unique
