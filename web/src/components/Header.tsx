import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">&#x1F4D0;</span>
          <span className="text-lg font-bold text-foreground">{SITE_NAME}</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/subscribe"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Get Alerts
          </Link>
        </nav>
      </div>
    </header>
  );
}
