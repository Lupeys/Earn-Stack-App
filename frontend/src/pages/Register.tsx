import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("You must agree to the Privacy Policy and Terms of Service to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(email, password, displayName);
      navigate("/verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold mt-5 mb-1">Create account</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Canada only &middot; Free to join &middot; PayPal payouts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[var(--destructive-bg)] border border-[var(--destructive)]/20 text-[var(--destructive)] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 transition-colors"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 transition-colors"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 transition-colors"
              placeholder="Min 8 characters"
              autoComplete="new-password"
            />
          </div>

          {/* Active consent checkbox — required by TheoremReach go-live checklist */}
          <div className="flex items-start gap-3 pt-1">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border border-[var(--border)] accent-[var(--primary)] cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs text-[var(--foreground-muted)] leading-relaxed cursor-pointer">
              I have read and agree to EarnStack's{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline font-medium"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline font-medium"
              >
                Terms of Service
              </Link>.
              I confirm I am a Canadian resident aged 18 or older.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-[var(--foreground-faint)] text-center mt-4 leading-relaxed">
          Earnings may be taxable under CRA guidelines. EarnStack is not financial advice.
        </p>

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
