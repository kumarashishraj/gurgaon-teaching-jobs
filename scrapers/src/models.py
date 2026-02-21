from dataclasses import dataclass, field
from datetime import datetime
from hashlib import sha256
from typing import Optional


@dataclass
class JobListing:
    title: str
    school_name: str
    source: str
    job_type: str = "OTHER"  # TGT, PGT, OTHER
    subject: str = "Mathematics"
    description: Optional[str] = None
    apply_link: Optional[str] = None
    apply_email: Optional[str] = None
    source_url: Optional[str] = None
    location: str = "Gurgaon"
    salary_info: Optional[str] = None
    posted_date: Optional[str] = None

    @property
    def content_hash(self) -> str:
        raw = f"{self.title}|{self.school_name}|{self.source_url or ''}"
        return sha256(raw.encode()).hexdigest()

    def classify_job_type(self) -> str:
        text = f"{self.title} {self.description or ''}".upper()
        if "PGT" in text or "POST GRADUATE" in text:
            return "PGT"
        if "TGT" in text or "TRAINED GRADUATE" in text:
            return "TGT"
        return "OTHER"

    def __post_init__(self):
        if self.job_type == "OTHER":
            self.job_type = self.classify_job_type()
