import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe",
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Invalid Link</h1>
        <p className="mt-2 text-muted">
          This unsubscribe link is missing a token.
        </p>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${siteUrl}/api/unsubscribe?token=${token}`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json();

  if (!res.ok) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800">
            Unsubscribe Failed
          </h1>
          <p className="mt-2 text-red-700">
            {data.error || "This link may be invalid."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground">Unsubscribed</h1>
        <p className="mt-2 text-muted">
          You&apos;ve been removed from job alerts. You won&apos;t receive any
          more emails from us.
        </p>
      </div>
      <Link
        href="/subscribe"
        className="inline-block mt-6 text-primary hover:text-primary-dark font-medium transition-colors"
      >
        Changed your mind? Subscribe again &rarr;
      </Link>
    </div>
  );
}
