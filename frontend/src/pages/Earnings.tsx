import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
  approved: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
  rejected: "bg-[var(--destructive-bg)] text-[var(--destructive)] border-[var(--destructive)]/20",
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
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-3">
            <div className="h-6 w-40 rounded bg-[var(--secondary)] animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-[var(--secondary)] animate-pulse" />)}
            </div>
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

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Earnings</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Your task completion ledger</p>
          </div>
          <Link
            to="/payout"
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] transition-colors"
          >
            Cash Out
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <SummaryCard
            label="Pending review"
            value={earnings.summary.pending_cad}
            color="warning"
          />
          <SummaryCard
            label="Available"
            value={earnings.summary.available_cad}
            color="success"
          />
          <SummaryCard
            label="Total earned"
            value={earnings.summary.total_earned_cad}
            color="default"
          />
        </div>

        {earnings.completions.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary)] mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <p className="font-medium">No completed tasks yet</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Complete a task to see your earnings here.</p>
            <Link to="/tasks" className="text-[var(--primary)] hover:underline text-sm mt-3 inline-block font-medium">
              Browse tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {earnings.completions.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm truncate">{c.task_title}</h3>
                    <p className="text-xs text-[var(--foreground-faint)] mt-0.5">
                      {new Date(c.completed_at).toLocaleDateString("en-CA")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="font-semibold text-sm">${c.payout_cad.toFixed(2)}</span>
                    <span className={`block text-xs px-2 py-0.5 rounded-full border mt-1 ${STATUS_STYLE[c.status] || "bg-[var(--secondary)] text-[var(--foreground-muted)]"}`}>
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </div>
                </div>
                {c.review_note && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-2.5 pt-2.5 border-t border-[var(--border)]">
                    {c.review_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: "warning" | "success" | "default" }) {
  const textColor = color === "warning" ? "text-[var(--warning)]" : color === "success" ? "text-[var(--success)]" : "text-[var(--foreground)]";
  return (
    <div className="p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
      <p className="text-xs text-[var(--foreground-muted)] mb-1 leading-tight">{label}</p>
      <p className={`text-lg sm:text-xl font-bold tabular-nums ${textColor}`}>${value.toFixed(2)}</p>
    </div>
  );
}
