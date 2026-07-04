import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2 select-none" aria-label="EarnStack home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="14" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.4"/>
            <rect x="3" y="10" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.7"/>
            <rect x="3" y="6" width="18" height="3" rx="1.5" fill="var(--primary)"/>
            <circle cx="19" cy="19" r="3" fill="var(--success)"/>
            <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-[var(--foreground)] tracking-tight">
            Earn<span className="text-[var(--primary)] font-bold">Stack</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {loggedIn ? (
            <>
              <NavLink to="/tasks" current={location.pathname}>Tasks</NavLink>
              <NavLink to="/surveys" current={location.pathname}>Surveys</NavLink>
              <NavLink to="/earnings" current={location.pathname}>Earnings</NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="ml-2 px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile: show sign in / get started only when logged out */}
        {!loggedIn && (
          <div className="flex sm:hidden items-center gap-1">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:bg-[var(--secondary)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, current, children }: { to: string; current: string; children: React.ReactNode }) {
  const active = current === to || current.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--secondary)] text-[var(--primary)] font-semibold"
          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
      }`}
    >
      {children}
    </Link>
  );
}
