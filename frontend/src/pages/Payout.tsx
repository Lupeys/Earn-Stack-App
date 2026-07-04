import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const PAYPAL_FEE_RATE = 0.02; // 2% — absorbed by EarnStack, shown for transparency

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
    if (!paypalEmail) {
      setError("PayPal email is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchApi("/api/payouts/request", {
        method: "POST",
        body: JSON.stringify({
          paypal_email: paypalEmail,
          amount_cad: available,
        }),
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  const available = earnings?.summary?.available_cad ?? 0;
  const canPayout = available >= 5;
  const feeAmount = available * PAYPAL_FEE_RATE;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/earnings" className="text-emerald-400 hover:underline text-sm mb-6 inline-block">
          &larr; Back to earnings
        </Link>

        <h1 className="text-2xl font-bold mb-6">Request Payout</h1>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="text-2xl font-bold text-emerald-400">${available.toFixed(2)} CAD</span>
          </div>
          {canPayout && (
            <div className="pt-3 border-t border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You receive</span>
                <span className="font-medium">${available.toFixed(2)} CAD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PayPal processing fee</span>
                <span className="text-muted-foreground">Covered by EarnStack</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                EarnStack covers the {(PAYPAL_FEE_RATE * 100).toFixed(0)}% PayPal fee (~${feeAmount.toFixed(2)}) so you receive your full balance.
              </p>
            </div>
          )}
          {!canPayout && (
            <p className="text-sm text-yellow-400 mt-2">
              Minimum payout is $5.00. Keep completing tasks to reach the threshold.
            </p>
          )}
        </div>

        {success ? (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Payout Requested</h2>
            <p className="text-muted-foreground">
              Your request is pending manual review. Once approved, your funds will be
              sent to <strong>{paypalEmail}</strong> via PayPal.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Review typically takes 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">PayPal Email</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                required
                disabled={!canPayout}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-card text-foreground focus:outline-none focus:border-emerald-500 disabled:opacity-50 transition-colors"
                placeholder="your@paypal.com"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Make sure this matches your PayPal account exactly.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !canPayout}
              className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : `Request $${Math.max(available, 0).toFixed(2)} CAD Payout`}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Payouts are reviewed before release to keep the platform fair and secure.
              Earnings may be taxable under CRA guidelines.
            </p>
          </form>
        )}

        {earnings?.payouts?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Payout History</h2>
            <div className="space-y-2">
              {earnings.payouts.map((p: any) => (
                <div key={p.id} className="p-3 rounded-xl border border-zinc-800 bg-card flex items-center justify-between">
                  <div>
                    <span className="font-medium">${p.amount_cad.toFixed(2)} CAD</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      → {p.paypal_email}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.status === "sent"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : p.status === "failed"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-zinc-700/30 text-zinc-400 border-zinc-700"
                    }`}>
                      {p.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
