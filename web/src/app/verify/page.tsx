import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function VerifyPage({
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
          This verification link is missing a token. Please check your email and
          try again.
        </p>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${siteUrl}/api/verify?token=${token}`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (!res.ok) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800">
            Verification Failed
          </h1>
          <p className="mt-2 text-red-700">
            {data.error || "This link may be invalid or expired."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="mt-3 text-2xl font-bold text-green-800">
          Email Verified!
        </h1>
        <p className="mt-2 text-green-700">
          You&apos;ll now receive alerts when new Maths teaching jobs are posted
          in Gurgaon.
        </p>
      </div>
      <Link
        href="/"
        className="inline-block mt-6 text-primary hover:text-primary-dark font-medium transition-colors"
      >
        Browse Current Jobs &rarr;
      </Link>
    </div>
  );
}
