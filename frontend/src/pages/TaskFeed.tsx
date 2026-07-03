import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import Navbar from "@/components/Navbar";
import type { Task } from "@/types";

export default function TaskFeed() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

        {loading && <p className="text-muted-foreground">Loading tasks...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No tasks available right now.</p>
            <p className="text-muted-foreground text-sm mt-1">Check back soon — new tasks are added regularly.</p>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task: any) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="block p-5 rounded-2xl border border-zinc-800 bg-card hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">{task.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{task.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {task.task_type.replace("_", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ~{task.effort_minutes} min
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.current_completions}/{task.max_completions} spots
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-emerald-400 font-bold text-lg">${task.payout_cad.toFixed(2)}</span>
                  <span className="block text-xs text-muted-foreground">CAD</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
