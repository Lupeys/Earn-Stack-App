import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const TASK_TYPE_LABEL: Record<string, string> = {
  survey: "Survey",
  app_test: "App test",
  sponsor_action: "Sponsor action",
  promo_action: "Promo action",
  offer: "Offer",
  other: "Task",
};

export default function TaskFeed() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi("/api/tasks")
      .then((res) => {
        if (res.status === 403) {
          return res.json().then((data: any) => {
            if (data.code === "UNVERIFIED") {
              navigate("/verify");
              return null;
            }
            throw new Error(data.code);
          });
        }
        return res.json();
      })
      .then((data: any) => data && setTasks(data.tasks ?? data))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Available Tasks</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Complete tasks, submit proof, earn real CAD.</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-pulse">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-[var(--secondary)]" />
                    <div className="h-3 w-full rounded bg-[var(--secondary)]" />
                    <div className="h-3 w-4/5 rounded bg-[var(--secondary)]" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-5 w-16 rounded-full bg-[var(--secondary)]" />
                      <div className="h-5 w-12 rounded-full bg-[var(--secondary)]" />
                    </div>
                  </div>
                  <div className="flex-shrink-0 space-y-1.5 pt-0.5">
                    <div className="h-6 w-14 rounded bg-[var(--secondary)]" />
                    <div className="h-3 w-8 rounded bg-[var(--secondary)] ml-auto" />
                  </div>
                </div>
              </div>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
            </div>
            <p className="font-semibold text-[var(--foreground)]">No tasks right now</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-xs mx-auto">
              New tasks are added regularly — check back soon.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task: any) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const isLocked = task.locked === true;
  const payoutCad: number = task.payout_cad ?? 0;
  const creditsAmount = Math.round(payoutCad * 100);

  return (
    <Link
      to={isLocked ? "#" : `/tasks/${task.id}`}
      aria-disabled={isLocked}
      className={[
        "flex items-start justify-between gap-4 p-4 sm:p-5 rounded-xl border bg-[var(--surface)] transition-all",
        isLocked
          ? "border-[var(--border)] opacity-60 cursor-not-allowed"
          : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-sm",
      ].join(" ")}
      onClick={isLocked ? (e) => e.preventDefault() : undefined}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug mb-1.5">{task.title}</h3>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {task.task_type && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--foreground-muted)] font-medium">
              {TASK_TYPE_LABEL[task.task_type] ?? task.task_type}
            </span>
          )}
          {task.effort_minutes && (
            <span className="text-xs text-[var(--foreground-faint)] flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {task.effort_minutes} min
            </span>
          )}
          {task.current_completions != null && task.max_completions != null && (
            <span className="text-xs text-[var(--foreground-faint)]">
              {task.max_completions - task.current_completions} spots left
            </span>
          )}
          {isLocked && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 font-medium">
              {task.lock_reason ?? "Level required"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 text-right pt-0.5">
        <span className="block text-[var(--success)] font-bold text-lg tabular-nums leading-tight">
          ${payoutCad.toFixed(2)}
        </span>
        <span className="block text-xs text-[var(--foreground-faint)] mt-0.5 tabular-nums">
          {creditsAmount} Credits
        </span>
      </div>
    </Link>
  );
}
