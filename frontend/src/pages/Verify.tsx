import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode, verifyCode } from "../utils/auth";

export default function Verify() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    setMessage("");
    try {
      const response = await sendVerificationCode();
      if (response.success) {
        setStatus("sent");
        setMessage("Code sent to your email. Check your inbox and spam folder.");
      } else {
        setStatus("error");
        setMessage("Failed to send code. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setMessage("");
    try {
      await verifyCode(code);
      setStatus("done");
      setMessage("Email verified! Taking you to your tasks…");
      setTimeout(() => navigate("/tasks"), 1200);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "idle") {
    handleSend();
    setStatus("sent");
  }

  const statusStyle = {
    done: "bg-[var(--success-bg)] border-[var(--success)]/30 text-[var(--success)]",
    error: "bg-[var(--destructive-bg)] border-[var(--destructive)]/20 text-[var(--destructive)]",
    sent: "bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground-muted)]",
    idle: "",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary)] mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.05 10.82 19.79 19.79 0 011 2.22 2 2 0 012.96 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">Verify your email</h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            {status === "done" ? "Account verified!" : "Enter the 6-digit code we sent to your email"}
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg border mb-5 text-sm ${statusStyle[status]}`}>
            {message}
          </div>
        )}

        {status !== "done" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-center">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(val);
                }}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-center text-2xl tracking-[0.5rem] focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20 transition-colors"
                placeholder="000000"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying…" : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="w-full py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
