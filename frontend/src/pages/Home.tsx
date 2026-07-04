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
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="14" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.4"/>
              <rect x="3" y="10" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.7"/>
              <rect x="3" y="6" width="18" height="3" rx="1.5" fill="var(--primary)"/>
              <circle cx="19" cy="19" r="3" fill="var(--success)"/>
              <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold tracking-tight">
              Earn<span className="text-[var(--primary)] font-bold">Stack</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {loggedIn ? (
              <Link to="/tasks" className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                Open App
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-[var(--secondary)] transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success-bg)] border border-[var(--border)] text-[var(--success)] text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
          Canada only · PayPal payouts · $5 minimum
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5 leading-tight">
          Complete verified tasks.<br />
          <span className="text-[var(--primary)]">Get paid in real cash.</span>
        </h1>

        <p className="text-lg text-[var(--foreground-muted)] max-w-xl mb-8 leading-relaxed">
          EarnStack connects verified Canadians with short sponsor-funded tasks — surveys,
          app tests, and quick promo actions. Clear rates, manual review, PayPal payout.
          No points. No hype.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {loggedIn ? (
            <Link to="/tasks" className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors">
              Browse Tasks
            </Link>
          ) : (
            <>
              <Link to="/register" className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                Create Free Account
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary)] transition-colors">
                Sign In
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-[var(--foreground-faint)] mt-4">
          Earnings may be taxable under CRA guidelines. EarnStack is not financial advice.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-8">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Step
              number="1"
              title="Verify your account"
              description="Confirm your identity once. Sponsors need real Canadians — we keep the quality high."
            />
            <Step
              number="2"
              title="Complete verified tasks"
              description="Browse available tasks, submit proof of completion, and wait for manual review."
            />
            <Step
              number="3"
              title="Cash out via PayPal"
              description="Once your balance hits $5, request a payout. Funds sent to your PayPal within 1–2 business days."
            />
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-8">Built for trust</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TrustCard
            title="Verified users only"
            body="Every user verifies their identity before accessing tasks. Sponsors get real humans."
          />
          <TrustCard
            title="Transparent payouts"
            body="Every task shows its payout up front. Reach $5 and cash out via PayPal."
          />
          <TrustCard
            title="Fraud-protected"
            body="Device checks, velocity limits, and manual review on every payout."
          />
          <TrustCard
            title="No fake urgency"
            body="No countdown timers, spin wheels, or misleading earnings claims. Just honest work."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--foreground-faint)]">
        <p>EarnStack &copy; {new Date().getFullYear()} &mdash; Built in Canada for Canadians</p>
        <p className="mt-1">
          <a href="https://earnstack.ca" className="hover:text-[var(--foreground-muted)] transition-colors" target="_blank" rel="noopener noreferrer">
            earnstack.ca
          </a>
        </p>
      </footer>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-xs font-bold mb-3">
        {number}
      </span>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{body}</p>
    </div>
  );
}
