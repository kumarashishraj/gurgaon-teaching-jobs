import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const FROM_EMAIL =
  process.env.FROM_EMAIL || "alerts@gurgaon-teaching-jobs.com";
