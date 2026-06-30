import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "ok",
      },
    });
  } catch (error) {
    logError(error, "Health check");
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: "error",
        },
      },
      { status: 503 }
    );
  }
}
