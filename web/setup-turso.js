const { createClient } = require("@libsql/client");
const crypto = require("crypto");

const c = createClient({
  url: "libsql://gurgaon-teaching-jobs-ashishraj.aws-ap-south-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE2NTkwNjgsImlkIjoiMTY5ZGU1YTctZmY1MC00ODM2LWI4YmYtMmZmMzkyMGU1NjQ4IiwicmlkIjoiNDMzNzRmYWEtYzFjMS00ZmVhLTg0NWItYzJlNzZiMDg2MmZiIn0.sFfidFXujud_8aL00MElQr51y5byFzUekmmI5SdsWTGS42qe2UWEhtswJ_pPZ-X_4Brb0TYRW7vDHlRrGAnbCw",
});

function hash(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function run() {
  console.log("Creating tables...");

  await c.execute(
    "CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, school_name TEXT NOT NULL, job_type TEXT NOT NULL DEFAULT 'OTHER', subject TEXT NOT NULL DEFAULT 'Mathematics', description TEXT, apply_link TEXT, apply_email TEXT, source TEXT NOT NULL, source_url TEXT, location TEXT NOT NULL DEFAULT 'Gurgaon', salary_info TEXT, posted_date TEXT, scraped_at TEXT NOT NULL DEFAULT (datetime('now')), expires_at TEXT, is_active INTEGER NOT NULL DEFAULT 1, content_hash TEXT NOT NULL)"
  );
  await c.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS jobs_content_hash_idx ON jobs(content_hash)"
  );

  await c.execute(
    "CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, is_verified INTEGER NOT NULL DEFAULT 0, verification_token TEXT NOT NULL, unsubscribe_token TEXT NOT NULL, preferences TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), verified_at TEXT)"
  );
  await c.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers(email)"
  );

  await c.execute(
    "CREATE TABLE IF NOT EXISTS notifications_log (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriber_id INTEGER NOT NULL REFERENCES subscribers(id), job_id INTEGER NOT NULL REFERENCES jobs(id), sent_at TEXT NOT NULL DEFAULT (datetime('now')), status TEXT NOT NULL DEFAULT 'sent')"
  );
  await c.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS notifications_subscriber_job_idx ON notifications_log(subscriber_id, job_id)"
  );

  await c.execute(
    "CREATE TABLE IF NOT EXISTS scraper_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, scraper_name TEXT NOT NULL, started_at TEXT NOT NULL DEFAULT (datetime('now')), finished_at TEXT, jobs_found INTEGER NOT NULL DEFAULT 0, jobs_new INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'running', error_message TEXT)"
  );

  console.log("Tables created!");

  const seedJobs = [
    {
      title: "PGT Mathematics Teacher",
      school: "DPS Gurgaon",
      type: "PGT",
      desc: "Delhi Public School, Gurgaon is looking for an experienced PGT Mathematics teacher. Must have M.Sc. Mathematics with B.Ed and minimum 5 years of teaching experience in CBSE curriculum. Strong knowledge of NCF 2023 framework preferred.",
      link: "https://dpsgurgaon.org/careers",
      email: null,
      source: "School Website",
      url: "https://dpsgurgaon.org/careers/pgt-maths-2024",
      loc: "Sector 45, Gurgaon",
      salary: "8-12 LPA",
      date: "2026-02-15",
    },
    {
      title: "TGT Mathematics",
      school: "The Shri Ram School, Aravali",
      type: "TGT",
      desc: "The Shri Ram School Aravali invites applications for TGT Mathematics. Candidates should have B.Sc./M.Sc. Mathematics with B.Ed. Experience with CBSE curriculum for classes VI-X.",
      link: "https://tsrs.org/careers",
      email: null,
      source: "School Website",
      url: "https://tsrs.org/careers/tgt-maths",
      loc: "Aravali, Gurgaon",
      salary: "6-9 LPA",
      date: "2026-02-10",
    },
    {
      title: "PGT Maths Teacher - Senior Secondary",
      school: "Pathways School Gurgaon",
      type: "PGT",
      desc: "Pathways School Gurgaon requires a PGT Mathematics teacher for IB Diploma Programme. Must have M.Sc. Mathematics with teaching experience in IB/IGCSE curriculum. Knowledge of GeoGebra and Desmos preferred.",
      link: null,
      email: "hr@pathways.in",
      source: "Naukri",
      url: "https://naukri.com/job/pgt-maths-pathways",
      loc: "Sector 100, Gurgaon",
      salary: "10-15 LPA",
      date: "2026-02-18",
    },
    {
      title: "Mathematics Teacher (Classes IX-XII)",
      school: "Scottish High International School",
      type: "PGT",
      desc: "Scottish High International School is hiring a Mathematics teacher for senior classes. M.Sc. in Mathematics with B.Ed required. Minimum 3 years experience.",
      link: "https://scottishigh.com/careers",
      email: null,
      source: "Indeed",
      url: "https://indeed.co.in/job/maths-teacher-scottish-high",
      loc: "Sector 57, Gurgaon",
      salary: null,
      date: "2026-02-12",
    },
    {
      title: "TGT Mathematics - Primary & Middle School",
      school: "Heritage Xperiential Learning School",
      type: "TGT",
      desc: "Heritage School seeks a TGT Maths teacher for primary and middle school sections. B.Sc. Mathematics with B.Ed required. Experience with activity-based learning and NEP 2020 implementation preferred.",
      link: "https://heritageschool.in/work-with-us",
      email: "careers@heritageschool.in",
      source: "LinkedIn",
      url: "https://linkedin.com/jobs/view/tgt-maths-heritage",
      loc: "Sector 62, Gurgaon",
      salary: "5-7 LPA",
      date: "2026-02-08",
    },
    {
      title: "PGT Mathematics - CBSE Senior Secondary",
      school: "Lotus Valley International School",
      type: "PGT",
      desc: "Lotus Valley International School, Gurgaon invites applications for PGT Mathematics. M.Sc. Mathematics with B.Ed essential. Minimum 5 years CBSE teaching experience. Proficiency in smart classroom tools, GeoGebra, and Desmos required.",
      link: "https://www.lotusvalleygurgaon.com/careers-openings.php",
      email: null,
      source: "School Website",
      url: "https://lotusvalleygurgaon.com/careers/pgt-maths-2026",
      loc: "Sector 50, Gurgaon",
      salary: "7-10 LPA",
      date: "2026-02-19",
    },
    {
      title: "Mathematics Teacher (TGT) - Middle School",
      school: "Shiv Nadar School",
      type: "TGT",
      desc: "Shiv Nadar School Gurgaon is hiring a TGT Mathematics for middle school. B.Sc./M.Sc. Maths with B.Ed. Experience with CBSE/ICSE board. Should be innovative and tech-savvy. Competitive salary with benefits.",
      link: "https://shivnadarschool.edu.in/careers",
      email: null,
      source: "School Website",
      url: "https://shivnadarschool.edu.in/careers/tgt-maths-gurgaon",
      loc: "DLF Phase IV, Gurgaon",
      salary: "6-8 LPA",
      date: "2026-02-17",
    },
    {
      title: "PGT Maths - IB Curriculum",
      school: "Lancers International School",
      type: "PGT",
      desc: "Lancers International School requires an experienced PGT Mathematics teacher for IB MYP and DP. Must have strong conceptual knowledge and experience in inquiry-based teaching. M.Sc. Maths required.",
      link: "https://www.lis.ac.in/about-us/careers/",
      email: null,
      source: "School Website",
      url: "https://lis.ac.in/careers/pgt-maths-ib-2026",
      loc: "Sector 53, Gurgaon",
      salary: "10-14 LPA",
      date: "2026-02-20",
    },
    {
      title: "TGT Mathematics - CBSE",
      school: "Amity International School",
      type: "TGT",
      desc: "Amity International School Gurugram is looking for a TGT Mathematics teacher for classes VI-X. B.Sc./M.Sc. Maths with B.Ed required. Minimum 3 years experience in CBSE schools. Knowledge of NEP 2020 framework preferred.",
      link: "https://amityschools.in/gurugram46/vacancies/",
      email: null,
      source: "Naukri",
      url: "https://naukri.com/job/tgt-maths-amity-gurgaon",
      loc: "Sector 46, Gurgaon",
      salary: "5-7 LPA",
      date: "2026-02-14",
    },
    {
      title: "Mathematics Faculty - Senior Secondary",
      school: "GD Goenka World School",
      type: "PGT",
      desc: "GD Goenka World School on Sohna Road requires PGT Maths faculty for classes XI-XII. M.Sc. Mathematics with B.Ed. Must have experience in teaching CBSE board. Knowledge of JEE/competitive exam coaching is a plus.",
      link: "https://gdgws.gdgoenka.com/careers/",
      email: null,
      source: "Indeed",
      url: "https://indeed.co.in/job/maths-faculty-gd-goenka-world",
      loc: "Sohna Road, Gurgaon",
      salary: "8-12 LPA",
      date: "2026-02-16",
    },
    {
      title: "TGT Mathematics Teacher",
      school: "K.R. Mangalam World School",
      type: "TGT",
      desc: "K.R. Mangalam World School Gurgaon has an opening for TGT Mathematics. Candidates must hold B.Sc./M.Sc. in Mathematics with B.Ed. Experience with CBSE pattern and activity-based teaching methodology.",
      link: "https://www.krmangalamgurgaon.com/job-openings/",
      email: null,
      source: "School Website",
      url: "https://krmangalamgurgaon.com/careers/tgt-maths",
      loc: "Sector 41, Gurgaon",
      salary: "4-6 LPA",
      date: "2026-02-11",
    },
    {
      title: "PGT Mathematics - IGCSE & IB",
      school: "Excelsior American School",
      type: "PGT",
      desc: "Excelsior American School seeks a PGT Mathematics teacher experienced in IGCSE and IB curricula. M.Sc. Mathematics required. Should be familiar with CAS, TOK integration. International school experience preferred.",
      link: "https://excelsioramericanschooladmissions.com/careers/",
      email: null,
      source: "LinkedIn",
      url: "https://linkedin.com/jobs/view/pgt-maths-excelsior-gurgaon",
      loc: "Sector 43, Gurgaon",
      salary: "9-13 LPA",
      date: "2026-02-13",
    },
    {
      title: "Maths Teacher - Primary Section",
      school: "Suncity School, Sector 54",
      type: "OTHER",
      desc: "Suncity School Sector 54 is hiring a Mathematics teacher for primary section (Classes I-V). B.Sc. with B.Ed required. Must be enthusiastic and enjoy working with young children. Activity-based learning approach.",
      link: "https://www.suncityschool54.com/careers.php",
      email: null,
      source: "School Website",
      url: "https://suncityschool54.com/careers/maths-primary-2026",
      loc: "Sector 54, Gurgaon",
      salary: "3.5-5 LPA",
      date: "2026-02-09",
    },
    {
      title: "PGT Mathematics",
      school: "Bal Bharati Public School",
      type: "PGT",
      desc: "Bal Bharati Public School Gurgaon requires PGT Mathematics for senior secondary wing. M.Sc. Mathematics with B.Ed and NET/CTET qualification preferred. Experience in CBSE schools with strong result track record.",
      link: "https://bbpsgr.balbharati.org/contact-us-2/careers-with-bbps/",
      email: null,
      source: "Naukri",
      url: "https://naukri.com/job/pgt-maths-bbps-gurgaon",
      loc: "Sector 21, Gurgaon",
      salary: "6-9 LPA",
      date: "2026-02-07",
    },
    {
      title: "Mathematics Teacher (TGT/PGT)",
      school: "Presidium School",
      type: "PGT",
      desc: "Presidium School Gurgaon has openings for Mathematics teachers at TGT and PGT levels. B.Sc./M.Sc. Mathematics with B.Ed. CTET qualified preferred. Should be able to handle classes from VI to XII.",
      link: "https://www.presidiumgurgaon.com/vacancy.php",
      email: "careers@presidiumonline.com",
      source: "School Website",
      url: "https://presidiumgurgaon.com/vacancy/maths-teacher-2026",
      loc: "Sector 57, Gurgaon",
      salary: "5-8 LPA",
      date: "2026-02-06",
    },
    {
      title: "TGT Mathematics - CBSE",
      school: "Ryan International School",
      type: "TGT",
      desc: "Ryan International School Sector 31, Gurgaon requires a TGT Mathematics teacher. B.Sc./M.Sc. Maths with B.Ed. Minimum 2 years experience. Good communication skills and classroom management ability essential.",
      link: "https://www.ryangroup.org/ryaninternational/cbse/gurgaon/ryan-international-school-sector-31/careers/careers-at-ryan",
      email: null,
      source: "Indeed",
      url: "https://indeed.co.in/job/tgt-maths-ryan-gurgaon",
      loc: "Sector 31, Gurgaon",
      salary: "4-6 LPA",
      date: "2026-02-05",
    },
    {
      title: "Mathematics Coordinator & PGT",
      school: "Shikshantar School",
      type: "PGT",
      desc: "Shikshantar School South City is looking for a Mathematics Coordinator cum PGT. M.Sc. Maths with B.Ed and 8+ years teaching experience. Will lead the maths department, mentor teachers, and design curriculum.",
      link: "https://www.shikshantarschool.com/vacancies.html",
      email: null,
      source: "LinkedIn",
      url: "https://linkedin.com/jobs/view/maths-coordinator-shikshantar",
      loc: "South City I, Gurgaon",
      salary: "10-14 LPA",
      date: "2026-02-21",
    },
    {
      title: "TGT Mathematics",
      school: "Blue Bells Model School",
      type: "TGT",
      desc: "Blue Bells Model School Sector 4 has a vacancy for TGT Mathematics. B.Sc. Maths with B.Ed required. CTET qualified preferred. Experience teaching classes VI-X in CBSE school.",
      link: "https://bbms.bluebells.org/current-openings/",
      email: null,
      source: "School Website",
      url: "https://bbms.bluebells.org/openings/tgt-maths-2026",
      loc: "Sector 4, Gurgaon",
      salary: "4-5.5 LPA",
      date: "2026-02-04",
    },
    {
      title: "PGT Mathematics",
      school: "DAV Public School, Sector 14",
      type: "PGT",
      desc: "DAV Public School Sector 14 Gurgaon invites applications for PGT Mathematics. M.Sc. Maths with B.Ed essential. NET/SET qualified candidates preferred. Should have experience in preparing students for board exams.",
      link: "http://www.dav14gurgaon.org/page/jobs.html",
      email: null,
      source: "School Website",
      url: "http://dav14gurgaon.org/jobs/pgt-maths-2026",
      loc: "Sector 14, Gurgaon",
      salary: "5-8 LPA",
      date: "2026-02-03",
    },
    {
      title: "Mathematics Teacher - Cambridge IGCSE",
      school: "GEMS International School",
      type: "PGT",
      desc: "GEMS International School Gurgaon requires a Mathematics teacher for Cambridge IGCSE programme. Must have M.Sc. Mathematics and experience teaching international curriculum. Knowledge of Cambridge assessment framework essential.",
      link: "https://www.gemsinternationalschoolgurgaon.com/career",
      email: null,
      source: "Naukri",
      url: "https://naukri.com/job/maths-igcse-gems-gurgaon",
      loc: "Palam Vihar, Gurgaon",
      salary: "8-11 LPA",
      date: "2026-02-19",
    },
  ];

  console.log("Seeding jobs...");
  for (const j of seedJobs) {
    const ch = hash(j.title + "|" + j.school + "|" + j.url);
    await c.execute({
      sql: "INSERT OR IGNORE INTO jobs (title, school_name, job_type, subject, description, apply_link, apply_email, source, source_url, location, salary_info, posted_date, content_hash) VALUES (?, ?, ?, 'Mathematics', ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        j.title,
        j.school,
        j.type,
        j.desc,
        j.link,
        j.email,
        j.source,
        j.url,
        j.loc,
        j.salary,
        j.date,
        ch,
      ],
    });
  }

  const res = await c.execute("SELECT count(*) as cnt FROM jobs");
  console.log("Jobs in Turso DB:", res.rows[0].cnt);
  console.log("Done!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
