import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

export default function Surveys() {
  const [user, setUser] = useState<{ userId: number; email: string } | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [showWall, setShowWall] = useState(false);
  const navigate = useNavigate();

  const wallId = import.meta.env.VITE_CPAGRIP_WALL_ID || "";

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
    loadEarnings();
  }, [user]);

  const loadEarnings = () => {
    if (!user) return;
    fetchApi(`/api/postback/earnings?user_id=${user.userId}`)
      .then((r) => r.json())
      .then((data) => {
        setEarnings(data.total || 0);
        setRecent((data.earnings || []).slice(0, 10));
      })
      .catch(() => {});
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold mb-1">Offer Wall</h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Complete offers, surveys, and trials from our partners. Earnings are credited automatically upon completion.
        </p>

        {earnings > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success-bg)] flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-muted)]">Earned from offers</span>
            <span className="text-[var(--success)] font-bold">${earnings.toFixed(2)} CAD</span>
          </div>
        )}

        {!wallId ? (
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Offer wall is being configured. Check back soon.</p>
          </div>
        ) : !showWall ? (
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center">
            <h2 className="font-semibold mb-2">Available offers</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-5 max-w-sm mx-auto">
              Click below to open the offer wall. Complete offers to earn real CAD credited to your balance.
            </p>
            <button
              onClick={() => setShowWall(true)}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Open Offer Wall
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--surface)]">
              <span className="text-sm font-medium">Offer Wall</span>
              <button
                onClick={() => { setShowWall(false); loadEarnings(); }}
                className="text-xs px-3 py-1 rounded-lg bg-[var(--secondary)] text-[var(--foreground-muted)] hover:bg-[var(--secondary-hover)] transition-colors"
              >
                Close &amp; Refresh Earnings
              </button>
            </div>
            <iframe
              src={`https://cpagrip.com/wall.php?wallid=${wallId}&subid=${user.userId}`}
              className="w-full min-h-[600px] border-0"
              title="Offer Wall"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            />
          </div>
        )}

        {recent.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Recent offer earnings</h3>
            <div className="space-y-2">
              {recent.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                  <div>
                    <span className="text-sm font-medium">Offer completed</span>
                    <span className="text-xs text-[var(--foreground-faint)] ml-2">via {e.network}</span>
                  </div>
                  <span className="text-[var(--success)] font-semibold text-sm">+${e.amount_cad.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <h3 className="font-semibold mb-3">How it works</h3>
          <ol className="text-sm text-[var(--foreground-muted)] space-y-2 list-decimal list-inside leading-relaxed">
            <li>Browse available offers — surveys, app installs, free trials, and more</li>
            <li>Complete offers at your own pace</li>
            <li>Earnings are credited automatically on completion</li>
            <li>Request a PayPal payout once your balance reaches $5</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
