import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function handleLogout() {
    logout();
  }

  return (
    <nav className="border-b border-zinc-800 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight">
          <span className="text-emerald-400">Earn</span>Stack
        </Link>

        <div className="flex items-center gap-1">
          {loggedIn ? (
            <>
              <Link
                to="/tasks"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Tasks
              </Link>
              <Link
                to="/surveys"
                className="px-3 py-1.5 rounded-lg text-sm text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 transition-colors"
              >
                Surveys
              </Link>
              <Link
                to="/earnings"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Earnings
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="ml-2 px-4 py-1.5 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
