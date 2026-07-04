import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";
import type { Task } from "@/types";

export default function TaskFeed() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi("/api/tasks")
      .then((res) => {
        if (res.status === 403) {
          return res.json().then((data) => {
            if (data.code === "UNVERIFIED") {
              navigate("/verify");
              return;
            }
            throw new Error(data.code);
          });
        }
        return res.json();
      })
      .then((data) => data && setTasks(data.tasks))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold mb-1">Available Tasks</h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">Complete tasks, submit proof, earn real CAD.</p>

        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-[var(--secondary)] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-[var(--destructive-bg)] border border-[var(--destructive)]/20 text-[var(--destructive)] text-sm">
            {error}
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary)] mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
            </div>
            <p className="font-medium text-[var(--foreground)]">No tasks right now</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">New tasks are added regularly — check back soon.</p>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task: any) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="flex items-start justify-between gap-4 p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-sm transition-all"
            >
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug truncate">{task.title}</h3>
                <p className="text-[var(--foreground-muted)] text-sm mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--foreground-muted)] capitalize">
                    {task.task_type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-[var(--foreground-faint)]">{task.effort_minutes} min</span>
                  <span className="text-xs text-[var(--foreground-faint)]">{task.current_completions}/{task.max_completions} spots</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pt-0.5">
                <span className="text-[var(--success)] font-bold text-lg">${task.payout_cad.toFixed(2)}</span>
                <span className="block text-xs text-[var(--foreground-faint)]">CAD</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
