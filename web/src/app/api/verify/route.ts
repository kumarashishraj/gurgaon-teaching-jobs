import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const subscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.verificationToken, token))
      .get();

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 404 }
      );
    }

    if (subscriber.isVerified) {
      return NextResponse.json({ message: "Email already verified" });
    }

    await db
      .update(subscribers)
      .set({
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      })
      .where(eq(subscribers.id, subscriber.id));

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
