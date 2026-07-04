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
    if (!token) {
      navigate("/login");
      return;
    }

    fetchApi("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
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
      setError("TheoremReach API key not configured. Add VITE_THEOREMREACH_API_KEY to environment.");
      return;
    }

    if (window.TheoremReach) {
      window.TheoremReach.init({
        apiKey: key,
        userId: String(user.userId),
        onReward: (data) => {
          fetch(
            `/api/postback/theoremreach?user_id=${user.userId}&reward=${data.reward}&tx_id=${data.transactionId}&offer_id=${data.surveyId}`
          )
            .then((r) => r.json())
            .then((result) => {
              if (result.credited) {
                setEarnings((e) => e + result.credited);
              }
            })
            .catch(() => {});
        },
      });
      window.TheoremReach.show();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://theoremreach.com/sdk/trsdk.js";
    script.onload = () => {
      window.TheoremReach?.init({
        apiKey: key,
        userId: String(user.userId),
        onReward: (data) => {
          fetch(
            `/api/postback/theoremreach?user_id=${user.userId}&reward=${data.reward}&tx_id=${data.transactionId}&offer_id=${data.surveyId}`
          )
            .then((r) => r.json())
            .then((result) => {
              if (result.credited) {
                fetchApi(`/api/postback/earnings?user_id=${user.userId}`)
                  .then((r) => r.json())
                  .then((d) => setEarnings(d.total || 0))
                  .catch(() => {});
              }
            })
            .catch(() => {});
        },
      });
      window.TheoremReach?.show();
    };
    script.onerror = () => {
      setError("Failed to load survey wall. Please try again later.");
    };
    document.head.appendChild(script);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📋</span>
          <div>
            <h1 className="text-2xl font-bold">Rewarded Surveys</h1>
            <p className="text-muted-foreground text-sm">
              Earn real cash by sharing your opinion. Surveys provided by TheoremReach.
            </p>
          </div>
        </div>

        {earnings > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
            <span className="text-emerald-400 font-bold text-lg">${earnings.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm ml-2">earned from surveys</span>
          </div>
        )}

        <div className="grid gap-6">
          <div className="p-8 rounded-2xl border border-zinc-800 bg-card text-center">
            <h2 className="text-lg font-semibold mb-2">Start Taking Surveys</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Click below to open the survey wall. Complete surveys and earn cash instantly — no manual review needed.
            </p>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={loadTheoremReach}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              Open Survey Wall
            </button>
          </div>

          {recent.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Survey Earnings</h3>
              <div className="space-y-2">
                {recent.map((e: any) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-card/60"
                  >
                    <div>
                      <span className="text-sm">Survey completed</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        via {e.network}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm">
                      +${e.amount_cad.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 rounded-2xl border border-zinc-800 bg-card">
            <h3 className="font-semibold mb-2">How It Works</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click <strong>Open Survey Wall</strong> to see available surveys</li>
              <li>Complete surveys at your own pace — surveys take 5–20 minutes</li>
              <li>Earnings are credited automatically when a survey is completed</li>
              <li>Request payout via PayPal once you reach $5.00</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
