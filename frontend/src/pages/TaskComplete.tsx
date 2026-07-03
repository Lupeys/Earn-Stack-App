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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-red-400">{error || "Task not found"}</p>
          <Link to="/tasks" className="text-emerald-400 hover:underline text-sm mt-4 inline-block">
            &larr; Back to tasks
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/tasks" className="text-emerald-400 hover:underline text-sm mb-6 inline-block">
          &larr; Back to tasks
        </Link>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-card mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 mb-3 inline-block">
            {task.task_type.replace("_", " ")}
          </span>
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <p className="text-muted-foreground leading-relaxed mb-4">{task.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>~{task.effort_minutes} min</span>
            <span className="text-emerald-400 font-bold">${task.payout_cad.toFixed(2)} CAD</span>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your proof has been submitted for review. You'll see it in your earnings ledger once approved.
            </p>
            <Link
              to="/earnings"
              className="inline-block px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
            >
              View Earnings
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Proof of Completion
              </label>
              <textarea
                value={proofData}
                onChange={(e) => setProofData(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-card text-foreground focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Describe what you did, include screenshots or links..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be thorough — all submissions are manually reviewed.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
