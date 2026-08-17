import type { Metadata } from "next";
import { loginAdmin } from "@/lib/admin/login-actions";

export const metadata: Metadata = { title: "Admin Sign In | Dar Asala", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ error?: string; next?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

  const errorMessage =
    error === "invalid"
      ? "Incorrect username or password."
      : error === "rate_limited"
        ? "Too many attempts. Please wait a few minutes and try again."
        : error === "not_configured"
          ? "Admin session signing is not configured on the server."
          : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 font-sans text-charcoal">
      <div className="w-full max-w-sm">
        <h1 className="font-serif-display text-2xl">
          Dar Asala <span className="text-muted">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage the store.</p>

        {errorMessage && (
          <p className="mt-5 rounded-sm border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
            {errorMessage}
          </p>
        )}

        <form action={loginAdmin} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
              Username
            </label>
            <input id="username" name="username" required autoComplete="username" className="input" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
            />
          </div>
          <button type="submit" className="w-full rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
