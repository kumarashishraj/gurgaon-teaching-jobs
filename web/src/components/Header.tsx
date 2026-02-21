import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

function Logo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo"
    >
      {/* Graduation cap */}
      <path
        d="M18 6L3 14L18 22L33 14L18 6Z"
        fill="url(#grad1)"
        stroke="#1e40af"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 18V26C9 26 13 30 18 30C23 30 27 26 27 26V18"
        stroke="#1e40af"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#grad2)"
        fillOpacity="0.3"
      />
      {/* Tassel */}
      <path
        d="M30 14V24"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="25" r="1.5" fill="#f59e0b" />
      {/* Math symbol (pi) */}
      <text
        x="18"
        y="25"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#1e40af"
        fontFamily="serif"
      >
        π
      </text>
      <defs>
        <linearGradient id="grad1" x1="3" y1="6" x2="33" y2="22">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="grad2" x1="9" y1="18" x2="27" y2="30">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="header-gradient sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
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
