import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Canada Only
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          Earn real cash for
          <span className="text-emerald-400"> short tasks</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Surveys, app tests, and quick promo actions from verified Canadian sponsors.
          No points, no gamification — just clear tasks at clear rates, paid out via PayPal
          at a $5 minimum.
        </p>

        <div className="flex items-center justify-center gap-4">
          {loggedIn ? (
            <Link
              to="/tasks"
              className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
            >
              Browse Tasks
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:border-zinc-500 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Verified Users Only</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every user verifies their identity before accessing tasks.
              Sponsors get real humans, you get real tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Transparent Payouts</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every task shows its payout up front. Reach $5 and cash out
              via PayPal. No hidden fees, no minimums you can't hit.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Fraud-Protected</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Device checks, velocity limits, and manual review on payouts.
              Built to keep scammers out from day one.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-muted-foreground">
        <p>EarnStack &copy; {new Date().getFullYear()} &mdash; Built in Canada for Canadians</p>
      </footer>
    </div>
  );
}
