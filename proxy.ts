import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    return new NextResponse("Admin is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.", {
      status: 503,
    });
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminSessionToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/admin/:path*",
};
