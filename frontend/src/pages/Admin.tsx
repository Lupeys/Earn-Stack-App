import { useEffect, useState } from "react";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";

const PAYPAL_FEE_RATE = 0.02;

type Submission = {
  id: number;
  task_id: number;
  task_title: string;
  user_id: number;
  user_email: string;
  display_name: string;
  proof_data: string;
  status: string;
  submitted_at: string;
  reviewer_notes: string | null;
};

type Payout = {
  id: number;
  user_id: number;
  user_email: string;
  display_name: string;
  paypal_email: string;
  amount_cad: number;
  status: string;
  requested_at: string;
};

type Task = {
  id: number;
  title: string;
  task_type: string;
  payout_cad: number;
  effort_minutes: number;
  current_completions: number;
  max_completions: number;
  status: string;
};

export default function Admin() {
  const [tab, setTab] = useState<"submissions" | "payouts" | "tasks">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    loadTab();
  }, [tab]);

  function notify(msg: string, type: "success" | "error" = "success") {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3500);
  }

  async function loadTab() {
    setLoading(true);
    try {
      if (tab === "submissions") {
        const res = await fetchApi("/api/admin/submissions");
        const data = await res.json();
        setSubmissions(data.submissions || []);
      } else if (tab === "payouts") {
        const res = await fetchApi("/api/admin/payouts");
        const data = await res.json();
        setPayouts(data.payouts || []);
      } else {
        const res = await fetchApi("/api/admin/tasks");
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch {
      notify("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function reviewSubmission(id: number, status: "approved" | "rejected" | "flagged", notes?: string) {
    try {
      const res = await fetchApi(`/api/admin/submissions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status, notes: notes || null }),
      });
      const data = await res.json();
      if (res.ok) {
        notify(`Submission ${status}`);
        loadTab();
      } else {
        notify(data.error || "Action failed", "error");
      }
    } catch {
      notify("Request failed", "error");
    }
  }

  async function reviewPayout(id: number, action: "approve" | "reject") {
    try {
      const res = await fetchApi(`/api/admin/payouts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        notify(action === "approve" ? "Payout approved — sent via PayPal" : "Payout rejected");
        loadTab();
      } else {
        notify(data.error || "Action failed", "error");
      }
    } catch {
      notify("Request failed", "error");
    }
  }

  const submissionsByTask = submissions.reduce<Record<string, Submission[]>>((acc, s) => {
    const key = `${s.task_id}::${s.task_title}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 border ${
            messageType === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-zinc-900 inline-flex">
          {(["submissions", "payouts", "tasks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t === "submissions" ? "Pending Reviews" : t === "payouts" ? "Pending Payouts" : "Tasks"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : tab === "submissions" ? (
          /* ── Submissions tab ── */
          <div className="space-y-4">
            {Object.keys(submissionsByTask).length === 0 && (
              <p className="text-muted-foreground">No pending submissions. 🎉</p>
            )}
            {Object.entries(submissionsByTask).map(([key, subs]) => {
              const [, taskTitle] = key.split("::");
              return (
                <details key={key} open className="rounded-xl border border-zinc-800 bg-card">
                  <summary className="cursor-pointer px-4 py-3 font-medium flex items-center justify-between">
                    <span>{taskTitle}</span>
                    <span className="text-xs text-muted-foreground">{subs.length} pending</span>
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    {subs.map((s) => (
                      <div key={s.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{s.display_name}</p>
                            <p className="text-xs text-muted-foreground">{s.user_email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(s.submitted_at).toLocaleString("en-CA")}
                            </p>
                            {s.proof_data && (
                              <pre className="text-xs bg-zinc-950 rounded p-2 mt-2 overflow-auto max-h-32 whitespace-pre-wrap break-words">
                                {s.proof_data}
                              </pre>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0 mt-1">
                            <button
                              onClick={() => reviewSubmission(s.id, "approved")}
                              className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reviewSubmission(s.id, "rejected")}
                              className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 border border-red-500/20 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => reviewSubmission(s.id, "flagged", "Flagged for manual review")}
                              className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 border border-yellow-500/20 transition-colors"
                            >
                              Flag
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        ) : tab === "payouts" ? (
          /* ── Payouts tab ── */
          <div className="space-y-4">
            {payouts.length === 0 && <p className="text-muted-foreground">No pending payouts.</p>}
            {payouts.map((p) => {
              const fee = p.amount_cad * PAYPAL_FEE_RATE;
              return (
                <div key={p.id} className="p-4 rounded-xl border border-zinc-800 bg-card flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{p.display_name}</p>
                    <p className="text-sm text-muted-foreground">{p.user_email}</p>
                    <p className="text-xs text-muted-foreground">PayPal: {p.paypal_email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Requested {new Date(p.requested_at).toLocaleString("en-CA")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-emerald-400">${p.amount_cad.toFixed(2)} CAD</p>
                    <p className="text-xs text-muted-foreground">+${fee.toFixed(2)} PayPal fee</p>
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => reviewPayout(p.id, "approve")}
                        className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewPayout(p.id, "reject")}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 border border-red-500/20 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Tasks tab ── */
          <div className="space-y-3">
            {tasks.length === 0 && <p className="text-muted-foreground">No tasks found.</p>}
            {tasks.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-zinc-800 bg-card flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    {t.task_type.replace("_", " ")} · ${t.payout_cad.toFixed(2)} CAD · {t.effort_minutes ?? "?"} min
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.current_completions}/{t.max_completions === 0 ? "∞" : t.max_completions} completions
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                  t.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-700/30 text-zinc-400 border-zinc-700"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
