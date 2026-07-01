import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.POLL_SECRET || "dev-secret"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if column exists
    const tableInfo: any[] = await prisma.$queryRaw`
      PRAGMA table_info("Invoice")
    `;
    
    const hasPaymentAddress = tableInfo.some((col) => col.name === "paymentAddress");
    
    if (!hasPaymentAddress) {
      await prisma.$executeRaw`ALTER TABLE "Invoice" ADD COLUMN "paymentAddress" TEXT`;
      return NextResponse.json({ success: true, message: "Added paymentAddress column" });
    }
    
    return NextResponse.json({ success: true, message: "Column already exists" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
