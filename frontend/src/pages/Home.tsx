import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useEffect, useState, type ReactElement } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isInStandaloneMode =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (isIos && !isInStandaloneMode) setShowPwaBanner(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-[#2a3a32] bg-[#1E2A24]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="EarnStack logo">
              <rect x="3" y="14" width="18" height="3" rx="1.5" fill="#4E8F7C" opacity="0.35"/>
              <rect x="3" y="10" width="18" height="3" rx="1.5" fill="#4E8F7C" opacity="0.65"/>
              <rect x="3" y="6" width="18" height="3" rx="1.5" fill="#4E8F7C"/>
              <circle cx="19" cy="19" r="3" fill="#3E7A43"/>
              <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold tracking-tight text-slate-100">
              Earn<span className="text-[#5FA090] font-bold">Stack</span>
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {loggedIn ? (
              <Link
                to="/earn"
                className="px-4 py-1.5 rounded-lg bg-[#4E8F7C] text-white text-sm font-semibold hover:bg-[#2F6757] transition-colors"
              >
                Open App
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-[#4E8F7C] text-white text-sm font-semibold hover:bg-[#2F6757] transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative bg-[#1E2A24] overflow-hidden">
        {/* Ambient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#4E8F7C22_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#3E7A4311_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-20">
          {/* Canada pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E8F7C]/15 border border-[#4E8F7C]/30 text-[#7EBFAC] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4E8F7C] flex-shrink-0" aria-hidden="true" />
            Canada only &nbsp;&middot;&nbsp; PayPal payouts &nbsp;&middot;&nbsp; $5 minimum
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5 max-w-2xl text-slate-100">
            Complete partner offers.<br />
            <span className="text-[#5FA090]">Get paid in real cash.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
            Verified Canadians complete partner offers and earn real CAD.
            Transparent payouts, PayPal cashout. No points. No hype.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {loggedIn ? (
              <Link
                to="/earn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4E8F7C] text-white font-semibold hover:bg-[#2F6757] transition-colors shadow-lg shadow-[#4E8F7C]/20"
              >
                Browse offers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4E8F7C] text-white font-semibold hover:bg-[#2F6757] transition-colors shadow-lg shadow-[#4E8F7C]/20"
                >
                  Create free account
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-white/20 text-slate-200 font-medium hover:bg-white/10 transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-6 leading-relaxed">
            Earnings may be taxable under CRA guidelines. EarnStack is not financial advice.
          </p>
        </div>

        {/* Gradient fade into body */}
        <div className="h-12 bg-gradient-to-b from-[#1E2A24] to-[var(--background)]" />
      </section>

      {/* ── Sponsors coming soon ────────────────────────────── */}
      <section className="bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest">Tasks</p>
            <span className="text-xs font-medium text-[#5FA090]">Verified payouts only</span>
          </div>
          <div className="rounded-2xl border border-[#4E8F7C]/20 bg-[#EAF5F0] dark:bg-[#1A2A22] p-8 flex flex-col items-center text-center">
            {/* Hourglass icon */}
            <div className="h-12 w-12 rounded-full bg-[#4E8F7C]/12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#4E8F7C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a4 4 0 0 1 4 4v.586l1.707 1.707A1 1 0 0 1 17 14.5H7a1 1 0 0 1-.707-1.707L8 11.086V10.5a4 4 0 0 1 4-4zM9 17.5h6M10 20.5h4" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-[#18302B] dark:text-slate-100 mb-2 tracking-tight">
              Sponsors coming soon.
            </h2>
            <p className="text-sm text-[#5F6F69] dark:text-slate-400 max-w-sm leading-relaxed">
              We're onboarding verified Canadian sponsors. Real tasks with transparent payouts — no hype, no penny grind.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4E8F7C] hover:text-[#2F6757] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Get notified when tasks go live
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest mb-8">How it works</p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-2">
            <StepCard
              number="1"
              title="Complete tasks"
              description="Browse available partner offers. Complete them on your own schedule — no proof submission needed."
            />
            <StepConnector />
            <StepCard
              number="2"
              title="Get verified"
              description="Confirm your identity once. Verification ensures real Canadians earn and keeps the platform fair."
            />
            <StepConnector className="sm:hidden" />
            <StepCard
              number="3"
              title="Cash out via PayPal"
              description="Once your balance reaches $5 CAD, request a payout. Reviewed and sent within 1–2 business days."
            />
          </div>
        </div>
      </section>

      {/* ── Trust signals ───────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest mb-6">Built for trust</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <TrustCard
              icon="shield"
              title="Verified users only"
              body="Every user verifies once before accessing offers. Real Canadians, not bots."
            />
            <TrustCard
              icon="dollar"
              title="Transparent payouts"
              body="Payout amounts are shown up front. No hidden fees. Cash out at $5 CAD via PayPal."
            />
            <TrustCard
              icon="lock"
              title="Fraud-protected"
              body="Device checks, velocity limits, and manual payout review keep the platform clean."
            />
            <TrustCard
              icon="check"
              title="No fake urgency"
              body="No spin wheels, countdown timers, or inflated earnings claims. Honest pay for real work."
            />
          </div>
        </div>
      </section>

      {/* ── Social proof bar ────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 text-center">
          <p className="text-sm text-[var(--foreground-muted)] mb-4">
            Canadians earning modest side cash through verified partner offers.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-[var(--foreground-faint)]">
            <span>&#x2713;&nbsp; No subscription</span>
            <span>&#x2713;&nbsp; Free to join</span>
            <span>&#x2713;&nbsp; Canadian accounts only</span>
            <span>&#x2713;&nbsp; PayPal cashout</span>
          </div>
        </div>
      </section>

      {/* ── iOS PWA banner ──────────────────────────────────── */}
      {showPwaBanner && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4 flex items-start gap-3">
            <svg className="flex-shrink-0 mt-0.5 text-[var(--primary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v10M8 6l4-4 4 4"/><rect x="3" y="14" width="18" height="8" rx="2"/></svg>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              <strong className="text-[var(--foreground)] font-medium">Add to Home Screen</strong> for the full app experience — tap the Share button{" "}
              <svg className="inline-block" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>{" "}
              in Safari, then choose &ldquo;Add to Home Screen.&rdquo;
            </p>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="ml-auto flex-shrink-0 text-[var(--foreground-faint)] hover:text-[var(--foreground-muted)] transition-colors p-1"
              aria-label="Dismiss install hint"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--foreground-faint)]">
          <span>EarnStack &copy; {new Date().getFullYear()} — Built in Canada for Canadians</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[var(--foreground-muted)] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--foreground-muted)] transition-colors">Terms</Link>
            <a href="https://earnstack.ca" className="hover:text-[var(--foreground-muted)] transition-colors" target="_blank" rel="noopener noreferrer">earnstack.ca</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#4E8F7C]/12 text-[#4E8F7C] text-xs font-bold flex-shrink-0 border border-[#4E8F7C]/20">
          {number}
        </span>
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
      </div>
      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed pl-10">{description}</p>
    </div>
  );
}

function StepConnector({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden sm:flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E8F7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  );
}

type TrustIconName = "shield" | "dollar" | "lock" | "check";

const TRUST_ICONS: Record<TrustIconName, ReactElement> = {
  shield: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  dollar: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  lock: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  check: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>),
};

function TrustCard({ icon, title, body }: { icon: TrustIconName; title: string; body: string }) {
  return (
    <div className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#4E8F7C]/10 text-[#4E8F7C] flex-shrink-0">
          {TRUST_ICONS[icon]}
        </div>
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
      </div>
      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed pl-9">{body}</p>
    </div>
  );
}
