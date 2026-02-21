import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobs, subscribers, notificationsLog } from "@/lib/schema";
import { eq, and, sql, notInArray } from "drizzle-orm";
import { resend, FROM_EMAIL } from "@/lib/email";
import { jobAlertEmailHtml } from "@/emails/JobAlertEmail";
import { SITE_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.NOTIFY_API_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all verified subscribers
    const verifiedSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.isVerified, true));

    if (verifiedSubscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify", sent: 0 });
    }

    let totalSent = 0;

    for (const subscriber of verifiedSubscribers) {
      // Find jobs not yet sent to this subscriber
      const sentJobIds = await db
        .select({ jobId: notificationsLog.jobId })
        .from(notificationsLog)
        .where(eq(notificationsLog.subscriberId, subscriber.id));

      const sentIds = sentJobIds.map((r) => r.jobId);

      let newJobsQuery = db
        .select()
        .from(jobs)
        .where(eq(jobs.isActive, true));

      const newJobs = sentIds.length > 0
        ? await db
            .select()
            .from(jobs)
            .where(
              and(eq(jobs.isActive, true), notInArray(jobs.id, sentIds))
            )
        : await newJobsQuery;

      if (newJobs.length === 0) continue;

      // Filter by preferences if set
      let matchedJobs = newJobs;
      if (subscriber.preferences) {
        const prefs = subscriber.preferences as {
          jobTypes?: string[];
          schools?: string[];
        };
        if (prefs.jobTypes && prefs.jobTypes.length > 0) {
          matchedJobs = matchedJobs.filter((j) =>
            prefs.jobTypes!.includes(j.jobType)
          );
        }
        if (prefs.schools && prefs.schools.length > 0) {
          matchedJobs = matchedJobs.filter((j) =>
            prefs.schools!.some((s) =>
              j.schoolName.toLowerCase().includes(s.toLowerCase())
            )
          );
        }
      }

      if (matchedJobs.length === 0) continue;

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: `${matchedJobs.length} New Maths Teaching Job${matchedJobs.length > 1 ? "s" : ""} - ${SITE_NAME}`,
          html: jobAlertEmailHtml(matchedJobs, subscriber.unsubscribeToken),
        });

        // Log notifications
        for (const job of matchedJobs) {
          await db
            .insert(notificationsLog)
            .values({
              subscriberId: subscriber.id,
              jobId: job.id,
              status: "sent",
            })
            .onConflictDoNothing();
        }

        totalSent++;
      } catch (emailError) {
        console.error(
          `Failed to send to ${subscriber.email}:`,
          emailError
        );
        for (const job of matchedJobs) {
          await db
            .insert(notificationsLog)
            .values({
              subscriberId: subscriber.id,
              jobId: job.id,
              status: "failed",
            })
            .onConflictDoNothing();
        }
      }
    }

    return NextResponse.json({
      message: `Notifications sent to ${totalSent} subscribers`,
      sent: totalSent,
    });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Notification process failed" },
      { status: 500 }
    );
  }
}
