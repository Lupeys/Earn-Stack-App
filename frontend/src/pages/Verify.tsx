import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode, verifyCode, getUser } from "../utils/auth";

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
        setMessage("Code sent to your email. Check your inbox (and spam folder).");
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
      setMessage("Email verified! Redirecting...");
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-send code on mount if no code sent yet
  if (status === "idle") {
    handleSend();
    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {status === "sent" || status === "idle"
              ? "We sent a 6-digit code to your email"
              : status === "done"
              ? "Account verified!"
              : "Verification needed to continue"}
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 text-sm ${
              status === "done"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : status === "error"
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
            }`}
          >
            {message}
          </div>
        )}

        {status !== "done" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">6-digit code</label>
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
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-card text-foreground text-center text-2xl tracking-[0.5rem] focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="000000"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="w-full py-2 text-sm text-emerald-400 hover:underline"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
