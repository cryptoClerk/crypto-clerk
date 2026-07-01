import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

function generateApiKey(): string {
  return `cb_${randomBytes(32).toString("hex")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const key = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        name,
        userId: userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only shown once
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    console.error("API key creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const keys = await prisma.apiKey.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        lastUsed: true,
        createdAt: true,
        // Don't return the actual key
      },
    });

    return NextResponse.json({ success: true, data: keys });
  } catch (error) {
    console.error("API key list error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
