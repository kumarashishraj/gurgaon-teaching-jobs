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

export const SOURCES = [
  "Google",
  "School Website",
  "Naukri",
  "Indeed",
  "LinkedIn",
] as const;
