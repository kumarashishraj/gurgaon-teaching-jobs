import os
from dotenv import load_dotenv

load_dotenv()

TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL", "file:../web/local.db")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN", "")

GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY", "")
GOOGLE_CSE_CX = os.getenv("GOOGLE_CSE_CX", "")

NOTIFY_URL = os.getenv("NOTIFY_URL", "http://localhost:3000/api/notify")
NOTIFY_API_SECRET = os.getenv("NOTIFY_API_SECRET", "")

# Scraper settings
REQUEST_TIMEOUT = 15
REQUEST_DELAY = 2  # seconds between requests
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# Deduplication
FUZZY_MATCH_THRESHOLD = 0.85

# Job expiry
JOB_EXPIRY_DAYS = 30

SEARCH_QUERIES = [
    "TGT maths teacher Gurgaon",
    "PGT mathematics teacher Gurgaon hiring",
    "maths teacher vacancy Gurgaon private school",
    "mathematics teacher job Gurugram",
    "TGT PGT maths Gurgaon school recruitment",
]
