/**
 * Signed, expiring admin session tokens (HMAC-SHA256 via Web Crypto).
 *
 * Runs both in the Edge-capable proxy (proxy.ts) and in Node server actions, so it uses only
 * Web Crypto (`crypto.subtle`), which is available in both runtimes — no Node-only `crypto`
 * module, no extra dependency like `jose`.
 *
 * Token shape: `<base64url(JSON {exp})>.<base64url(HMAC-SHA256 signature))>`. There is no
 * user database — this signs a single boolean "is the configured admin" claim, matching the
 * single shared ADMIN_USERNAME/ADMIN_PASSWORD credential this store already uses. It replaces
 * raw HTTP Basic Auth with a real, revocable, expiring session (with logout) instead of a
 * credential the browser caches indefinitely.
 */

export const ADMIN_SESSION_COOKIE = "da_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

let warnedMissingSecret = false;

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;

  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!username || !password) return null;

  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      "[admin-auth] ADMIN_SESSION_SECRET is not set — deriving the session-signing key from " +
        "ADMIN_USERNAME/ADMIN_PASSWORD instead. Set a dedicated ADMIN_SESSION_SECRET in production " +
        "so rotating the admin password doesn't also invalidate every open session (and vice versa)."
    );
  }
  return `${username}:${password}`;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 });
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(payload));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  try {
    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sigB64),
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// ---------------------------------------------------------------------------
// Login rate limiting — in-memory, per server instance. On a single-instance
// deployment this meaningfully slows down credential guessing; on a
// multi-instance deployment each instance tracks its own counters, so treat
// this as a speed bump, not a guarantee. A shared store (e.g. Redis/Upstash)
// would be the next step if that matters for your hosting setup.
// ---------------------------------------------------------------------------

const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function isLoginRateLimited(key: string): boolean {
  const entry = loginAttempts.get(key);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

export function recordFailedLogin(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearLoginAttempts(key: string) {
  loginAttempts.delete(key);
}
