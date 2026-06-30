/**
 * Simple IP-based scoping middleware.
 * Used for free tier tracking until Supabase/Clerk auth is configured.
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
  
  // When Supabase auth is added, check for session/token here
  // and return { userId, isAuthenticated: true }
  
  return { ip, isAuthenticated: false };
}
