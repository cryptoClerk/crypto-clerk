import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const statements = await prisma.statement.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: statements });
  } catch (error) {
    console.error("Statement history error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
