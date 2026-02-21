"use client";

import { useState } from "react";
import { JOB_TYPES } from "@/lib/constants";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          preferences: { jobTypes: jobTypes.length > 0 ? jobTypes : undefined },
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Check your email to verify your subscription!");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="mx-auto h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-3 text-lg font-semibold text-green-800">
          Check your email!
        </h3>
        <p className="mt-1 text-sm text-green-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-card text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Job types (optional)
        </label>
        <div className="flex gap-3">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={jobTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setJobTypes([...jobTypes, type]);
                  } else {
                    setJobTypes(jobTypes.filter((t) => t !== type));
                  }
                }}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe for Job Alerts"}
      </button>
    </form>
  );
}
