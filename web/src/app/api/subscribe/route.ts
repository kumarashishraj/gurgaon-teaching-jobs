import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/tokens";
import { resend, FROM_EMAIL } from "@/lib/email";
import { verificationEmailHtml } from "@/emails/VerificationEmail";
import { SITE_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase().trim()))
      .get();

    if (existing?.isVerified) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    const verificationToken = generateToken();
    const unsubscribeToken = generateToken();

    if (existing) {
      await db
        .update(subscribers)
        .set({
          verificationToken,
          preferences: preferences || existing.preferences,
        })
        .where(eq(subscribers.id, existing.id));
    } else {
      await db.insert(subscribers).values({
        email: email.toLowerCase().trim(),
        verificationToken,
        unsubscribeToken,
        preferences: preferences || null,
      });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email.toLowerCase().trim(),
      subject: `Verify your email - ${SITE_NAME}`,
      html: verificationEmailHtml(verificationToken),
    });

    return NextResponse.json({
      message: "Check your email to verify your subscription!",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
