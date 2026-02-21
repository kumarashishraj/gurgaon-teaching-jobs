const { createClient } = require("@libsql/client");

const c = createClient({
  url: "libsql://gurgaon-teaching-jobs-ashishraj.aws-ap-south-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE2NTkwNjgsImlkIjoiMTY5ZGU1YTctZmY1MC00ODM2LWI4YmYtMmZmMzkyMGU1NjQ4IiwicmlkIjoiNDMzNzRmYWEtYzFjMS00ZmVhLTg0NWItYzJlNzZiMDg2MmZiIn0.sFfidFXujud_8aL00MElQr51y5byFzUekmmI5SdsWTGS42qe2UWEhtswJ_pPZ-X_4Brb0TYRW7vDHlRrGAnbCw",
});

async function run() {
  // Add board column
  console.log("Adding board column...");
  await c.execute("ALTER TABLE jobs ADD COLUMN board TEXT").catch(() => {
    console.log("  Column already exists, skipping");
  });

  // Map schools to their boards
  const boardMap = {
    "DPS Gurgaon": "CBSE",
    "DPS Gurugram": "CBSE",
    "DPS Sushant Lok": "CBSE",
    "DPS International": "IB",
    "The Shri Ram School": "CBSE",
    "Pathways School Gurgaon": "IB",
    "Pathways World School": "IB",
    "Scottish High International School": "CBSE",
    "Heritage Xperiential Learning School": "CBSE",
    "Suncity School": "CBSE",
    "GD Goenka Public School": "CBSE",
    "GD Goenka World School": "CBSE",
    "Shiv Nadar School": "CBSE",
    "Lotus Valley International School": "CBSE",
    "DAV Public School": "CBSE",
    "Presidium School": "CBSE",
    "Blue Bells Model School": "CBSE",
    "K.R. Mangalam World School": "CBSE",
    "Amity International School": "CBSE",
    "Amity Global School": "CBSE",
    "Shikshantar School": "CBSE",
    "Bal Bharati Public School": "CBSE",
    "VIBGYOR High": "CBSE",
    "Lancers International School": "IB",
    "Excelsior American School": "IGCSE",
    "Ryan International School": "CBSE",
    "GEMS International School": "IGCSE",
    "Alpine Convent School": "CBSE",
    "Vega Schools": "CBSE",
    "Kunskapsskolan": "CBSE",
    "Paras World School": "CBSE",
    "Orchids The International School": "CBSE",
    "Greenwood Public School": "CBSE",
    "St. Xavier's High School": "ICSE",
    "Manav Rachna International School": "CBSE",
    "Salwan Public School": "CBSE",
    "Shalom Hills International School": "CBSE",
    "The HDFC School": "CBSE",
    "Satya School": "IB",
    "The Ardee School": "CBSE",
    "Prudence School": "CBSE",
    "Gurugram Public School": "CBSE",
    "Ambience Public School": "CBSE",
  };

  // Update existing jobs based on school name
  console.log("Updating board for existing jobs...");
  for (const [school, board] of Object.entries(boardMap)) {
    const result = await c.execute({
      sql: "UPDATE jobs SET board = ? WHERE school_name LIKE ? AND board IS NULL",
      args: [board, `%${school}%`],
    });
  }

  // Also infer board from title/description for remaining jobs
  await c.execute(
    "UPDATE jobs SET board = 'IB' WHERE board IS NULL AND (title LIKE '%IB %' OR title LIKE '%IB Diploma%' OR description LIKE '%IB curriculum%' OR description LIKE '%IB MYP%' OR description LIKE '%IB DP%')"
  );
  await c.execute(
    "UPDATE jobs SET board = 'IGCSE' WHERE board IS NULL AND (title LIKE '%IGCSE%' OR description LIKE '%IGCSE%' OR title LIKE '%Cambridge%' OR description LIKE '%Cambridge%')"
  );
  await c.execute(
    "UPDATE jobs SET board = 'ICSE' WHERE board IS NULL AND (title LIKE '%ICSE%' OR description LIKE '%ICSE%' OR title LIKE '%ISC%')"
  );
  await c.execute(
    "UPDATE jobs SET board = 'CBSE' WHERE board IS NULL AND (title LIKE '%CBSE%' OR description LIKE '%CBSE%')"
  );

  const res = await c.execute(
    "SELECT board, count(*) as cnt FROM jobs GROUP BY board"
  );
  console.log("Board distribution:");
  for (const row of res.rows) {
    console.log(`  ${row.board || "Unknown"}: ${row.cnt}`);
  }

  console.log("Done!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
