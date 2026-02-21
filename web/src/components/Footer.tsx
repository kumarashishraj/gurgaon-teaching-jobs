import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-foreground">{SITE_NAME}</p>
            <p className="text-sm text-muted mt-1">
              Aggregating TGT &amp; PGT Maths teaching openings across Gurgaon
              private schools.
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link
              href="/subscribe"
              className="hover:text-foreground transition-colors"
            >
              Email Alerts
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Updated every 6 hours.
        </div>
      </div>
    </footer>
  );
}
