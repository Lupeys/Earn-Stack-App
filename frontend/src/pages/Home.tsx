import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="EarnStack logo">
              <rect x="3" y="14" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.35"/>
              <rect x="3" y="10" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.65"/>
              <rect x="3" y="6" width="18" height="3" rx="1.5" fill="var(--primary)"/>
              <circle cx="19" cy="19" r="3" fill="var(--success)"/>
              <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold tracking-tight text-[var(--foreground)]">
              Earn<span className="text-[var(--primary)] font-bold">Stack</span>
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {loggedIn ? (
              <Link
                to="/tasks"
                className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                Open App
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success-bg)] border border-[var(--success)]/25 text-[var(--success)] text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] flex-shrink-0" aria-hidden="true" />
          Canada only &nbsp;&middot;&nbsp; PayPal payouts &nbsp;&middot;&nbsp; $5 minimum
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6 max-w-2xl">
          Complete verified tasks.
          <br />
          <span className="text-[var(--primary)]">Get paid in real cash.</span>
        </h1>

        <p className="text-lg text-[var(--foreground-muted)] max-w-lg mb-10 leading-relaxed">
          Short sponsor-funded tasks for verified Canadians. Clear rates, manual review, PayPal cashout. No points. No hype.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {loggedIn ? (
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Browse tasks
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                Create free account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary)] transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-[var(--foreground-faint)] mt-5">
          Earnings may be taxable under CRA guidelines. EarnStack is not financial advice.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest mb-8">How it works</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <StepCard
              number="1"
              title="Verify your account"
              description="Confirm your identity once. Sponsors need real Canadians — verification keeps the quality high."
            />
            <StepCard
              number="2"
              title="Complete verified tasks"
              description="Browse available tasks, submit proof of completion, and wait for manual review."
            />
            <StepCard
              number="3"
              title="Cash out via PayPal"
              description="Once your balance hits $5 CAD, request a payout. Reviewed and sent within 1–2 business days."
            />
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-widest mb-8">Built for trust</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <TrustCard
            icon="shield"
            title="Verified users only"
            body="Every user verifies their identity before accessing tasks. Sponsors get real humans, not bots."
          />
          <TrustCard
            icon="dollar"
            title="Transparent payouts"
            body="Every task shows its payout up front. No hidden fees. Reach $5 CAD and cash out via PayPal."
          />
          <TrustCard
            icon="lock"
            title="Fraud-protected"
            body="Device checks, velocity limits, and manual review on every payout keep the platform clean."
          />
          <TrustCard
            icon="check"
            title="No fake urgency"
            body="No countdown timers, spin wheels, or exaggerated earnings claims. Honest work, honest pay."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--foreground-faint)]">
          <span>EarnStack &copy; {new Date().getFullYear()} — Built in Canada for Canadians</span>
          <div className="flex items-center gap-4">
            <a
              href="https://earnstack.ca"
              className="hover:text-[var(--foreground-muted)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              earnstack.ca
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold flex-shrink-0">
          {number}
        </span>
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
      </div>
      <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

type TrustIconName = "shield" | "dollar" | "lock" | "check";

const TRUST_ICONS: Record<TrustIconName, JSX.Element> = {
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

function TrustCard({ icon, title, body }: { icon: TrustIconName; title: string; body: string }) {
  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex-shrink-0">
        {TRUST_ICONS[icon]}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
