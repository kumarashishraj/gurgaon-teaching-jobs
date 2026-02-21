import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Unsubscribe token is required" },
        { status: 400 }
      );
    }

    const subscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.unsubscribeToken, token))
      .get();

    if (!subscriber) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 404 }
      );
    }

    await db.delete(subscribers).where(eq(subscribers.id, subscriber.id));

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Unsubscribe failed. Please try again." },
      { status: 500 }
    );
  }
}
