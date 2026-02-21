export const SITE_NAME = "Gurgaon Maths Teaching Jobs";
export const SITE_DESCRIPTION =
  "Find TGT & PGT Maths teaching jobs in Gurgaon private schools. All openings aggregated in one place with email alerts.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const JOBS_PER_PAGE = 12;

export const JOB_TYPES = ["TGT", "PGT", "OTHER"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const BOARDS = ["CBSE", "ICSE", "IB", "IGCSE", "State Board"] as const;
export type Board = (typeof BOARDS)[number];

export const RELEVANCE_TIERS = ["Hot", "Top School", "New", "Featured"] as const;
export type RelevanceTier = (typeof RELEVANCE_TIERS)[number];

// School ranking tiers for relevance scoring
export const TOP_SCHOOLS = [
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

export const SOURCES = [
  "Google",
  "School Website",
  "Naukri",
  "Indeed",
  "LinkedIn",
] as const;
