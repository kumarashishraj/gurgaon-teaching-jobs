const { createClient } = require("@libsql/client");

const c = createClient({
  url: "libsql://gurgaon-teaching-jobs-ashishraj.aws-ap-south-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE2NTkwNjgsImlkIjoiMTY5ZGU1YTctZmY1MC00ODM2LWI4YmYtMmZmMzkyMGU1NjQ4IiwicmlkIjoiNDMzNzRmYWEtYzFjMS00ZmVhLTg0NWItYzJlNzZiMDg2MmZiIn0.sFfidFXujud_8aL00MElQr51y5byFzUekmmI5SdsWTGS42qe2UWEhtswJ_pPZ-X_4Brb0TYRW7vDHlRrGAnbCw",
});

async function run() {
  // Add new columns
  console.log("Adding relevance column...");
  await c.execute("ALTER TABLE jobs ADD COLUMN relevance TEXT").catch(() => {
    console.log("  Column already exists, skipping");
  });

  console.log("Adding contact_phone column...");
  await c
    .execute("ALTER TABLE jobs ADD COLUMN contact_phone TEXT")
    .catch(() => {
      console.log("  Column already exists, skipping");
    });

  console.log("Adding contact_email column...");
  await c
    .execute("ALTER TABLE jobs ADD COLUMN contact_email TEXT")
    .catch(() => {
      console.log("  Column already exists, skipping");
    });

  // School contact data (HR/reception phone + email)
  const schoolContacts = {
    "DPS Gurgaon": {
      phone: "0124-4125800",
      email: "dpsgurgaon1@gmail.com",
    },
    "DPS Gurugram": {
      phone: "0124-4125800",
      email: "dpsgurgaon1@gmail.com",
    },
    "DPS Sushant Lok": {
      phone: "0124-4112643",
      email: "info@dpssushantlok.com",
    },
    "DPS International": {
      phone: "0124-4575100",
      email: "info@dpsinternational.in",
    },
    "The Shri Ram School": {
      phone: "0124-4784300",
      email: "senior.aravali@tsrs.org",
    },
    "Pathways School Gurgaon": {
      phone: "0124-4513000",
      email: "admissions@pathways.in",
    },
    "Pathways World School": {
      phone: "0124-4513000",
      email: "info@pathways.in",
    },
    "Scottish High International School": {
      phone: "0124-4112781",
      email: "recruitment@scottishigh.com",
    },
    "Heritage Xperiential Learning School": {
      phone: "0124-4566777",
      email: "info@heritagexperiential.com",
    },
    "Suncity School": {
      phone: "0124-4222347",
      email: "info@suncityschool.in",
    },
    "GD Goenka Public School": {
      phone: "0124-2580765",
      email: "info@gdgoenkagurgaon.in",
    },
    "GD Goenka World School": {
      phone: "0124-3315900",
      email: "info@gdgws.gdgoenka.com",
    },
    "Shiv Nadar School": {
      phone: "0124-4735100",
      email: "admissions.gurgaon@shivnadarschool.edu.in",
    },
    "Lotus Valley International School": {
      phone: "0124-4987200",
      email: "info@lotusvalley.org",
    },
    "DAV Public School": {
      phone: "0124-2384710",
      email: "davpublicschool.gurgaon@gmail.com",
    },
    "Presidium School": {
      phone: "011-42424242",
      email: "hr@presidium.com",
    },
    "Blue Bells Model School": {
      phone: "0124-2301722",
      email: "bluebellsgurgaon@gmail.com",
    },
    "K.R. Mangalam World School": {
      phone: "011-47042200",
      email: "southcity.career@krmangalam.com",
    },
    "Amity International School": {
      phone: "0124-2329060",
      email: "info@amitygurgaon.com",
    },
    "Amity Global School": {
      phone: "0124-4744800",
      email: "principal@amityglobal.edu.in",
    },
    "Shikshantar School": {
      phone: "0124-4573300",
      email: "info@shikshantarschool.com",
    },
    "Bal Bharati Public School": {
      phone: "0124-4040800",
      email: "mail@bbpsgurgaon.org",
    },
    "VIBGYOR High": {
      phone: "1800-266-3555",
      email: "careers@vibgyorgroup.com",
    },
    "Lancers International School": {
      phone: "0124-4222244",
      email: "info@lancersinternational.com",
    },
    "Excelsior American School": {
      phone: "0124-4260001",
      email: "info@excelsioramerican.com",
    },
    "Ryan International School": {
      phone: "0124-4174444",
      email: "info@ryaninternational.org",
    },
    "GEMS International School": {
      phone: "0124-4800100",
      email: "info@gemsinternational.edu.in",
    },
    "Alpine Convent School": {
      phone: "0124-4017900",
      email: "info@alpineconventschool.com",
    },
    "Vega Schools": {
      phone: "9999-450-460",
      email: "info@vegaschools.com",
    },
    "Kunskapsskolan": {
      phone: "0124-4574200",
      email: "info.gurgaon@kunskapsskolan.org.in",
    },
    "Paras World School": {
      phone: "0124-4545300",
      email: "info@parasworldschool.com",
    },
    "Orchids The International School": {
      phone: "1800-102-4040",
      email: "careers@orchids.edu.in",
    },
    "Greenwood Public School": {
      phone: "0124-2370366",
      email: "info@greenwoodpublicschool.com",
    },
    "St. Xavier's High School": {
      phone: "0124-2380756",
      email: "sxhsgurgaon@gmail.com",
    },
    "Manav Rachna International School": {
      phone: "0129-4198100",
      email: "info@manavrachnainternational.com",
    },
    "Salwan Public School": {
      phone: "0124-2580044",
      email: "salwanpsgurgaon@gmail.com",
    },
    "Shalom Hills International School": {
      phone: "0124-4072222",
      email: "info@shalomhills.com",
    },
    "The HDFC School": {
      phone: "0124-4866700",
      email: "admissions@thehdfcschool.com",
    },
    "Satya School": {
      phone: "0124-4744400",
      email: "info@satyaschool.in",
    },
    "The Ardee School": {
      phone: "0124-4120700",
      email: "info@theardeeschool.com",
    },
    "Prudence School": {
      phone: "0124-4061800",
      email: "info@prudenceschools.com",
    },
    "Gurugram Public School": {
      phone: "0124-2325015",
      email: "info@gurugrampublicschool.com",
    },
    "Ambience Public School": {
      phone: "0124-4545100",
      email: "info@ambiencepublicschool.com",
    },
  };

  // Top schools list for relevance scoring
  const topSchools = [
    "DPS Gurgaon",
    "DPS International",
    "The Shri Ram School",
    "Pathways School Gurgaon",
    "Pathways World School",
    "Scottish High International School",
    "Heritage Xperiential Learning School",
    "Shiv Nadar School",
    "Suncity School",
    "GD Goenka World School",
    "Lancers International School",
    "Lotus Valley International School",
    "Shikshantar School",
    "The HDFC School",
    "Satya School",
  ];

  // Update contact info for existing jobs
  console.log("Updating contact info for existing jobs...");
  for (const [school, contact] of Object.entries(schoolContacts)) {
    await c.execute({
      sql: "UPDATE jobs SET contact_phone = ?, contact_email = ? WHERE school_name LIKE ? AND contact_phone IS NULL",
      args: [contact.phone, contact.email, `%${school}%`],
    });
  }

  // Set relevance: "Top School" for top-tier schools
  console.log("Setting relevance for top schools...");
  for (const school of topSchools) {
    await c.execute({
      sql: "UPDATE jobs SET relevance = 'Top School' WHERE school_name LIKE ? AND relevance IS NULL",
      args: [`%${school}%`],
    });
  }

  // Set relevance: "Hot" for jobs posted in last 7 days
  console.log("Setting relevance for recent jobs...");
  await c.execute(
    "UPDATE jobs SET relevance = 'Hot' WHERE relevance IS NULL AND posted_date >= date('now', '-7 days')"
  );

  // Set relevance: "New" for jobs posted in last 14 days (not already marked)
  await c.execute(
    "UPDATE jobs SET relevance = 'New' WHERE relevance IS NULL AND posted_date >= date('now', '-14 days')"
  );

  // Verify results
  const contactRes = await c.execute(
    "SELECT school_name, contact_phone, contact_email, relevance FROM jobs"
  );
  console.log("\nJobs with contact info:");
  for (const row of contactRes.rows) {
    console.log(
      `  ${row.school_name}: phone=${row.contact_phone || "N/A"}, email=${row.contact_email || "N/A"}, relevance=${row.relevance || "N/A"}`
    );
  }

  const relevanceRes = await c.execute(
    "SELECT relevance, count(*) as cnt FROM jobs GROUP BY relevance"
  );
  console.log("\nRelevance distribution:");
  for (const row of relevanceRes.rows) {
    console.log(`  ${row.relevance || "None"}: ${row.cnt}`);
  }

  console.log("\nDone!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
