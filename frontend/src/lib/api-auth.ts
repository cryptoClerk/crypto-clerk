import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid Authorization header. Use: Bearer <api-key>" };
  }

  const apiKey = authHeader.slice(7);

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!keyRecord) {
      return { valid: false, error: "Invalid API key" };
    }

    // Update last used
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsed: new Date() },
    });

    return { valid: true, userId: keyRecord.userId || undefined };
  } catch (error) {
    console.error("API key validation error:", error);
    return { valid: false, error: "Internal error" };
  }
}

export function apiAuthMiddleware(handler: (req: NextRequest, userId?: string) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await validateApiKey(request);
    
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    return handler(request, auth.userId);
  };
}
