import SubscribeForm from "@/components/SubscribeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe for Job Alerts",
  description:
    "Get email alerts when new TGT/PGT Maths teaching jobs are posted in Gurgaon schools.",
};

export default function SubscribePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Get Job Alerts
        </h1>
        <p className="mt-2 text-muted">
          Receive email notifications when new Maths teaching positions are
          posted. We check for new openings every 6 hours.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <SubscribeForm />
      </div>

      <p className="mt-4 text-xs text-muted text-center">
        You can unsubscribe at any time. We only send job alerts, never spam.
      </p>
    </div>
  );
}
