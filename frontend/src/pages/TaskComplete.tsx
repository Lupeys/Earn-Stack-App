import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

export default function TaskComplete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [proofData, setProofData] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchApi(`/api/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => setTask(data.task))
      .catch(() => setError("Failed to load task"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!proofData.trim()) {
      setError("Please provide proof of completion");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetchApi(`/api/tasks/${id}/complete`, {
        method: "POST",
        body: JSON.stringify({ proof_data: proofData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-3">
            <div className="h-6 w-32 rounded bg-[var(--secondary)] animate-pulse" />
            <div className="h-36 rounded-xl bg-[var(--secondary)] animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-[var(--destructive)] text-sm">{error || "Task not found"}</p>
          <Link to="/tasks" className="text-[var(--primary)] hover:underline text-sm mt-4 inline-block">← Back to tasks</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/tasks" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Tasks
        </Link>

        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] mb-5">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--foreground-muted)] capitalize mb-3 inline-block">
            {task.task_type.replace("_", " ")}
          </span>
          <h1 className="text-xl font-bold mb-2">{task.title}</h1>
          <p className="text-[var(--foreground-muted)] leading-relaxed mb-4 text-sm">{task.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--foreground-muted)]">{task.effort_minutes} min</span>
            <span className="text-[var(--success)] font-bold">${task.payout_cad.toFixed(2)} CAD</span>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-xl border border-[var(--success)]/30 bg-[var(--success-bg)] text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--success)]/10 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--success)] mb-2">Submitted for review</h2>
            <p className="text-sm text-[var(--foreground-muted)] mb-5">
              Your proof is pending manual review. Once approved it will appear in your earnings ledger.
            </p>
            <Link
              to="/earnings"
              className="inline-block px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              View Earnings
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[var(--destructive-bg)] border border-[var(--destructive)]/20 text-[var(--destructive)] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Proof of completion</label>
              <textarea
                value={proofData}
                onChange={(e) => setProofData(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 transition-colors resize-none"
                placeholder="Describe what you completed. Include screenshots, order numbers, or links as required."
              />
              <p className="text-xs text-[var(--foreground-faint)] mt-1.5">
                All submissions are manually reviewed. Be thorough to avoid rejection.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
