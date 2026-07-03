import { useEffect, useState } from "react";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

export default function Admin() {
  const [tab, setTab] = useState<"tasks" | "payouts">("tasks");
  const [tasks, setTasks] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTab();
  }, [tab]);

  async function loadTab() {
    setLoading(true);
    setMessage("");
    try {
      if (tab === "tasks") {
        const res = await fetchApi("/api/admin/tasks");
        const data = await res.json();
        setTasks(data.tasks || []);
      } else {
        const res = await fetchApi("/api/admin/payouts/pending");
        const data = await res.json();
        setPayouts(data.payouts || []);
      }
    } catch {
      setMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function approveCompletion(taskId: number, completionId: number) {
    try {
      const res = await fetchApi(`/api/admin/tasks/${taskId}/review`, {
        method: "POST",
        body: JSON.stringify({ completion_id: completionId, status: "approved" }),
      });
      if (res.ok) {
        setMessage("Completion approved");
        loadTab();
      }
    } catch {
      setMessage("Approval failed");
    }
  }

  async function rejectCompletion(taskId: number, completionId: number) {
    try {
      const res = await fetchApi(`/api/admin/tasks/${taskId}/review`, {
        method: "POST",
        body: JSON.stringify({ completion_id: completionId, status: "rejected" }),
      });
      if (res.ok) {
        setMessage("Completion rejected");
        loadTab();
      }
    } catch {
      setMessage("Rejection failed");
    }
  }

  async function approvePayout(payoutId: number) {
    try {
      const res = await fetchApi(`/api/admin/payouts/${payoutId}/approve`, { method: "POST" });
      if (res.ok) {
        setMessage("Payout approved");
        loadTab();
      } else {
        const data = await res.json();
        setMessage(data.error || "Approval failed");
      }
    } catch {
      setMessage("Approval failed");
    }
  }

  async function rejectPayout(payoutId: number) {
    try {
      const res = await fetchApi(`/api/admin/payouts/${payoutId}/reject`, { method: "POST" });
      if (res.ok) {
        setMessage("Payout rejected");
        loadTab();
      } else {
        const data = await res.json();
        setMessage(data.error || "Rejection failed");
      }
    } catch {
      setMessage("Rejection failed");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
            {message}
          </div>
        )}

        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-zinc-900 inline-flex">
          <button
            onClick={() => setTab("tasks")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "tasks" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Tasks & Completions
          </button>
          <button
            onClick={() => setTab("payouts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "payouts" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Pending Payouts
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : tab === "tasks" ? (
          <div className="space-y-4">
            {tasks.length === 0 && <p className="text-muted-foreground">No tasks to review.</p>}
            {tasks.map((task: any) => (
              <details key={task.id} className="p-4 rounded-xl border border-zinc-800 bg-card group">
                <summary className="cursor-pointer font-medium">
                  {task.title}
                  <span className="text-xs ml-2 text-muted-foreground">
                    ({task.completion_count} completions)
                  </span>
                </summary>
                {(!task.completions || task.completions.length === 0) ? (
                  <p className="text-muted-foreground text-sm mt-3">No pending completions.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {task.completions.map((c: any) => (
                      <div key={c.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">User #{c.user_id}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(c.completed_at).toLocaleDateString("en-CA")}
                            </p>
                            {c.proof_data && (
                              <pre className="text-xs bg-zinc-950 rounded p-2 mt-2 overflow-auto max-h-32">
                                {c.proof_data}
                              </pre>
                            )}
                          </div>
                          {c.status === "pending" && (
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => approveCompletion(task.id, c.id)}
                                className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectCompletion(task.id, c.id)}
                                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 border border-red-500/20"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {c.status !== "pending" && (
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              c.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {c.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </details>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {payouts.length === 0 && <p className="text-muted-foreground">No pending payouts.</p>}
            {payouts.map((p: any) => (
              <div key={p.id} className="p-4 rounded-xl border border-zinc-800 bg-card flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">User #{p.user_id}</p>
                  <p className="text-sm text-muted-foreground">{p.paypal_email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Requested {new Date(p.created_at).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-emerald-400">${p.amount_cad.toFixed(2)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => approvePayout(p.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectPayout(p.id)}
                      className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 border border-red-500/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
