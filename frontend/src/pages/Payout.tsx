import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const PAYPAL_FEE_RATE = 0.02;

const PAYOUT_STATUS_STYLE: Record<string, string> = {
  sent:    "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/25",
  failed:  "bg-[var(--destructive-bg)] text-[var(--destructive)] border-[var(--destructive)]/25",
  pending: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25",
};

const PAYOUT_STATUS_LABEL: Record<string, string> = {
  sent: "Sent",
  failed: "Failed",
  pending: "Pending review",
};

export default function Payout() {
  const [earnings, setEarnings] = useState<any>(null);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/earnings")
      .then((res) => res.json())
      .then(setEarnings)
      .catch(() => setError("Failed to load balance"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paypalEmail) { setError("PayPal email is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchApi("/api/payouts/request", {
        method: "POST",
        body: JSON.stringify({ paypal_email: paypalEmail, amount_cad: available }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-3">
          <div className="h-5 w-28 rounded bg-[var(--secondary)] animate-pulse" />
          <div className="h-28 rounded-xl bg-[var(--secondary)] animate-pulse" />
          <div className="h-40 rounded-xl bg-[var(--secondary)] animate-pulse" />
        </main>
      </div>
    );
  }

  const available = earnings?.summary?.available_cad ?? 0;
  const canPayout = available >= 5;
  const feeAmount = available * PAYPAL_FEE_RATE;
  const availableCredits = Math.round(available * 100);

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        <Link
          to="/earnings"
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1.5 mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Earnings
        </Link>

        <h1 className="text-xl font-bold mb-6">Request payout</h1>

        {/* Balance card */}
        <div className="rounded-xl border bg-[var(--surface)] mb-5 overflow-hidden">
          {canPayout ? (
            <div className="border-[var(--success)]/30 border">
              <div className="px-5 pt-5 pb-4">
                <p className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                  Available balance
                </p>
                <p className="text-3xl font-bold tabular-nums text-[var(--success)] leading-tight">
                  ${available.toFixed(2)}
                  <span className="text-base font-medium text-[var(--foreground-muted)] ml-2">CAD</span>
                </p>
                <p className="text-sm text-[var(--foreground-faint)] mt-1 tabular-nums">
                  {availableCredits} Credits
                </p>
              </div>
              <div className="border-t border-[var(--border)] px-5 py-3 flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">PayPal processing fee</span>
                <span className="text-[var(--foreground-faint)]">Covered by EarnStack (~${feeAmount.toFixed(2)})</span>
              </div>
            </div>
          ) : (
            <div className="border-[var(--border)] border p-5">
              <p className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                Available balance
              </p>
              <p className="text-3xl font-bold tabular-nums text-[var(--foreground)] leading-tight">
                ${available.toFixed(2)}
                <span className="text-base font-medium text-[var(--foreground-muted)] ml-2">CAD</span>
              </p>
              <p className="text-sm text-[var(--foreground-faint)] mt-1 tabular-nums">
                {availableCredits} Credits
              </p>
              <p className="text-sm text-[var(--warning)] mt-3 font-medium">
                Minimum payout is $5.00 CAD &mdash; keep completing tasks.
              </p>
            </div>
          )}
        </div>

        {/* Review notice — always visible */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)] mb-6">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            Payouts are reviewed manually before release. Once approved, funds are sent to your PayPal within <strong className="text-[var(--foreground)]">1–2 business days</strong>. Review helps keep the platform fair and secure.
          </p>
        </div>

        {success ? (
          <div className="p-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success-bg)] text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--success)]/10 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-[var(--success)] mb-2">Payout requested</h2>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              Your request is in the review queue. Once approved, funds will be sent to{" "}
              <strong className="text-[var(--foreground)]">{paypalEmail}</strong> via PayPal.
            </p>
            <p className="text-xs text-[var(--foreground-faint)] mt-3">
              Review typically takes 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[var(--destructive-bg)] border border-[var(--destructive)]/20 text-[var(--destructive)] text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="paypal-email" className="block text-sm font-semibold mb-1.5">
                PayPal email
              </label>
              <input
                id="paypal-email"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                required
                disabled={!canPayout}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 disabled:opacity-50 transition-colors"
                placeholder="your@paypal.com"
                autoComplete="email"
              />
              <p className="text-xs text-[var(--foreground-faint)] mt-1.5">
                Must match your PayPal account exactly.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !canPayout}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting…" : `Request $${Math.max(available, 0).toFixed(2)} CAD`}
            </button>

            <p className="text-xs text-[var(--foreground-faint)] text-center leading-relaxed">
              Earnings may be taxable under CRA guidelines.
            </p>
          </form>
        )}

        {/* Payout history */}
        {earnings?.payouts?.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest mb-3">
              Payout history
            </p>
            <div className="space-y-2">
              {earnings.payouts.map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm tabular-nums">${p.amount_cad.toFixed(2)} CAD</p>
                    <p className="text-xs text-[var(--foreground-faint)] mt-0.5 truncate">{p.paypal_email}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium ${
                        PAYOUT_STATUS_STYLE[p.status] ?? "bg-[var(--secondary)] text-[var(--foreground-muted)] border-transparent"
                      }`}
                    >
                      {PAYOUT_STATUS_LABEL[p.status] ?? p.status}
                    </span>
                    <p className="text-xs text-[var(--foreground-faint)] mt-1">
                      {new Date(p.requested_at).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
