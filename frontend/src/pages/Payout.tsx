import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const PAYPAL_FEE_RATE = 0.02;

const PAYOUT_STATUS_STYLE: Record<string, string> = {
  sent:    "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
  failed:  "bg-[var(--destructive-bg)] text-[var(--destructive)] border-[var(--destructive)]/20",
  pending: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
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
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-36 rounded-xl bg-[var(--secondary)] animate-pulse" />
        </main>
      </div>
    );
  }

  const available = earnings?.summary?.available_cad ?? 0;
  const canPayout = available >= 5;
  const feeAmount = available * PAYPAL_FEE_RATE;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/earnings" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Earnings
        </Link>

        <h1 className="text-xl font-bold mb-6">Request payout</h1>

        {/* Balance card */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--foreground-muted)]">Available balance</span>
            <span className="text-2xl font-bold tabular-nums text-[var(--success)]">${available.toFixed(2)} CAD</span>
          </div>
          {canPayout ? (
            <div className="pt-3 border-t border-[var(--border)] space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">You receive</span>
                <span className="font-medium tabular-nums">${available.toFixed(2)} CAD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">PayPal processing fee</span>
                <span className="text-[var(--foreground-faint)]">Covered by EarnStack (~${feeAmount.toFixed(2)})</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--warning)] mt-2">
              Minimum payout is $5.00 CAD. Keep completing tasks to reach the threshold.
            </p>
          )}
        </div>

        {success ? (
          <div className="p-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success-bg)] text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--success)]/10 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--success)] mb-2">Payout requested</h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              Your request is in the review queue. Once approved, funds will be sent to <strong>{paypalEmail}</strong> via PayPal.
            </p>
            <p className="text-xs text-[var(--foreground-faint)] mt-3">Review typically takes 1–2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[var(--destructive-bg)] border border-[var(--destructive)]/20 text-[var(--destructive)] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">PayPal email</label>
              <input
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
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting…" : `Request $${Math.max(available, 0).toFixed(2)} CAD`}
            </button>

            <p className="text-xs text-[var(--foreground-faint)] text-center leading-relaxed">
              Payouts are reviewed before release. Earnings may be taxable under CRA guidelines.
            </p>
          </form>
        )}

        {earnings?.payouts?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Payout history</h2>
            <div className="space-y-2">
              {earnings.payouts.map((p: any) => (
                <div key={p.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm tabular-nums">${p.amount_cad.toFixed(2)} CAD</span>
                    <span className="text-xs text-[var(--foreground-faint)] ml-2">{p.paypal_email}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PAYOUT_STATUS_STYLE[p.status] || "bg-[var(--secondary)] text-[var(--foreground-muted)]"}` }>
                      {p.status}
                    </span>
                    <p className="text-xs text-[var(--foreground-faint)] mt-0.5">
                      {new Date(p.requested_at).toLocaleDateString("en-CA")}
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
