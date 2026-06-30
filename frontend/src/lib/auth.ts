/**
 * Simple IP-based scoping middleware as a temporary auth measure.
 * TODO: Replace with real auth (Supabase/Clerk) before public launch.
 */

export function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function requireAuth(request: Request): { ip: string; isAuthenticated: false } {
  const ip = getClientIP(request);
  
  // TODO: When real auth is implemented, check for session/token here
  // and return { userId, isAuthenticated: true }
  
  return { ip, isAuthenticated: false };
}
