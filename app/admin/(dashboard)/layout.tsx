import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { AdminMobileNav, AdminSidebarNav } from "@/components/admin/nav";
import { logoutAdmin } from "@/lib/admin/login-actions";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory font-sans text-charcoal">
      <div className="border-b border-sand/70">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-4 md:px-6">
          <Link href="/admin" className="font-serif-display text-xl">
            Dar Asala <span className="text-sm text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-charcoal">
              View Store →
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="flex items-center gap-1.5 text-muted hover:text-charcoal">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-sand/60 px-4 py-2.5 md:hidden">
          <AdminMobileNav />
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 py-8 md:px-6 md:py-10">
        <aside className="hidden w-48 shrink-0 md:block">
          <div className="sticky top-8">
            <AdminSidebarNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
