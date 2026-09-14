import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "hl_session";

/**
 * Lightweight session check.
 *
 * The actual session validation is handled by the dashboard layout.
 * The proxy only checks whether the session cookie exists, avoiding
 * duplicate JWT verification at the edge.
 */
export default function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
