import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/tasks":    "Tasks",
  "/earn":     "Earn",
  "/earnings": "Earnings",
  "/payout":   "Payout",
  "/profile":  "Profile",
  "/admin":    "Admin",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "EarnStack";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo + page title */}
        <div className="flex items-center gap-3">
          <Link to="/tasks" className="flex items-center gap-2 flex-shrink-0" aria-label="EarnStack home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="14" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.35"/>
              <rect x="3" y="10" width="18" height="3" rx="1.5" fill="var(--primary)" opacity="0.65"/>
              <rect x="3" y="6" width="18" height="3" rx="1.5" fill="var(--primary)"/>
              <circle cx="19" cy="19" r="3" fill="var(--success)"/>
              <path d="M17.5 19l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold tracking-tight text-sm hidden sm:block">
              Earn<span className="text-[var(--primary)] font-bold">Stack</span>
            </span>
          </Link>
          {/* Divider + page title on mobile */}
          <span className="text-[var(--border)] select-none hidden xs:block" aria-hidden="true">/</span>
          <span className="text-sm font-semibold text-[var(--foreground)] sm:hidden">{pageTitle}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--warning)] bg-[var(--warning-bg)] border border-[var(--warning)]/20 hover:bg-[var(--warning-bg)] transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
            <NavLink to="/tasks" label="Tasks" pathname={location.pathname} />
            <NavLink to="/earn" label="Earn" pathname={location.pathname} />
            <NavLink to="/earnings" label="Earnings" pathname={location.pathname} />
          </nav>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--secondary)] text-[var(--foreground-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-10 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-md py-1 z-20"
                role="menu"
              >
                {user?.email && (
                  <p className="px-4 py-2 text-xs text-[var(--foreground-faint)] truncate border-b border-[var(--border)]">
                    {user.email}
                  </p>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground-muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label, pathname }: { to: string; label: string; pathname: string }) {
  const active = pathname === to || pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={[
        "px-3 py-1.5 rounded-lg text-sm transition-colors",
        active
          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
          : "text-[var(--foreground-muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
