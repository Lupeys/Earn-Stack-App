import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useEffect, useRef, useState, type ReactElement } from "react";

// ── SVG icon helpers ──────────────────────────────────────────

const HourglassIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4M6 20h12" />
  </svg>
);

const ArrowRight = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckCircle = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MailIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

type NavTabType = "tasks" | "earn" | "earnings" | "cashout";

const NavIcon = ({ type, active }: { type: NavTabType; active: boolean }) => {
  const cls = `w-5 h-5 ${active ? "text-[#5FA090]" : "text-slate-500"}`;
  switch (type) {
    case "tasks":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      );
    case "earn":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "earnings":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "cashout":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
  }
};

// ── Main component ────────────────────────────────────────────

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabType>("tasks");
  const [emailInput, setEmailInput] = useState("");
  const [isNotified, setIsNotified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isInStandaloneMode =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (isIos && !isInStandaloneMode) setShowPwaBanner(true);
  }, []);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!emailInput || !emailInput.includes("@") || !emailInput.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setIsNotified(true);
  };

  const handleNavTab = (tab: NavTabType) => {
    setActiveTab(tab);
    if (loggedIn) {
      navigate(`/${tab === "cashout" ? "cashout" : tab}`);
    } else {
      navigate("/login");
    }
  };

  // Static contributor state for landing preview
  const completedTasks = 0;
  const totalTasks = 15;
  const progressPct = Math.min((completedTasks / totalTasks) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0C0F12] text-slate-100 flex flex-col antialiased overflow-x-hidden">

      {/* ── iOS PWA banner ──────────────────────────────────── */}
      {showPwaBanner && (
        <div className="bg-[#1A2520] border-b border-[#2a3a32] px-4 py-3 flex items-start gap-3">
          <svg className="flex-shrink-0 mt-0.5 text-[#5FA090]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <p className="text-[11px] text-slate-400 leading-relaxed flex-1">
            <strong className="text-slate-200 font-semibold">Add to Home Screen</strong> — tap the Share button in Safari, then choose &ldquo;Add to Home Screen&rdquo; for the full app experience.
          </p>
          <button onClick={() => setShowPwaBanner(false)} className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1" aria-label="Dismiss">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* ── App shell ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full relative">

        {/* ── Top nav bar ─────────────────────────────────── */}
        <nav className="bg-[#1E2A24] py-3.5 px-5 flex justify-between items-center shrink-0 border-b border-[#2a3a32] sticky top-0 z-30">
          <span className="text-base font-black tracking-tight">
            Earn<span className="text-[#5FA090]">Stack</span>
          </span>
          {loggedIn ? (
            <Link to="/earn" className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#5FA090]/30 to-[#5FA090]/70 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                U
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#5FA090] border-2 border-[#1E2A24]" />
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/login" className="px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors">Sign in</Link>
              <Link to="/register" className="px-3 py-1.5 text-sm font-semibold bg-[#4E8F7C] hover:bg-[#2F6757] text-white rounded-lg transition-colors">Join</Link>
            </div>
          )}
        </nav>

        {/* ── Scrollable content ──────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-24">

          {/* ── Gradient mesh hero zone ─────────────────── */}
          <div className="relative pt-6 px-5 pb-8 bg-gradient-to-b from-[#1E2A24] to-[#0C0F12] flex flex-col shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#4E8F7C18_0%,_transparent_65%)] pointer-events-none" />

            {/* Balance card */}
            <div className="relative w-full bg-[#1A2520] text-slate-100 rounded-2xl p-5 border border-emerald-500/10 shadow-xl flex flex-col z-10">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase">Available Cash Balance</span>
                  <span className="text-4xl font-extrabold tracking-tighter mt-1.5 font-mono select-all">
                    $0.00
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 mt-1">
                    Reviewed within 1–2 business days
                  </span>
                </div>
                {/* Verified badge */}
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-800/60">
                <span className="text-xs text-slate-400">Min. payout $5.00 CAD</span>
                {loggedIn ? (
                  <Link
                    to="/cashout"
                    className="px-4 py-1.5 text-xs font-bold bg-[#F5F7F4] text-[#1E2A24] border border-slate-200/20 rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-md"
                  >
                    Cash Out →
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-xs font-bold bg-[#5FA090] text-slate-950 rounded-full hover:bg-[#5FA090]/90 active:scale-95 transition-all shadow-md"
                  >
                    Get started →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Contributor progress strip ──────────────── */}
          <div className="px-5 mt-[-12px] relative z-20">
            <div className="w-full bg-[#1A2520] border border-emerald-500/10 rounded-xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200">Reliable Contributor</span>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  {completedTasks} of {totalTasks} tasks to Verified
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5FA090]/70 to-[#5FA090] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Complete {totalTasks} tasks to unlock Verified status and higher-value offers.
              </p>
            </div>
          </div>

          {/* ── Tasks section ───────────────────────────── */}
          <div className="px-5 mt-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-black tracking-tight text-slate-100 uppercase">Tasks</h2>
              <span className="text-xs font-bold text-[#5FA090]">Verified Payouts Only</span>
            </div>

            {/* Sponsors coming soon card */}
            <div className="bg-[#1A2520] border border-emerald-500/10 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-[#5FA090]/10 flex items-center justify-center mb-3">
                <HourglassIcon className="w-5 h-5 text-[#5FA090]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-100 tracking-tight">Sponsors coming soon.</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs">
                We're onboarding verified Canadian sponsors. Real tasks with transparent payouts — no hype, no penny grind.
              </p>

              {/* Notify form */}
              <div className="w-full mt-4 pt-4 border-t border-emerald-500/10">
                {isNotified ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#5FA090]">
                    <CheckCircle className="w-4 h-4" />
                    You're on the list — we'll email you when tasks go live.
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col gap-2 w-full">
                    <div className="flex gap-1.5 w-full">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                        className="flex-1 px-3 py-2 text-xs bg-[#0C0F12] border border-emerald-500/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5FA090] text-slate-200 placeholder:text-slate-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-[#5FA090] hover:bg-[#5FA090]/90 active:scale-95 text-slate-950 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 shrink-0"
                      >
                        <MailIcon />
                        Notify me
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-400 text-left">{emailError}</p>
                    )}
                    <p className="text-[10px] text-slate-600 text-left">Canadian email addresses only. No spam.</p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── How it works strip ──────────────────────── */}
          <div className="px-5 mt-6 pt-5 border-t border-slate-800/50">
            <div className="grid grid-cols-3 gap-2">
              {[
                { n: "1", label: "Complete tasks", sub: "On your schedule" },
                { n: "2", label: "Get verified", sub: "Real users only" },
                { n: "3", label: "Cash out via PayPal", sub: "Manual review" },
              ].map(({ n, label, sub }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  <span className="h-6 w-6 rounded-full bg-[#5FA090]/10 text-[#5FA090] font-black text-xs flex items-center justify-center mb-1.5 border border-[#5FA090]/20">
                    {n}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 leading-snug">{label}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent activity ─────────────────────────── */}
          <div className="px-5 mt-6 pb-4 pt-5 border-t border-slate-800/50">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">Recent</h2>
            {loggedIn ? (
              <Link
                to="/earnings"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1A2520] border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
              >
                <span className="text-xs text-slate-400">View your earnings ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Static placeholder entries — no fake names or amounts */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A2520] border border-emerald-500/10 opacity-50 select-none">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400">Member cashed out</span>
                      <span className="text-[9px] text-slate-600">via PayPal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[#5FA090] font-mono">–––</span>
                    <svg className="w-3 h-3 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A2520] border border-emerald-500/10 opacity-30 select-none">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400">Member cashed out</span>
                      <span className="text-[9px] text-slate-600">via PayPal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[#5FA090] font-mono">–––</span>
                    <svg className="w-3 h-3 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="mt-1 text-center text-xs font-semibold text-[#5FA090] hover:text-[#5FA090]/80 transition-colors py-1"
                >
                  Create an account to see your activity →
                </Link>
              </div>
            )}
          </div>

          {/* ── Footer trust line ───────────────────────── */}
          <div className="px-5 py-6 border-t border-slate-800/40 flex flex-col gap-3">
            <p className="text-[10px] text-slate-600 leading-relaxed text-center">
              EarnStack is Canada-only. Earnings may be taxable under CRA guidelines. EarnStack is not financial advice.
            </p>
            <div className="flex justify-center gap-4 text-[10px] text-slate-600">
              <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
              <a href="https://earnstack.ca" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">earnstack.ca</a>
            </div>
          </div>

        </div>{/* end scrollable */}

        {/* ── Bottom nav bar ──────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1E2A24] border-t border-slate-800/60 px-6 py-2.5 flex justify-between items-center z-30">
          {(["tasks", "earn", "earnings", "cashout"] as NavTabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleNavTab(tab)}
              className="flex flex-col items-center gap-1 flex-1 relative min-h-[44px] justify-center"
              aria-label={tab}
            >
              {activeTab === tab && (
                <span className="absolute -top-2.5 w-8 h-0.5 bg-[#5FA090] rounded-full" />
              )}
              <NavIcon type={tab} active={activeTab === tab} />
              <span className={`text-[9px] font-bold uppercase tracking-wider capitalize ${activeTab === tab ? "text-[#5FA090]" : "text-slate-500"}`}>
                {tab === "cashout" ? "Cash Out" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>

      </div>{/* end app shell */}
    </div>
  );
}
