export interface AuthPayload {
  userId: number;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "earnstack-dev-secret-change-in-production";

function base64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, { algorithm: "bcrypt", cost: 12 });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash, "bcrypt");
}

export async function createToken(payload: AuthPayload): Promise<string> {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  }));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );

  const signature = base64url(String.fromCharCode(...new Uint8Array(sig)));
  return `${header}.${body}.${signature}`;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(
      atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );

    if (!valid) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export function getUserById(db: any, userId: number) {
  return db.query("SELECT id, email, display_name, verified, created_at FROM users WHERE id = ?").get(userId);
}

export function getUserByEmail(db: any, email: string) {
  return db.query("SELECT * FROM users WHERE email = ?").get(email);
}
