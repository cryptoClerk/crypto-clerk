import { supabase } from "./supabase";

/**
 * Simple IP-based scoping middleware.
 * Used for free tier tracking until Supabase/Clerk auth is configured.
 * When Supabase auth is added, check for session/token here
 * and return { userId, isAuthenticated: true }
 */

export function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function requireAuth(request: Request): Promise<{ 
  ip: string; 
  userId?: string;
  isAuthenticated: boolean;
}> {
  const ip = getClientIP(request);
  
  // If Supabase is not configured, fall back to IP-based auth
  if (!supabase) {
    return { ip, isAuthenticated: false };
  }

  // Check for Supabase session/token
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (user && !error) {
      return { ip, userId: user.id, isAuthenticated: true };
    }
  }
  
  return { ip, isAuthenticated: false };
}
