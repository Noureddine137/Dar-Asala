"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  clearLoginAttempts,
  constantTimeEqual,
  createAdminSessionToken,
  isLoginRateLimited,
  recordFailedLogin,
} from "./auth";

function safeNextPath(next: FormDataEntryValue | null) {
  const value = String(next ?? "/admin");
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isLoginRateLimited(ip)) {
    redirect(`/admin/login?error=rate_limited&next=${encodeURIComponent(next)}`);
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  const ok =
    expectedUsername.length > 0 &&
    expectedPassword.length > 0 &&
    constantTimeEqual(username, expectedUsername) &&
    constantTimeEqual(password, expectedPassword);

  if (!ok) {
    recordFailedLogin(ip);
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  clearLoginAttempts(ip);
  const token = await createAdminSessionToken();
  if (!token) {
    redirect("/admin/login?error=not_configured");
  }

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(next);
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete({ name: ADMIN_SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
