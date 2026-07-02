import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Health check endpoint for monitoring and uptime checks
 * Returns system status, database connectivity, and service health
 */
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    const checks = {
      database: "healthy",
      api: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };

    return NextResponse.json({
      status: "healthy",
      checks,
    }, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json({
      status: "unhealthy",
      checks: {
        database: "unhealthy",
        api: "healthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }, {
      status: 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
