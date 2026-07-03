import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-red-400">{error || "Could not load earnings"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Earnings Ledger</h1>
          <Link
            to="/payout"
            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-colors"
          >
            Request Payout
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-zinc-800 bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">${earnings.summary.pending_cad.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border border-zinc-800 bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Available</p>
            <p className="text-2xl font-bold text-emerald-400">${earnings.summary.available_cad.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border border-zinc-800 bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
            <p className="text-2xl font-bold">${earnings.summary.total_earned_cad.toFixed(2)}</p>
          </div>
        </div>

        {earnings.completions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No completed tasks yet.</p>
            <Link to="/tasks" className="text-emerald-400 hover:underline text-sm mt-2 inline-block">
              Browse available tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {earnings.completions.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl border border-zinc-800 bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{c.task_title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completed {new Date(c.completed_at).toLocaleDateString("en-CA")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="font-semibold">${c.payout_cad.toFixed(2)}</span>
                    <span className={`block text-xs px-2 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[c.status] || "bg-zinc-800 text-zinc-400"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
                {c.review_note && (
                  <p className="text-xs text-muted-foreground mt-2 bg-zinc-900 rounded-lg p-2">
                    Review note: {c.review_note}
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
