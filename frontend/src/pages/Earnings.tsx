import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25",
  approved: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/25",
  rejected: "bg-[var(--destructive-bg)] text-[var(--destructive)] border-[var(--destructive)]/25",
};

const STATUS_LABEL: Record<string, string> = {
  pending:  "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function Earnings() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi("/api/earnings")
      .then((res) => res.json())
      .then(setEarnings)
      .catch(() => setError("Failed to load earnings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          <div className="h-5 w-32 rounded bg-[var(--secondary)] animate-pulse" />
          <div className="h-20 rounded-xl bg-[var(--secondary)] animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[var(--secondary)] animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-[var(--destructive)] text-sm">{error || "Could not load earnings"}</p>
        </main>
      </div>
    );
  }

  const { pending_cad, available_cad, total_earned_cad } = earnings.summary;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Earnings</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Your task completion ledger</p>
          </div>
          <Link
            to="/payout"
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] transition-colors"
          >
            Cash out
          </Link>
        </div>

        {/* Summary strip */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] sm:grid sm:grid-cols-3 mb-8 overflow-hidden">
          <SummaryCell
            label="Pending review"
            value={pending_cad}
            credits={Math.round(pending_cad * 100)}
            color="warning"
          />
          <SummaryCell
            label="Available"
            value={available_cad}
            credits={Math.round(available_cad * 100)}
            color="success"
          />
          <SummaryCell
            label="Lifetime total"
            value={total_earned_cad}
            credits={Math.round(total_earned_cad * 100)}
            color="default"
          />
        </div>

        {/* Ledger */}
        {earnings.completions.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary)] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <p className="font-semibold text-[var(--foreground)]">No completed tasks yet</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Complete a task to see your earnings here.</p>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline text-sm mt-4 font-medium"
            >
              Browse tasks
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {earnings.completions.map((c: any) => (
              <LedgerRow key={c.id} entry={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  credits,
  color,
}: {
  label: string;
  value: number;
  credits: number;
  color: "warning" | "success" | "default";
}) {
  const valueColor =
    color === "warning"
      ? "text-[var(--warning)]"
      : color === "success"
      ? "text-[var(--success)]"
      : "text-[var(--foreground)]";

  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="text-xs text-[var(--foreground-muted)] mb-2">{label}</p>
      <p className={`text-xl font-bold tabular-nums leading-tight ${valueColor}`}>
        ${value.toFixed(2)}
      </p>
      <p className="text-xs text-[var(--foreground-faint)] mt-0.5 tabular-nums">
        {credits} Credits
      </p>
    </div>
  );
}

function LedgerRow({ entry: c }: { entry: any }) {
  const credits = Math.round(c.payout_cad * 100);
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm truncate leading-snug">{c.task_title}</h3>
          <p className="text-xs text-[var(--foreground-faint)] mt-0.5">
            {new Date(c.completed_at).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-semibold text-sm tabular-nums leading-tight">
            ${c.payout_cad.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--foreground-faint)] tabular-nums">
            {credits} Credits
          </p>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1.5 font-medium ${
              STATUS_STYLE[c.status] ?? "bg-[var(--secondary)] text-[var(--foreground-muted)] border-transparent"
            }`}
          >
            {STATUS_LABEL[c.status] ?? c.status}
          </span>
        </div>
      </div>
      {c.review_note && (
        <p className="text-xs text-[var(--foreground-muted)] mt-3 pt-3 border-t border-[var(--border)] leading-relaxed">
          {c.review_note}
        </p>
      )}
    </div>
  );
}
