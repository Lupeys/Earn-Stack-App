import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

declare global {
  interface Window {
    TheoremReach?: {
      init: (config: {
        apiKey: string;
        userId: string;
        onReward: (data: { reward: number; transactionId: string; surveyId: string }) => void;
      }) => void;
      show: () => void;
    };
  }
}

export default function Surveys() {
  const [user, setUser] = useState<{ userId: number; email: string } | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchApi("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => navigate("/login"));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchApi(`/api/postback/earnings?user_id=${user.userId}`)
      .then((r) => r.json())
      .then((data) => {
        setEarnings(data.total || 0);
        setRecent((data.earnings || []).slice(0, 10));
      })
      .catch(() => {});
  }, [user]);

  const loadTheoremReach = () => {
    if (!user) return;
    const key = import.meta.env.VITE_THEOREMREACH_API_KEY || "";
    if (!key) {
      setError("Survey wall not configured. Check back soon.");
      return;
    }
    const init = () => {
      window.TheoremReach?.init({
        apiKey: key,
        userId: String(user.userId),
        onReward: (data) => {
          fetch(`/api/postback/theoremreach?user_id=${user.userId}&reward=${data.reward}&tx_id=${data.transactionId}&offer_id=${data.surveyId}`)
            .then((r) => r.json())
            .then((result) => {
              if (result.credited) setEarnings((e) => e + result.credited);
            })
            .catch(() => {});
        },
      });
      window.TheoremReach?.show();
    };
    if (window.TheoremReach) { init(); return; }
    const script = document.createElement("script");
    script.src = "https://theoremreach.com/sdk/trsdk.js";
    script.onload = init;
    script.onerror = () => setError("Failed to load survey wall. Please try again.");
    document.head.appendChild(script);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold mb-1">Surveys</h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Share your opinion and earn real cash. Surveys are provided by TheoremReach.
        </p>

        {earnings > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success-bg)] flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-muted)]">Earned from surveys</span>
            <span className="text-[var(--success)] font-bold">${earnings.toFixed(2)} CAD</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <h2 className="font-semibold mb-2">Available surveys</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-5 max-w-sm mx-auto">
              Click below to open the survey wall. Earnings are credited automatically when a survey is completed.
            </p>
            {error && (
              <p className="text-[var(--destructive)] text-sm mb-4">{error}</p>
            )}
            <button
              onClick={loadTheoremReach}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Open Survey Wall
            </button>
          </div>

          {recent.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Recent survey earnings</h3>
              <div className="space-y-2">
                {recent.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <div>
                      <span className="text-sm font-medium">Survey completed</span>
                      <span className="text-xs text-[var(--foreground-faint)] ml-2">via {e.network}</span>
                    </div>
                    <span className="text-[var(--success)] font-semibold text-sm">+${e.amount_cad.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <h3 className="font-semibold mb-3">How it works</h3>
            <ol className="text-sm text-[var(--foreground-muted)] space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open the survey wall to see what's available</li>
              <li>Complete surveys at your own pace — typically 5–20 minutes each</li>
              <li>Earnings are credited automatically on completion</li>
              <li>Request a PayPal payout once your balance reaches $5</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
