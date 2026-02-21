import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Job } from "@/lib/schema";

export function jobAlertEmailHtml(
  newJobs: Job[],
  unsubscribeToken: string
): string {
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;

  const jobsHtml = newJobs
    .map(
      (job) => `
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <h3 style="margin: 0 0 4px; color: #0f172a;">
        <a href="${SITE_URL}/jobs/${job.id}" style="color: #1d4ed8; text-decoration: none;">${job.title}</a>
      </h3>
      <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">${job.schoolName} &middot; ${job.location}</p>
      <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; ${
        job.jobType === "PGT"
          ? "background: #f3e8ff; color: #7c3aed;"
          : job.jobType === "TGT"
            ? "background: #dbeafe; color: #1d4ed8;"
            : "background: #f1f5f9; color: #64748b;"
      }">${job.jobType}</span>
      ${job.salaryInfo ? `<span style="margin-left: 8px; font-size: 13px; color: #64748b;">${job.salaryInfo}</span>` : ""}
      ${job.description ? `<p style="margin: 10px 0 0; font-size: 14px; color: #334155; line-height: 1.5;">${job.description.slice(0, 200)}${job.description.length > 200 ? "..." : ""}</p>` : ""}
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0f172a;">
  <h2 style="color: #1d4ed8;">${newJobs.length} New Maths Teaching Job${newJobs.length > 1 ? "s" : ""} in Gurgaon</h2>
  <p>Here are the latest openings we found for you:</p>
  ${jobsHtml}
  <p style="text-align: center; margin: 24px 0;">
    <a href="${SITE_URL}" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      View All Jobs
    </a>
  </p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
  <p style="color: #64748b; font-size: 12px; text-align: center;">
    ${SITE_NAME} &middot;
    <a href="${unsubscribeUrl}" style="color: #64748b;">Unsubscribe</a>
  </p>
</body>
</html>`;
}
