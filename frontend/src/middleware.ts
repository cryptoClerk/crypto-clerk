import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/help", "/api/webhooks/stripe"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/api/health")) {
    return NextResponse.next();
  }

  // For dashboard routes, check auth
  if (pathname.startsWith("/dashboard")) {
    // TODO: When Supabase auth is configured, check session here
    // For now, allow all (IP-based auth handles free tier limits)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
