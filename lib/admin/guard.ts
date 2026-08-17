import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "./auth";

/**
 * Defense-in-depth: called at the top of every admin Server Action. The proxy
 * (proxy.ts) already gates every /admin/* request on the same session cookie, but
 * Server Actions are dispatched by an internal action ID rather than strictly by
 * pathname, so each action re-checks the session itself instead of relying only
 * on route matching.
 */
export async function requireAdminSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);
  if (!valid) {
    throw new Error("Not authenticated.");
  }
}
