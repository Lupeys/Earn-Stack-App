import { fetchApi, setToken, clearToken, getToken, isLoggedIn } from "./api";

export interface AuthState {
  user: UserData | null;
  loading: boolean;
}

export interface UserData {
  id: number;
  email: string;
  display_name: string;
  verified: boolean;
}

export async function login(email: string, password: string): Promise<UserData> {
  const res = await fetchApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  setToken(data.token);
  return data.user;
}

export async function register(email: string, password: string, display_name: string): Promise<UserData> {
  const res = await fetchApi("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  setToken(data.token);
  return data.user;
}

export function logout() {
  clearToken();
  window.location.href = "/";
}

export async function getMe(): Promise<UserData | null> {
  if (!isLoggedIn()) return null;
  try {
    const res = await fetchApi("/api/auth/me");
    if (!res.ok) {
      clearToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function sendVerificationCode(): Promise<{ success: boolean; message: string }> {
  const res = await fetchApi("/api/verify/send", { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send code");
  return { success: data.sent, message: data.message };
}

export async function verifyCode(code: string): Promise<boolean> {
  const res = await fetchApi("/api/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Verification failed");
  return data.verified;
}

export async function getUser(): Promise<UserData | null> {
  return getMe();
}

export { isLoggedIn, getToken };
