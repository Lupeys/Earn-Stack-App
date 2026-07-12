import { Link, useLocation } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: (active: boolean) => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/tasks",
    label: "Tasks",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 12h6M12 9v6"/>
      </svg>
    ),
  },
  {
    to: "/earn",
    label: "Earn",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 6v2m0 8v2M8.5 9.5a3.5 2.5 0 0 1 7 0c0 1.5-1 2.5-3.5 3s-3.5 1.5-3.5 3a3.5 2.5 0 0 0 7 0"/>
      </svg>
    ),
  },
  {
    to: "/earnings",
    label: "Earnings",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    ),
  },
  {
    to: "/payout",
    label: "Cash out",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm z-10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-14">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors min-h-[44px]",
                active
                  ? "text-[var(--primary)]"
                  : "text-[var(--foreground-faint)] hover:text-[var(--foreground-muted)]",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {item.icon(active)}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
