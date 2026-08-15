import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
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

  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const separatorIndex = decoded.indexOf(":");
      const user = decoded.slice(0, separatorIndex);
      const pass = decoded.slice(separatorIndex + 1);
      if (user === username && pass === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dar Asala Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
